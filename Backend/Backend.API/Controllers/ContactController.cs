using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Backend.Infrastructure.Data;
using Backend.API.Hubs;
using Backend.Application.DTOs.Notifications;

namespace Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public ContactController(AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitContactForm([FromBody] ContactForm contactForm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(contactForm.Name) ||
                    string.IsNullOrWhiteSpace(contactForm.Email) ||
                    string.IsNullOrWhiteSpace(contactForm.Subject) ||
                    string.IsNullOrWhiteSpace(contactForm.Message))
                {
                    return BadRequest(new { message = "Name, Email, Subject, and Message are required fields." });
                }

                // Set the creation timestamp
                contactForm.CreatedAt = DateTime.UtcNow;

                // Add to database
                _context.ContactForms.Add(contactForm);
                await _context.SaveChangesAsync();

                // Create notifications for all admin users
                var adminUsers = await _context.Users
                    .Where(u => u.Role == UserRole.Admin && u.IsActive)
                    .Select(u => u.Id)
                    .ToListAsync();

                var notifications = adminUsers.Select(adminId => new Notification
                {
                    UserId = adminId,
                    Title = $"New Contact Message from {contactForm.Name}",
                    Message = $"Subject: {contactForm.Subject} - {contactForm.Message}",
                    Type = NotificationType.ContactMessage,
                    ReferenceId = contactForm.ContactFormId.ToString(),
                    CreatedAt = DateTime.UtcNow
                }).ToList();

                _context.Notifications.AddRange(notifications);
                await _context.SaveChangesAsync();

                // Push real-time notification to all connected admin users via SignalR
                foreach (var notification in notifications)
                {
                    var dto = new NotificationResponseDto
                    {
                        Id = notification.Id,
                        Title = notification.Title,
                        Message = notification.Message,
                        Type = notification.Type,
                        IsRead = false,
                        ReferenceId = notification.ReferenceId,
                        CreatedAt = notification.CreatedAt
                    };

                    await _hubContext.Clients.Group("admins")
                        .SendAsync("ReceiveNotification", dto);
                }

                return Ok(new {
                    message = "Thank you for contacting us! We'll get back to you soon.",
                    contactFormId = contactForm.ContactFormId
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred while submitting your message. Please try again later." });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetContactForms()
        {
            try
            {
                var contactForms = await _context.ContactForms
                    .OrderByDescending(cf => cf.CreatedAt)
                    .ToListAsync();

                return Ok(contactForms);
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving contact forms." });
            }
        }
    }
}
