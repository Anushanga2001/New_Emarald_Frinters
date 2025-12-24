using Shipping_Line_Backend.Domain.Enums;

namespace Shipping_Line_Backend.Application.DTOs.Shipments
{
    public class ShipmentResponseDto
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
        public decimal Weight { get; set; }
        public decimal? Distance { get; set; }
        public ServiceType ServiceType { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }
        public string? SpecialInstructions { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TrackingEventDto> TrackingEvents { get; set; } = new();
        public List<PackageDto> Packages { get; set; } = new();
    }

    public class TrackingEventDto
    {
        public int Id { get; set; }
        public ShipmentStatus Status { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public DateTime EventDate { get; set; }
    }
}
