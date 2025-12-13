namespace Shipping_Line_Backend.Model
{
    public class Shipment
    {
        public string ShipmentId { get; set; }
        public string TrackingNumber { get; set; }
        public int StatusId { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string CurrentLocation { get; set; }
        public string EstimatedDelivery { get; set; }
        public int ServiceId { get; set; }
        public double Weight { get; set; }

        public ShipmentStatus Status { get; set; }
        public Service Service { get; set; }
    }

}
