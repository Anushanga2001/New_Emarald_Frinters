using Backend.Domain.Enums;

namespace Backend.Application.DTOs.Shipments
{
    public class UpdateStatusDto
    {
        public ShipmentStatus Status { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
    }
}

