namespace Backend.Domain.Entities
{
    public class Customer
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        // Profile fields (Story 1.1)
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? City { get; set; }

        // Business fields
        public string? CompanyName { get; set; }
        public string? TaxId { get; set; }
        public string? BillingAddress { get; set; }
        public string? ShippingAddress { get; set; }
        public decimal CreditLimit { get; set; } = 0;
        public decimal CurrentBalance { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public User User { get; set; } = null!;
        public ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();
        public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }
}

