namespace Shipping_Line_Backend.Domain.Entities
{
    public class Invoice
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public DateTime IssueDate { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; } = 0;
        public decimal TotalAmount { get; set; }
        public Enums.InvoiceStatus Status { get; set; }
        public DateTime? PaidDate { get; set; }
        public string? PaymentMethod { get; set; }
        public string? Notes { get; set; }

        // Navigation properties
        public Customer Customer { get; set; } = null!;
        public ICollection<InvoiceLineItem> LineItems { get; set; } = new List<InvoiceLineItem>();
    }
}
