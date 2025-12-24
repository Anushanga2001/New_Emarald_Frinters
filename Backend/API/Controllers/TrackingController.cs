using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shipping_Line_Backend.Application.DTOs.Shipments;
using Shipping_Line_Backend.Infrastructure.Data;

namespace Shipping_Line_Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrackingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrackingController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{trackingNumber}")]
        public async Task<IActionResult> TrackShipment(string trackingNumber)
        {
            var shipment = await _context.Shipments
                .Include(s => s.Packages)
                .Include(s => s.TrackingEvents.OrderByDescending(t => t.EventDate))
                .Include(s => s.Customer)
                .FirstOrDefaultAsync(s => s.TrackingNumber == trackingNumber);

            if (shipment == null)
            {
                return NotFound(new { message = "Shipment not found" });
            }

            var result = new ShipmentResponseDto
            {
                Id = shipment.Id,
                TrackingNumber = shipment.TrackingNumber,
                CustomerId = shipment.CustomerId,
                OriginAddress = shipment.OriginAddress,
                OriginCity = shipment.OriginCity,
                OriginState = shipment.OriginState,
                OriginZipCode = shipment.OriginZipCode,
                DestinationAddress = shipment.DestinationAddress,
                DestinationCity = shipment.DestinationCity,
                DestinationState = shipment.DestinationState,
                DestinationZipCode = shipment.DestinationZipCode,
                Status = shipment.Status,
                Weight = shipment.Weight,
                Distance = shipment.Distance,
                ServiceType = shipment.ServiceType,
                EstimatedDeliveryDate = shipment.EstimatedDeliveryDate,
                ActualDeliveryDate = shipment.ActualDeliveryDate,
                SpecialInstructions = shipment.SpecialInstructions,
                CreatedAt = shipment.CreatedAt,
                TrackingEvents = shipment.TrackingEvents.Select(t => new TrackingEventDto
                {
                    Id = t.Id,
                    Status = t.Status,
                    Location = t.Location,
                    Description = t.Description,
                    EventDate = t.EventDate
                }).ToList(),
                Packages = shipment.Packages.Select(p => new PackageDto
                {
                    Weight = p.Weight,
                    Length = p.Length,
                    Width = p.Width,
                    Height = p.Height,
                    Description = p.Description
                }).ToList()
            };

            return Ok(result);
        }
    }
}
