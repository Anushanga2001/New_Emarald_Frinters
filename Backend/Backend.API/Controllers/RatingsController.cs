using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Backend.API.Hubs;
using Backend.Application.DTOs.Notifications;
using Backend.Application.DTOs.Ratings;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Backend.Infrastructure.Data;

namespace Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public RatingsController(AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<RatingResponseDto>>> GetRatings()
        {
            var ratings = await _context.Ratings
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new RatingResponseDto
                {
                    Id = r.Id,
                    Stars = r.Stars,
                    Comment = r.Comment,
                    CustomerName = r.User == null ? null : (r.User.FirstName + " " + r.User.LastName).Trim(),
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                })
                .ToListAsync();

            return Ok(ratings);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<RatingResponseDto?>> GetMyRating()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var rating = await _context.Ratings
                .Where(r => r.UserId == userId)
                .Select(r => new RatingResponseDto
                {
                    Id = r.Id,
                    Stars = r.Stars,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                })
                .FirstOrDefaultAsync();

            return Ok(rating);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<RatingResponseDto>> SubmitRating([FromBody] CreateRatingDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var existing = await _context.Ratings.FirstOrDefaultAsync(r => r.UserId == userId);
            bool isUpdate;

            if (existing == null)
            {
                existing = new Rating
                {
                    UserId = userId.Value,
                    Stars = dto.Stars,
                    Comment = dto.Comment,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Ratings.Add(existing);
                isUpdate = false;
            }
            else
            {
                existing.Stars = dto.Stars;
                existing.Comment = dto.Comment;
                existing.UpdatedAt = DateTime.UtcNow;
                isUpdate = true;
            }

            await _context.SaveChangesAsync();

            await NotifyAdminsOfRatingAsync(existing, isUpdate);

            return Ok(new RatingResponseDto
            {
                Id = existing.Id,
                Stars = existing.Stars,
                Comment = existing.Comment,
                CreatedAt = existing.CreatedAt,
                UpdatedAt = existing.UpdatedAt
            });
        }

        private int? GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        private async Task NotifyAdminsOfRatingAsync(Rating rating, bool isUpdate)
        {
            var adminIds = await _context.Users
                .Where(u => u.Role == UserRole.Admin && u.IsActive)
                .Select(u => u.Id)
                .ToListAsync();

            if (adminIds.Count == 0) return;

            var customerName = await _context.Users
                .Where(u => u.Id == rating.UserId)
                .Select(u => (u.FirstName + " " + u.LastName).Trim())
                .FirstOrDefaultAsync();

            var who = string.IsNullOrWhiteSpace(customerName) ? "A customer" : customerName;
            var verb = isUpdate ? "updated their rating" : "left a rating";
            var title = $"{who} {verb}";
            var message = $"{rating.Stars}★" +
                          (string.IsNullOrWhiteSpace(rating.Comment) ? "" : $" — {rating.Comment}");
            var createdAt = DateTime.UtcNow;

            var notifications = adminIds.Select(adminId => new Notification
            {
                UserId = adminId,
                Title = title,
                Message = message,
                Type = NotificationType.RatingSubmitted,
                ReferenceId = rating.Id.ToString(),
                CreatedAt = createdAt
            }).ToList();

            _context.Notifications.AddRange(notifications);
            await _context.SaveChangesAsync();

            var first = notifications[0];
            var dto = new NotificationResponseDto
            {
                Id = first.Id,
                Title = first.Title,
                Message = first.Message,
                Type = first.Type,
                IsRead = false,
                ReferenceId = first.ReferenceId,
                CreatedAt = first.CreatedAt
            };

            await _hubContext.Clients.Group("admins").SendAsync("ReceiveNotification", dto);
        }
    }
}
