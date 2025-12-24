using Shipping_Line_Backend.Application.DTOs.Auth;

namespace Shipping_Line_Backend.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterCustomerAsync(RegisterDto registerDto);
        string GenerateJwtToken(Domain.Entities.User user);
    }
}
