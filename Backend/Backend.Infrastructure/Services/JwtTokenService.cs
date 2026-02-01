using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Backend.Application.DTOs.Auth;
using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Backend.Infrastructure.Data;

namespace Backend.Infrastructure.Services
{
    public class JwtTokenService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;
        private readonly ILogger<JwtTokenService> _logger;

        public JwtTokenService(
            IConfiguration configuration,
            AppDbContext context,
            ILogger<JwtTokenService> logger)
        {
            _configuration = configuration;
            _context = context;
            _logger = logger;
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

            // Configurable token expiration (Story 1.3 - AC1)
            var expirationHours = _configuration.GetValue<int>("Jwt:ExpirationHours", 24);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expirationHours),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            // Security configuration
            var maxFailedAttempts = _configuration.GetValue<int>("Security:MaxFailedLoginAttempts", 5);
            var lockoutMinutes = _configuration.GetValue<int>("Security:LockoutDurationMinutes", 15);

            // Case-insensitive email comparison for login (matches registration behavior)
            var normalizedEmail = loginDto.Email.ToLowerInvariant();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

            // AC3: Same error for non-existent email (no information leak)
            if (user == null)
            {
                _logger.LogWarning("Login attempt for non-existent email: {Email}", loginDto.Email);
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            // AC4: Check account lockout BEFORE password verification
            if (user.LockoutUntil.HasValue && user.LockoutUntil > DateTime.UtcNow)
            {
                var remainingMinutes = (int)Math.Ceiling((user.LockoutUntil.Value - DateTime.UtcNow).TotalMinutes);
                _logger.LogWarning("Login attempt for locked account: {Email}. Locked until {LockoutUntil}",
                    user.Email, user.LockoutUntil);
                throw new UnauthorizedAccessException($"Account temporarily locked due to multiple failed attempts. Please try again in {remainingMinutes} minute(s).");
            }

            // Security: Check if account is active BEFORE password verification
            // This prevents timing attacks that could reveal account status
            if (!user.IsActive)
            {
                _logger.LogWarning("Login attempt for inactive account: {Email}", user.Email);
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                // AC2: Track failed login attempts
                user.FailedLoginAttempts++;

                _logger.LogWarning("Failed login attempt for {Email}. Attempt count: {Count}",
                    user.Email, user.FailedLoginAttempts);

                // AC4: Lock account after max failed attempts
                if (user.FailedLoginAttempts >= maxFailedAttempts)
                {
                    user.LockoutUntil = DateTime.UtcNow.AddMinutes(lockoutMinutes);
                    _logger.LogWarning("Account locked for {Email} due to {Count} failed attempts. Locked until {LockoutUntil}",
                        user.Email, user.FailedLoginAttempts, user.LockoutUntil);
                }

                await _context.SaveChangesAsync();
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            // AC5: Reset failed attempts on successful login
            if (user.FailedLoginAttempts > 0 || user.LockoutUntil.HasValue)
            {
                user.FailedLoginAttempts = 0;
                user.LockoutUntil = null;
                await _context.SaveChangesAsync();
            }

            _logger.LogInformation("User {Email} logged in successfully", user.Email);

            var token = GenerateJwtToken(user);
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserId == user.Id);

            return new AuthResponseDto
            {
                Token = token,
                User = new UserDto
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

        public async Task<RegistrationSuccessDto> RegisterCustomerAsync(RegisterDto registerDto)
        {
            // Case-insensitive email comparison for duplicate check (using async)
            var normalizedEmail = registerDto.Email.ToLowerInvariant();
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail))
            {
                throw new InvalidOperationException("Email already exists");
            }

            // Use transaction to ensure User and Customer are created atomically
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var user = new User
                {
                    Email = registerDto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    PhoneNumber = registerDto.PhoneNumber,
                    Role = UserRole.Customer,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var customer = new Customer
                {
                    UserId = user.Id,
                    Name = $"{registerDto.FirstName} {registerDto.LastName}".Trim(),
                    Email = registerDto.Email,
                    Phone = registerDto.PhoneNumber ?? string.Empty,
                    CompanyName = registerDto.CompanyName,
                    TaxId = registerDto.TaxId,
                    BillingAddress = registerDto.BillingAddress,
                    ShippingAddress = registerDto.ShippingAddress
                };

                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                // Return success message - user must log in separately
                return new RegistrationSuccessDto
                {
                    Success = true,
                    Message = "Registration successful. Please log in with your credentials.",
                    Email = user.Email
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}

