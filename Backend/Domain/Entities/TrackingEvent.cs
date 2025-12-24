namespace Shipping_Line_Backend.Domain.Entities
{
    public class TrackingEvent
    {
        public int Id { get; set; }
        public int ShipmentId { get; set; }
        public Enums.ShipmentStatus Status { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public DateTime EventDate { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }

        // Navigation properties
        public Shipment Shipment { get; set; } = null!;
        public User? CreatedByUser { get; set; }
    }
}
