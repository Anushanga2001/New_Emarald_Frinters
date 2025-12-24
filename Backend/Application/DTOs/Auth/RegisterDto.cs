namespace Shipping_Line_Backend.Application.DTOs.Auth
{
    public class RegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? CompanyName { get; set; }
        public string? TaxId { get; set; }
        public string? BillingAddress { get; set; }
        public string? ShippingAddress { get; set; }
    }
}
