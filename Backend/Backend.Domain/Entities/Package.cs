namespace Backend.Domain.Entities
{
    public class Package
    {
        public int Id { get; set; }
        public int ShipmentId { get; set; }
        public decimal Weight { get; set; } // in kg
        public decimal Length { get; set; } // in cm
        public decimal Width { get; set; } // in cm
        public decimal Height { get; set; } // in cm
        public string? Description { get; set; }

        // Navigation properties
        public Shipment Shipment { get; set; } = null!;
    }
}

