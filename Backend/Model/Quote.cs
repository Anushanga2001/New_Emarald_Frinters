namespace Shipping_Line_Backend.Model
{
    public class Quote
    {
        public string QuoteId { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public int ServiceId { get; set; }
        public int CargoTypeId { get; set; }
        public double Weight { get; set; }

        public double? Length { get; set; }
        public double? Width { get; set; }
        public double? Height { get; set; }

        public string ContainerSize { get; set; }
        public double Price { get; set; }
        public string CurrencyCode { get; set; }
        public int EstimatedDays { get; set; }
        public string CreatedAt { get; set; }

        public Service Service { get; set; }
        public CargoType CargoType { get; set; }
        public Currency Currency { get; set; }
    }

}
