using Backend.Application.DTOs.Auth;
using Backend.Domain.Entities;

namespace Backend.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<RegistrationSuccessDto> RegisterCustomerAsync(RegisterDto registerDto);
        string GenerateJwtToken(User user);
        Task<ForgotPasswordResponseDto> ForgotPasswordAsync(ForgotPasswordDto dto);
        Task<ResetPasswordResponseDto> ResetPasswordAsync(ResetPasswordDto dto);
    }
}

