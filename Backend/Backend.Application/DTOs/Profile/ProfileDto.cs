namespace Backend.Application.DTOs.Profile
{
    public class ProfileDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? CompanyName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
