using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Application.DTOs.Quotes;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Backend.Infrastructure.Data;

namespace Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Base rates per service type (USD)
        private static readonly Dictionary<ServiceType, (decimal BaseRate, decimal WeightRate, decimal DistanceRate, int EstimatedDays)> ServiceRates = new()
        {
            { ServiceType.SeaFreightFCL, (1500m, 0m, 0.50m, 14) },      // FCL: flat container rate + distance
            { ServiceType.SeaFreightLCL, (200m, 0.80m, 0.30m, 18) },    // LCL: base + per kg + distance
            { ServiceType.AirFreight, (150m, 5.00m, 0.10m, 3) },        // Air: fast but expensive per kg
            { ServiceType.LandTransport, (50m, 0.50m, 0.75m, 1) },      // Land: cheaper, distance-based
            { ServiceType.Standard, (50m, 2.00m, 0.50m, 5) },
            { ServiceType.Express, (100m, 3.00m, 0.75m, 2) },
            { ServiceType.Overnight, (200m, 5.00m, 1.00m, 1) }
        };

        // Container size multipliers
        private static readonly Dictionary<string, decimal> ContainerMultipliers = new()
        {
            { "20ft", 1.0m },
            { "40ft", 1.8m },
            { "40hc", 2.0m },
            { "45hc", 2.2m }
        };

        // Cargo type surcharges (percentage)
        private static readonly Dictionary<string, decimal> CargoSurcharges = new()
        {
            { "General Cargo", 0m },
            { "Electronics", 0.10m },
            { "Machinery", 0.15m },
            { "Textiles & Garments", 0.05m },
            { "Food & Beverages", 0.12m },
            { "Chemicals", 0.25m },
            { "Vehicles", 0.20m },
            { "Fragile Items", 0.18m },
            { "Hazardous Materials", 0.35m },
            { "Refrigerated Goods", 0.30m }
        };

        // Region-based distance estimates (km) for shipping routes
        private static readonly Dictionary<string, decimal> RegionDistances = new()
        {
            { "Asia", 2000m },
            { "Middle East", 4000m },
            { "Europe", 8000m },
            { "North America", 15000m },
            { "Africa", 6000m },
            { "Australia", 5000m },
            { "Local", 200m }
        };

        // USD to LKR exchange rate
        private const decimal UsdToLkrRate = 320m;

        public QuotesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("calculate")]
        public ActionResult<QuoteResponseDto> CalculateQuote([FromBody] CalculateQuoteDto dto)
        {
            try
            {
                var serviceType = ParseServiceType(dto.Service);
                if (!ServiceRates.TryGetValue(serviceType, out var rates))
                {
                    return BadRequest(new { message = $"Unknown service type: {dto.Service}" });
                }

                // Calculate distance based on destination
                var distance = EstimateDistance(dto.Destination);

                // Base calculation
                decimal price = rates.BaseRate;
                price += dto.Weight * rates.WeightRate;
                price += distance * rates.DistanceRate;

                // Apply container multiplier for FCL
                if (serviceType == ServiceType.SeaFreightFCL && !string.IsNullOrEmpty(dto.ContainerSize))
                {
                    if (ContainerMultipliers.TryGetValue(dto.ContainerSize, out var multiplier))
                    {
                        price *= multiplier;
                    }
                }

                // Apply cargo type surcharge
                if (CargoSurcharges.TryGetValue(dto.CargoType, out var surcharge))
                {
                    price += price * surcharge;
                }

                // Convert currency if needed
                var finalPrice = dto.Currency == "LKR" ? price * UsdToLkrRate : price;

                var result = new QuoteResponseDto
                {
                    Origin = dto.Origin,
                    Destination = dto.Destination,
                    Service = dto.Service,
                    CargoType = dto.CargoType,
                    Weight = dto.Weight,
                    ContainerSize = dto.ContainerSize,
                    Price = Math.Round(finalPrice, 2),
                    Currency = dto.Currency,
                    EstimatedDays = rates.EstimatedDays,
                    Distance = distance,
                    IsBooked = false,
                    CreatedAt = DateTime.UtcNow
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<QuoteResponseDto>> SaveQuote([FromBody] SaveQuoteDto dto)
        {
            try
            {
                var serviceType = ParseServiceType(dto.Service);
                var distance = EstimateDistance(dto.Destination);

                var quote = new Quote
                {
                    QuoteNumber = GenerateQuoteNumber(),
                    Origin = dto.Origin,
                    Destination = dto.Destination,
                    ServiceType = serviceType,
                    CargoType = dto.CargoType,
                    Weight = dto.Weight,
                    ContainerSize = dto.ContainerSize,
                    Price = dto.Price,
                    Currency = dto.Currency,
                    EstimatedDays = dto.EstimatedDays,
                    Distance = distance,
                    IsBooked = true,
                    BookedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Quotes.Add(quote);
                await _context.SaveChangesAsync();

                var result = new QuoteResponseDto
                {
                    Id = quote.Id,
                    QuoteNumber = quote.QuoteNumber,
                    Origin = quote.Origin,
                    Destination = quote.Destination,
                    Service = dto.Service,
                    CargoType = quote.CargoType,
                    Weight = quote.Weight,
                    ContainerSize = quote.ContainerSize,
                    Price = quote.Price,
                    Currency = quote.Currency,
                    EstimatedDays = quote.EstimatedDays,
                    Distance = quote.Distance,
                    IsBooked = quote.IsBooked,
                    CreatedAt = quote.CreatedAt
                };

                return CreatedAtAction(nameof(GetQuote), new { id = quote.Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuoteResponseDto>> GetQuote(int id)
        {
            var quote = await _context.Quotes.FindAsync(id);
            if (quote == null)
            {
                return NotFound();
            }

            return Ok(MapToResponse(quote));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuoteResponseDto>>> GetQuotes()
        {
            var quotes = await _context.Quotes
                .OrderByDescending(q => q.CreatedAt)
                .Take(100)
                .ToListAsync();

            return Ok(quotes.Select(MapToResponse));
        }

        private static ServiceType ParseServiceType(string service)
        {
            var normalized = service.ToLower().Replace(" ", "").Replace("(", "").Replace(")", "");
            
            return normalized switch
            {
                "seafreightfcl" => ServiceType.SeaFreightFCL,
                "seafreightlcl" => ServiceType.SeaFreightLCL,
                "airfreight" => ServiceType.AirFreight,
                "landtransportation" or "landtransport" => ServiceType.LandTransport,
                "standard" => ServiceType.Standard,
                "express" => ServiceType.Express,
                "overnight" => ServiceType.Overnight,
                _ => ServiceType.Standard
            };
        }

        private static decimal EstimateDistance(string destination)
        {
            var dest = destination.ToLower();
            
            // Check for local Sri Lankan destinations
            if (dest.Contains("sri lanka") || dest.Contains("colombo") || dest.Contains("kandy") ||
                dest.Contains("galle") || dest.Contains("jaffna") || dest.Contains("matara"))
            {
                return RegionDistances["Local"];
            }
            
            // International destinations
            if (dest.Contains("india") || dest.Contains("china") || dest.Contains("singapore") || 
                dest.Contains("japan") || dest.Contains("thailand") || dest.Contains("malaysia"))
            {
                return RegionDistances["Asia"];
            }
            if (dest.Contains("dubai") || dest.Contains("uae") || dest.Contains("saudi") || dest.Contains("qatar"))
            {
                return RegionDistances["Middle East"];
            }
            if (dest.Contains("uk") || dest.Contains("germany") || dest.Contains("france") || 
                dest.Contains("europe") || dest.Contains("netherlands"))
            {
                return RegionDistances["Europe"];
            }
            if (dest.Contains("usa") || dest.Contains("canada") || dest.Contains("america") || dest.Contains("mexico"))
            {
                return RegionDistances["North America"];
            }
            if (dest.Contains("australia") || dest.Contains("sydney") || dest.Contains("melbourne"))
            {
                return RegionDistances["Australia"];
            }
            if (dest.Contains("africa") || dest.Contains("kenya") || dest.Contains("south africa"))
            {
                return RegionDistances["Africa"];
            }

            // Default to Asia region distance
            return RegionDistances["Asia"];
        }

        private static string GenerateQuoteNumber()
        {
            return $"Q{DateTime.UtcNow:yyyyMMdd}{Guid.NewGuid().ToString("N")[..6].ToUpper()}";
        }

        private static QuoteResponseDto MapToResponse(Quote quote)
        {
            var serviceName = quote.ServiceType switch
            {
                ServiceType.SeaFreightFCL => "Sea Freight (FCL)",
                ServiceType.SeaFreightLCL => "Sea Freight (LCL)",
                ServiceType.AirFreight => "Air Freight",
                ServiceType.LandTransport => "Land Transportation",
                ServiceType.Standard => "Standard",
                ServiceType.Express => "Express",
                ServiceType.Overnight => "Overnight",
                _ => "Standard"
            };

            return new QuoteResponseDto
            {
                Id = quote.Id,
                QuoteNumber = quote.QuoteNumber,
                Origin = quote.Origin,
                Destination = quote.Destination,
                Service = serviceName,
                CargoType = quote.CargoType,
                Weight = quote.Weight,
                ContainerSize = quote.ContainerSize,
                Price = quote.Price,
                Currency = quote.Currency,
                EstimatedDays = quote.EstimatedDays,
                Distance = quote.Distance,
                IsBooked = quote.IsBooked,
                CreatedAt = quote.CreatedAt
            };
        }
    }
}
