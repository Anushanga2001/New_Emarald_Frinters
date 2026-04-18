using Backend.Domain.Enums;

namespace Backend.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public UserRole Role { get; set; }
        public bool IsActive { get; set; } = true;

        // Authentication & Security fields (Story 1.1)
        public int FailedLoginAttempts { get; set; } = 0;
        public DateTime? LockoutUntil { get; set; }
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpiry { get; set; }

        // Business fields (consolidated from Customer)
        public string? CompanyName { get; set; }
        public string? TaxId { get; set; }
        public string? BillingAddress { get; set; }
        public string? ShippingAddress { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
    }
}

