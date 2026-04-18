using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Application.DTOs.Admin;
using Backend.Domain.Enums;
using Backend.Infrastructure.Data;

namespace Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = nameof(UserRole.Admin))]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<AdminStatsDto>> GetStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var pendingQuotes = await _context.Quotes.CountAsync(q => !q.IsBooked);
            var totalRevenue = await _context.Quotes
                .Where(q => q.IsBooked)
                .SumAsync(q => q.Currency == "LKR" ? q.Price / 320m : q.Price);

            return Ok(new AdminStatsDto
            {
                TotalUsers = totalUsers,
                PendingQuotes = pendingQuotes,
                TotalRevenue = Math.Round(totalRevenue, 2)
            });
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<AdminUserResponseDto>>> GetUsers()
        {
            var users = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new AdminUserResponseDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Role = u.Role.ToString(),
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    CompanyName = u.CompanyName
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPatch("users/{userId}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            user.IsActive = !user.IsActive;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
