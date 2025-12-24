using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Shipping_Line_Backend.Application.Interfaces;
using Shipping_Line_Backend.Domain.Entities;

namespace Shipping_Line_Backend.Infrastructure.Services
{
    public class JwtTokenService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly Infrastructure.Data.AppDbContext _context;

        public JwtTokenService(IConfiguration configuration, Infrastructure.Data.AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<Application.DTOs.Auth.AuthResponseDto> LoginAsync(Application.DTOs.Auth.LoginDto loginDto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == loginDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("User account is inactive");
            }

            var token = GenerateJwtToken(user);
            var customer = _context.Customers.FirstOrDefault(c => c.UserId == user.Id);

            return new Application.DTOs.Auth.AuthResponseDto
            {
                Token = token,
                User = new Application.DTOs.Auth.UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role.ToString(),
                    CustomerId = customer?.Id
                }
            };
        }

        public async Task<Application.DTOs.Auth.AuthResponseDto> RegisterCustomerAsync(Application.DTOs.Auth.RegisterDto registerDto)
        {
            if (_context.Users.Any(u => u.Email == registerDto.Email))
            {
                throw new InvalidOperationException("Email already registered");
            }

            var user = new Domain.Entities.User
            {
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                PhoneNumber = registerDto.PhoneNumber,
                Role = Domain.Enums.UserRole.Customer,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var customer = new Domain.Entities.Customer
            {
                UserId = user.Id,
                CompanyName = registerDto.CompanyName,
                TaxId = registerDto.TaxId,
                BillingAddress = registerDto.BillingAddress,
                ShippingAddress = registerDto.ShippingAddress
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return new Application.DTOs.Auth.AuthResponseDto
            {
                Token = token,
                User = new Application.DTOs.Auth.UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role.ToString(),
                    CustomerId = customer.Id
                }
            };
        }
    }
}
