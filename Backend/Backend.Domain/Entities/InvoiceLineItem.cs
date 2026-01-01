namespace Backend.Domain.Entities
{
    public class InvoiceLineItem
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public int ShipmentId { get; set; }
        public string Description { get; set; } = string.Empty;
        public int Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; }
        public decimal Amount { get; set; }

        // Navigation properties
        public Invoice Invoice { get; set; } = null!;
        public Shipment Shipment { get; set; } = null!;
    }
}

