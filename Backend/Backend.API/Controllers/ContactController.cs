using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Domain.Entities;
using Backend.Infrastructure.Data;

namespace Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactController(AppDbContext context)
        {
            _context = context;
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

