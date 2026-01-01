namespace Backend.Domain.Entities
{
    public class Customer
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? CompanyName { get; set; }
        public string? TaxId { get; set; }
        public string? BillingAddress { get; set; }
        public string? ShippingAddress { get; set; }
        public decimal CreditLimit { get; set; } = 0;
        public decimal CurrentBalance { get; set; } = 0;

        // Navigation properties
        public User User { get; set; } = null!;
        public ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();
        public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }
}

