using System.Collections.Concurrent;
using Backend.Application.DTOs.Vessels;

namespace Backend.API.Services
{
    public class VesselCache
    {
        private readonly ConcurrentDictionary<long, VesselPositionDto> _vessels = new();

        public IReadOnlyCollection<VesselPositionDto> Snapshot() => _vessels.Values.ToArray();

        public void Upsert(VesselPositionDto vessel) => _vessels[vessel.Mmsi] = vessel;

        public IReadOnlyCollection<long> SweepStale(TimeSpan maxAge)
        {
            var cutoff = DateTimeOffset.UtcNow.Subtract(maxAge).ToUnixTimeMilliseconds();
            var removed = new List<long>();
            foreach (var kv in _vessels)
            {
                if (kv.Value.Timestamp < cutoff && _vessels.TryRemove(kv.Key, out _))
                {
                    removed.Add(kv.Key);
                }
            }
            return removed;
        }
    }
}
