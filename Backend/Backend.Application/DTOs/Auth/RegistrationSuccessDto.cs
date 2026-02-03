namespace Backend.Application.DTOs.Auth
{
    public class RegistrationSuccessDto
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = "Registration successful. Please log in with your credentials.";
        public string Email { get; set; } = string.Empty;
    }
}
