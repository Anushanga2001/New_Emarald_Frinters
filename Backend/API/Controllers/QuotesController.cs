using Microsoft.AspNetCore.Mvc;
using Shipping_Line_Backend.Application.DTOs.Quotes;
using Shipping_Line_Backend.Application.Interfaces;

namespace Shipping_Line_Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotesController : ControllerBase
    {
        private readonly IPricingService _pricingService;

        public QuotesController(IPricingService pricingService)
        {
            _pricingService = pricingService;
        }

        [HttpPost("calculate")]
        public async Task<IActionResult> CalculateQuote([FromBody] CalculateQuoteDto dto)
        {
            try
            {
                // Mock distance calculation - replace with Google Distance Matrix API
                var distance = CalculateDistance(dto.OriginCity, dto.DestinationCity);

                var price = await _pricingService.CalculateShippingCostAsync(
                    dto.Weight,
                    distance,
                    dto.ServiceType);

                var estimatedDays = dto.ServiceType switch
                {
                    Domain.Enums.ServiceType.Standard => 5,
                    Domain.Enums.ServiceType.Express => 2,
                    Domain.Enums.ServiceType.Overnight => 1,
                    _ => 5
                };

                var result = new QuoteResponseDto
                {
                    Price = price,
                    ServiceType = dto.ServiceType,
                    Weight = dto.Weight,
                    Distance = distance,
                    EstimatedDays = estimatedDays,
                    Currency = "USD"
                };

                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private decimal CalculateDistance(string originCity, string destinationCity)
        {
            // Mock distance calculation - replace with Google Distance Matrix API
            // For now, return a random distance between 50-500 km
            return new Random().Next(50, 500);
        }
    }
}
