namespace Shipping_Line_Backend.Domain.Entities
{
    public class PricingRule
    {
        public int Id { get; set; }
        public Enums.ServiceType ServiceType { get; set; }
        public decimal BaseRate { get; set; }
        public decimal WeightRatePerKg { get; set; }
        public decimal DistanceRatePerKm { get; set; }
        public decimal MinimumCharge { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime EffectiveFrom { get; set; } = DateTime.UtcNow;
        public DateTime? EffectiveTo { get; set; }
    }
}
