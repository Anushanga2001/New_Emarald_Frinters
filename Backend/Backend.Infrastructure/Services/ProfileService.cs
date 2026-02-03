using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Backend.Application.DTOs.Profile;
using Backend.Application.Exceptions;
using Backend.Application.Interfaces;
using Backend.Infrastructure.Data;

namespace Backend.Infrastructure.Services
{
    public class ProfileService : IProfileService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProfileService> _logger;

        public ProfileService(AppDbContext context, ILogger<ProfileService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ProfileDto> GetProfileAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Customer)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                _logger.LogWarning("Profile requested for non-existent user ID: {UserId}", userId);
                throw new NotFoundException("User not found");
            }

            // Map user and customer data to ProfileDto
            // Note: Admin/Staff users may not have a Customer record - fallback to User fields
            return new ProfileDto
            {
                Id = user.Id,
                Name = user.Customer?.Name ?? $"{user.FirstName} {user.LastName}".Trim(),
                Email = user.Email,
                Phone = user.Customer?.Phone ?? user.PhoneNumber,
                CompanyName = user.Customer?.CompanyName,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<ProfileResponseDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)
        {
            // Use transaction to ensure both User and Customer are updated atomically
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var user = await _context.Users
                    .Include(u => u.Customer)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    _logger.LogWarning("Profile update attempted for non-existent user ID: {UserId}", userId);
                    return new ProfileResponseDto
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                // Check email uniqueness if email is being changed (case-insensitive)
                if (dto.Email.ToLowerInvariant() != user.Email.ToLowerInvariant())
                {
                    var existingUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower() && u.Id != userId);

                    if (existingUser != null)
                    {
                        _logger.LogWarning("Profile update failed - email already exists: {Email}", dto.Email);
                        return new ProfileResponseDto
                        {
                            Success = false,
                            Message = "Email already exists"
                        };
                    }
                }

                // Parse name into first and last name for User entity
                // Handle edge cases: trim, multiple spaces, single name
                var trimmedName = dto.Name.Trim();
                var nameParts = trimmedName.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
                var firstName = nameParts.Length > 0 ? nameParts[0] : trimmedName;
                var lastName = nameParts.Length > 1 ? nameParts[1] : string.Empty;

                // Update User fields
                user.Email = dto.Email;
                user.FirstName = firstName;
                user.LastName = lastName;
                user.PhoneNumber = dto.Phone;
                user.UpdatedAt = DateTime.UtcNow;

                // Update Customer fields if customer record exists
                // Note: Admin/Staff users may not have a Customer record
                if (user.Customer != null)
                {
                    user.Customer.Name = dto.Name;
                    user.Customer.Email = dto.Email;
                    user.Customer.Phone = dto.Phone; // Keep consistent with User.PhoneNumber (nullable)
                    user.Customer.CompanyName = dto.CompanyName;
                    user.Customer.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    _logger.LogInformation("User {UserId} has no Customer record (Admin/Staff) - only User entity updated", userId);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Profile updated successfully for user {UserId} ({Email})", userId, dto.Email);

                return new ProfileResponseDto
                {
                    Success = true,
                    Message = "Profile updated successfully",
                    Profile = new ProfileDto
                    {
                        Id = user.Id,
                        Name = dto.Name,
                        Email = dto.Email,
                        Phone = dto.Phone,
                        CompanyName = dto.CompanyName,
                        CreatedAt = user.CreatedAt
                    }
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Failed to update profile for user {UserId}", userId);
                throw;
            }
        }
    }
}
