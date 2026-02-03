namespace Backend.Application.DTOs.Profile
{
    public class ProfileResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public ProfileDto? Profile { get; set; }
    }
}
