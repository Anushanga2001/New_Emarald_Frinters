using Backend.Application.DTOs.Auth;
using Backend.Domain.Entities;

namespace Backend.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterCustomerAsync(RegisterDto registerDto);
        string GenerateJwtToken(User user);
    }
}

