namespace Backend.Application.DTOs.Vessels
{
    public class VesselPositionDto
    {
        public long Mmsi { get; set; }
        public string? Name { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public double Cog { get; set; }
        public double Sog { get; set; }
        public int? ShipType { get; set; }
        public long Timestamp { get; set; }
    }
}
