using Shipping_Line_Backend.Domain.Enums;

namespace Shipping_Line_Backend.Application.DTOs.Shipments
{
    public class UpdateStatusDto
    {
        public ShipmentStatus Status { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
    }
}
