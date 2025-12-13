namespace Shipping_Line_Backend.Model
{
    public class ContactForm
    {
        public int ContactFormId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string CreatedAt { get; set; }
    }

}
