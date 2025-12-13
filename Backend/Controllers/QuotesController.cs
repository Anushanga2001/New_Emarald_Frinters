using Microsoft.AspNetCore.Mvc;
using Shipping_Line_Backend.Data;
using Shipping_Line_Backend.Model;
using Microsoft.EntityFrameworkCore;

namespace Shipping_Line_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuotesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetQuotes()
        {
            var quotes = await _context.Quotes
                .Include(q => q.Service)
                .Include(q => q.CargoType)
                .Include(q => q.Currency)
                .ToListAsync();

            return Ok(quotes);
        }

        [HttpPost]
        public async Task<IActionResult> CreateQuote([FromBody] Shipping_Line_Backend.Model.Quote quote)
        {
            quote.QuoteId = Guid.NewGuid().ToString();
            quote.CreatedAt = DateTime.UtcNow.ToString("o");

            _context.Quotes.Add(quote);
            await _context.SaveChangesAsync();

            return Ok(quote);
        }
    }
}