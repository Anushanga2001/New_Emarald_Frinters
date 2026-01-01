using Backend.Domain.Enums;

namespace Backend.Domain.Entities
{
    public class Shipment
    {
        public int Id { get; set; }
        public string TrackingNumber { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public string OriginAddress { get; set; } = string.Empty;
        public string OriginCity { get; set; } = string.Empty;
        public string OriginState { get; set; } = string.Empty;
        public string OriginZipCode { get; set; } = string.Empty;
        public string DestinationAddress { get; set; } = string.Empty;
        public string DestinationCity { get; set; } = string.Empty;
        public string DestinationState { get; set; } = string.Empty;
        public string DestinationZipCode { get; set; } = string.Empty;
        public ShipmentStatus Status { get; set; }
        public decimal Weight { get; set; } // in kg
        public decimal? Distance { get; set; } // in km
        public ServiceType ServiceType { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }
        public string? SpecialInstructions { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public Customer Customer { get; set; } = null!;
        public ICollection<Package> Packages { get; set; } = new List<Package>();
        public ICollection<TrackingEvent> TrackingEvents { get; set; } = new List<TrackingEvent>();
        public ICollection<Document> Documents { get; set; } = new List<Document>();
        public ICollection<InvoiceLineItem> InvoiceLineItems { get; set; } = new List<InvoiceLineItem>();
    }
}

