using Backend.Domain.Enums;

namespace Backend.Domain.Entities
{
    public class Quote
    {
        public int Id { get; set; }
        public string QuoteNumber { get; set; } = string.Empty;
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public ServiceType ServiceType { get; set; }
        public string CargoType { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public string? ContainerSize { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; } = "USD";
        public int EstimatedDays { get; set; }
        public decimal Distance { get; set; }
        public bool IsBooked { get; set; } = false;
        public int? CustomerId { get; set; }
        public Customer? Customer { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? BookedAt { get; set; }
    }
}
