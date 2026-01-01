using Backend.Domain.Enums;

namespace Backend.Application.DTOs.Shipments
{
    public class CreateShipmentDto
    {
        public int? CustomerId { get; set; } // Optional for admin creating on behalf of customer
        public string OriginAddress { get; set; } = string.Empty;
        public string OriginCity { get; set; } = string.Empty;
        public string OriginState { get; set; } = string.Empty;
        public string OriginZipCode { get; set; } = string.Empty;
        public string DestinationAddress { get; set; } = string.Empty;
        public string DestinationCity { get; set; } = string.Empty;
        public string DestinationState { get; set; } = string.Empty;
        public string DestinationZipCode { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public ServiceType ServiceType { get; set; }
        public string? SpecialInstructions { get; set; }
        public List<PackageDto> Packages { get; set; } = new();
    }

    public class PackageDto
    {
        public decimal Weight { get; set; }
        public decimal Length { get; set; }
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public string? Description { get; set; }
    }
}

