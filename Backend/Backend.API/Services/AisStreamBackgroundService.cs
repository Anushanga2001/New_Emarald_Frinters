using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text.Json;
using System.Text.Json.Serialization;
using Backend.API.Hubs;
using Backend.Application.DTOs.Vessels;
using Microsoft.AspNetCore.SignalR;

namespace Backend.API.Services
{
    public class AisStreamBackgroundService : BackgroundService
    {
        private const string AisStreamUrl = "wss://stream.aisstream.io/v0/stream";
        private static readonly TimeSpan StaleSweepInterval = TimeSpan.FromMinutes(2);
        private static readonly TimeSpan StaleAge = TimeSpan.FromMinutes(30);

        // Global bbox used when tracking specific MMSIs (AISStream still requires a box).
        private static readonly double[] GlobalBox = { -90.0, -180.0, 90.0, 180.0 };

        private readonly VesselCache _cache;
        private readonly TrackedMmsiStore _tracked;
        private readonly IHubContext<VesselsHub> _hub;
        private readonly ILogger<AisStreamBackgroundService> _logger;
        private readonly IConfiguration _config;

        private readonly ConcurrentDictionary<long, long> _lastBroadcastMs = new();

        // Cancelled when the tracked MMSI list changes — forces a fresh subscription.
        private CancellationTokenSource? _resubscribeCts;

        public AisStreamBackgroundService(
            VesselCache cache,
            TrackedMmsiStore tracked,
            IHubContext<VesselsHub> hub,
            ILogger<AisStreamBackgroundService> logger,
            IConfiguration config)
        {
            _cache = cache;
            _tracked = tracked;
            _hub = hub;
            _logger = logger;
            _config = config;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _tracked.Changed += OnTrackedChanged;
            try
            {
                var apiKey = _config["AisStream:ApiKey"];
                var sweepTask = RunSweeperAsync(stoppingToken);

                if (string.IsNullOrWhiteSpace(apiKey))
                {
                    _logger.LogWarning("AisStream:ApiKey not configured. Falling back to mock vessel data. " +
                                       "Get a free key at https://aisstream.io and set AisStream:ApiKey to use real data.");
                    await RunMockAsync(stoppingToken);
                }
                else
                {
                    await RunRealAsync(apiKey, stoppingToken);
                }

                await sweepTask;
            }
            finally
            {
                _tracked.Changed -= OnTrackedChanged;
            }
        }

        private void OnTrackedChanged()
        {
            // Trip the active connection so the outer loop re-subscribes with the new MMSI list.
            try { _resubscribeCts?.Cancel(); }
            catch (ObjectDisposedException) { /* already disposed — fine */ }
        }

        private async Task RunSweeperAsync(CancellationToken ct)
        {
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(StaleSweepInterval, ct);
                    var removed = _cache.SweepStale(StaleAge);
                    foreach (var mmsi in removed)
                    {
                        _lastBroadcastMs.TryRemove(mmsi, out _);
                        await _hub.Clients.All.SendAsync("VesselRemoved", mmsi, ct);
                    }
                }
                catch (OperationCanceledException) { return; }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during vessel cache sweep");
                }
            }
        }

        // ─────────────────────────── Real AISStream ───────────────────────────
        private async Task RunRealAsync(string apiKey, CancellationToken stoppingToken)
        {
            var bbox = _config.GetSection("AisStream:BoundingBox").Get<double[]>()
                       ?? new[] { 5.0, 79.0, 10.0, 82.0 };

            var throttleMs = _config.GetValue("AisStream:ThrottleSeconds", 10) * 1000;

            while (!stoppingToken.IsCancellationRequested)
            {
                using var resubCts = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken);
                _resubscribeCts = resubCts;
                var ct = resubCts.Token;

                try
                {
                    using var ws = new ClientWebSocket();
                    await ws.ConnectAsync(new Uri(AisStreamUrl), ct);
                    await SendSubscriptionAsync(ws, apiKey, bbox, ct);
                    _logger.LogInformation("Connected to AISStream (tracked MMSIs: {Count})", _tracked.All().Count);

                    var buffer = new byte[8192];
                    var ms = new MemoryStream();
                    while (ws.State == WebSocketState.Open && !ct.IsCancellationRequested)
                    {
                        ms.SetLength(0);
                        WebSocketReceiveResult result;
                        do
                        {
                            result = await ws.ReceiveAsync(buffer, ct);
                            if (result.MessageType == WebSocketMessageType.Close)
                            {
                                _logger.LogWarning("AISStream closed connection: {Status}", result.CloseStatus);
                                break;
                            }
                            ms.Write(buffer, 0, result.Count);
                        } while (!result.EndOfMessage);

                        if (ms.Length == 0) continue;
                        await HandleMessageAsync(ms.ToArray(), throttleMs, stoppingToken);
                    }
                }
                catch (OperationCanceledException) when (resubCts.IsCancellationRequested && !stoppingToken.IsCancellationRequested)
                {
                    _logger.LogInformation("Tracked MMSI list changed — re-subscribing");
                    continue;
                }
                catch (OperationCanceledException) { return; }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "AISStream connection error — reconnecting in 5s");
                    try { await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken); }
                    catch (OperationCanceledException) { return; }
                }
            }
        }

        private async Task SendSubscriptionAsync(ClientWebSocket ws, string apiKey, double[] localBox, CancellationToken ct)
        {
            var trackedMmsis = _tracked.All();
            object subscription;
            if (trackedMmsis.Count > 0)
            {
                // Tracking-mode: global bbox + MMSI filter (only those vessels worldwide).
                subscription = new
                {
                    APIKey = apiKey,
                    BoundingBoxes = new[] { new[] { new[] { GlobalBox[0], GlobalBox[1] }, new[] { GlobalBox[2], GlobalBox[3] } } },
                    FiltersShipMMSI = trackedMmsis.Select(m => m.ToString()).ToArray(),
                    FilterMessageTypes = new[] { "PositionReport" }
                };
            }
            else
            {
                // Default mode: local bbox, no MMSI filter.
                subscription = new
                {
                    APIKey = apiKey,
                    BoundingBoxes = new[] { new[] { new[] { localBox[0], localBox[1] }, new[] { localBox[2], localBox[3] } } },
                    FilterMessageTypes = new[] { "PositionReport" }
                };
            }
            var bytes = JsonSerializer.SerializeToUtf8Bytes(subscription);
            await ws.SendAsync(bytes, WebSocketMessageType.Text, true, ct);
        }

        private async Task HandleMessageAsync(byte[] payload, int throttleMs, CancellationToken ct)
        {
            try
            {
                var msg = JsonSerializer.Deserialize<AisMessage>(payload, JsonOpts);
                if (msg?.MessageType != "PositionReport" || msg.Message?.PositionReport is null || msg.MetaData is null)
                    return;

                var pr = msg.Message.PositionReport;
                var meta = msg.MetaData;

                var vessel = new VesselPositionDto
                {
                    Mmsi = meta.MMSI,
                    Name = string.IsNullOrWhiteSpace(meta.ShipName) ? null : meta.ShipName.Trim(),
                    Lat = pr.Latitude,
                    Lng = pr.Longitude,
                    Cog = pr.Cog,
                    Sog = pr.Sog,
                    Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                };

                _cache.Upsert(vessel);

                var lastMs = _lastBroadcastMs.GetValueOrDefault(vessel.Mmsi, 0);
                if (vessel.Timestamp - lastMs >= throttleMs)
                {
                    _lastBroadcastMs[vessel.Mmsi] = vessel.Timestamp;
                    await _hub.Clients.All.SendAsync("VesselUpdate", vessel, ct);
                }
            }
            catch (Exception ex)
            {
                _logger.LogDebug(ex, "Failed to parse AIS message");
            }
        }

        // ─────────────────────────── Mock fallback ────────────────────────────
        private async Task RunMockAsync(CancellationToken ct)
        {
            // Predefined fleet — always shown.
            var fleet = new List<MockShip>
            {
                new() { Mmsi = 419000001, Name = "MV LANKA STAR",   Lat = 6.95, Lng = 79.85, Cog = 90,  Sog = 12 },
                new() { Mmsi = 419000002, Name = "MV CEYLON DAWN",  Lat = 6.20, Lng = 81.05, Cog = 200, Sog = 8  },
                new() { Mmsi = 419000003, Name = "MV INDIAN OCEAN", Lat = 8.55, Lng = 81.20, Cog = 45,  Sog = 14 },
                new() { Mmsi = 419000004, Name = "MV GALLE TRADER", Lat = 6.05, Lng = 80.20, Cog = 270, Sog = 6  },
                new() { Mmsi = 419000005, Name = "MV COLOMBO PRIDE",Lat = 7.10, Lng = 79.70, Cog = 180, Sog = 11 },
            };
            var fleetByMmsi = fleet.ToDictionary(s => s.Mmsi);

            // Synthetic ships generated for any tracked MMSI not in the predefined fleet.
            var synthetic = new ConcurrentDictionary<long, MockShip>();
            var rng = new Random(42);

            while (!ct.IsCancellationRequested)
            {
                // Add synthetic ships for any newly-tracked MMSIs we don't already have.
                foreach (var mmsi in _tracked.All())
                {
                    if (fleetByMmsi.ContainsKey(mmsi)) continue;
                    synthetic.GetOrAdd(mmsi, m =>
                    {
                        var lat = rng.NextDouble() * 4 + 4;   // 4..8
                        var lng = rng.NextDouble() * 8 + 76;  // 76..84
                        return new MockShip
                        {
                            Mmsi = m,
                            Name = $"TRACKED {m}",
                            Lat = lat,
                            Lng = lng,
                            Cog = rng.NextDouble() * 360,
                            Sog = 8 + rng.NextDouble() * 8,
                        };
                    });
                }
                // Drop synthetic ships that are no longer tracked.
                foreach (var key in synthetic.Keys.ToArray())
                {
                    if (!_tracked.Contains(key))
                    {
                        synthetic.TryRemove(key, out _);
                        await _hub.Clients.All.SendAsync("VesselRemoved", key, ct);
                    }
                }

                foreach (var s in fleet.Concat(synthetic.Values))
                {
                    var rad = s.Cog * Math.PI / 180.0;
                    var stepDeg = (s.Sog * 5.0) / 3600.0;
                    s.Lat += stepDeg * Math.Cos(rad);
                    s.Lng += stepDeg * Math.Sin(rad);

                    if (s.Lat < 5 || s.Lat > 10) s.Cog = (s.Cog + 180) % 360;
                    if (s.Lng < 79 || s.Lng > 82) s.Cog = (s.Cog + 180) % 360;

                    var vessel = new VesselPositionDto
                    {
                        Mmsi = s.Mmsi,
                        Name = s.Name,
                        Lat = s.Lat,
                        Lng = s.Lng,
                        Cog = s.Cog,
                        Sog = s.Sog,
                        Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                    };
                    _cache.Upsert(vessel);
                    await _hub.Clients.All.SendAsync("VesselUpdate", vessel, ct);
                }

                try { await Task.Delay(TimeSpan.FromSeconds(5), ct); }
                catch (OperationCanceledException) { return; }
            }
        }

        private class MockShip
        {
            public long Mmsi { get; set; }
            public string Name { get; set; } = "";
            public double Lat { get; set; }
            public double Lng { get; set; }
            public double Cog { get; set; }
            public double Sog { get; set; }
        }

        // ─────────────────────────── AIS message DTOs ─────────────────────────
        private static readonly JsonSerializerOptions JsonOpts = new()
        {
            PropertyNameCaseInsensitive = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        private class AisMessage
        {
            public string? MessageType { get; set; }
            public AisMessageBody? Message { get; set; }
            public AisMetaData? MetaData { get; set; }
        }
        private class AisMessageBody
        {
            public AisPositionReport? PositionReport { get; set; }
        }
        private class AisPositionReport
        {
            public double Latitude { get; set; }
            public double Longitude { get; set; }
            public double Cog { get; set; }
            public double Sog { get; set; }
        }
        private class AisMetaData
        {
            public long MMSI { get; set; }
            public string? ShipName { get; set; }
        }
    }
}
