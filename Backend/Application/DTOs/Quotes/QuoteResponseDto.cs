using Shipping_Line_Backend.Domain.Enums;

namespace Shipping_Line_Backend.Application.DTOs.Quotes
{
    public class QuoteResponseDto
    {
        public decimal Price { get; set; }
        public ServiceType ServiceType { get; set; }
        public decimal Weight { get; set; }
        public decimal Distance { get; set; }
        public int EstimatedDays { get; set; }
        public string Currency { get; set; } = "USD";
    }
}
