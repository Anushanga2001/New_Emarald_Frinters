using Shipping_Line_Backend.Domain.Enums;

namespace Shipping_Line_Backend.Application.DTOs.Quotes
{
    public class CalculateQuoteDto
    {
        public string OriginCity { get; set; } = string.Empty;
        public string DestinationCity { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public ServiceType ServiceType { get; set; }
    }
}
