namespace Backend.Application.DTOs.Quotes
{
    public class CalculateQuoteDto
    {
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public string Service { get; set; } = string.Empty;
        public string CargoType { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public string? ContainerSize { get; set; }
        public string Currency { get; set; } = "USD";
    }
}

