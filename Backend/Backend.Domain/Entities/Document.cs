using Backend.Domain.Enums;

namespace Backend.Domain.Entities
{
    public class Document
    {
        public int Id { get; set; }
        public int ShipmentId { get; set; }
        public DocumentType DocumentType { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long? FileSize { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public int? UploadedBy { get; set; }

        // Navigation properties
        public Shipment Shipment { get; set; } = null!;
        public User? UploadedByUser { get; set; }
    }
}

