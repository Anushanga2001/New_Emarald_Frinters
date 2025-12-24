using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Shipping_Line_Backend.Application.DTOs.Shipments;
using Shipping_Line_Backend.Application.Interfaces;
using Shipping_Line_Backend.Domain.Entities;
using Shipping_Line_Backend.Domain.Enums;
using Shipping_Line_Backend.Infrastructure.Data;
using Shipping_Line_Backend.Infrastructure.Services;

namespace Shipping_Line_Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ShipmentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPricingService _pricingService;

        public ShipmentsController(AppDbContext context, IPricingService pricingService)
        {
            _context = context;
            _pricingService = pricingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetShipments()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null) return Unauthorized();

            IQueryable<Shipment> query = _context.Shipments
                .Include(s => s.Packages)
                .Include(s => s.TrackingEvents.OrderByDescending(t => t.EventDate))
                .Include(s => s.Customer);

            // Customers can only see their own shipments
            if (user.Role == Domain.Enums.UserRole.Customer)
            {
                var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
                if (customer == null) return Forbid();
                query = query.Where(s => s.CustomerId == customer.Id);
            }

            var shipments = await query
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

            var result = shipments.Select(s => new ShipmentResponseDto
            {
                Id = s.Id,
                TrackingNumber = s.TrackingNumber,
                CustomerId = s.CustomerId,
                OriginAddress = s.OriginAddress,
                OriginCity = s.OriginCity,
                OriginState = s.OriginState,
                OriginZipCode = s.OriginZipCode,
                DestinationAddress = s.DestinationAddress,
                DestinationCity = s.DestinationCity,
                DestinationState = s.DestinationState,
                DestinationZipCode = s.DestinationZipCode,
                Status = s.Status,
                Weight = s.Weight,
                Distance = s.Distance,
                ServiceType = s.ServiceType,
                EstimatedDeliveryDate = s.EstimatedDeliveryDate,
                ActualDeliveryDate = s.ActualDeliveryDate,
                SpecialInstructions = s.SpecialInstructions,
                CreatedAt = s.CreatedAt,
                TrackingEvents = s.TrackingEvents.Select(t => new TrackingEventDto
                {
                    Id = t.Id,
                    Status = t.Status,
                    Location = t.Location,
                    Description = t.Description,
                    EventDate = t.EventDate
                }).ToList(),
                Packages = s.Packages.Select(p => new PackageDto
                {
                    Weight = p.Weight,
                    Length = p.Length,
                    Width = p.Width,
                    Height = p.Height,
                    Description = p.Description
                }).ToList()
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetShipment(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null) return Unauthorized();

            var shipment = await _context.Shipments
                .Include(s => s.Packages)
                .Include(s => s.TrackingEvents.OrderByDescending(t => t.EventDate))
                .Include(s => s.Customer)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (shipment == null) return NotFound();

            // Customers can only see their own shipments
            if (user.Role == Domain.Enums.UserRole.Customer)
            {
                var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
                if (customer == null || shipment.CustomerId != customer.Id)
                    return Forbid();
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

        [HttpPost]
        public async Task<IActionResult> CreateShipment([FromBody] CreateShipmentDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null) return Unauthorized();

            Customer? customer = null;
            if (user.Role == Domain.Enums.UserRole.Customer)
            {
                customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
                if (customer == null) return Forbid();
            }
            else if (dto.CustomerId > 0)
            {
                customer = await _context.Customers.FindAsync(dto.CustomerId);
                if (customer == null) return BadRequest("Customer not found");
            }
            else
            {
                return BadRequest("Customer ID is required");
            }

            // Calculate distance (mock for now - can integrate Google Distance Matrix API later)
            var distance = CalculateDistance(dto.OriginCity, dto.DestinationCity);

            var shipment = new Shipment
            {
                TrackingNumber = TrackingNumberGenerator.Generate(),
                CustomerId = customer.Id,
                OriginAddress = dto.OriginAddress,
                OriginCity = dto.OriginCity,
                OriginState = dto.OriginState,
                OriginZipCode = dto.OriginZipCode,
                DestinationAddress = dto.DestinationAddress,
                DestinationCity = dto.DestinationCity,
                DestinationState = dto.DestinationState,
                DestinationZipCode = dto.DestinationZipCode,
                Status = ShipmentStatus.Pending,
                Weight = dto.Weight,
                Distance = distance,
                ServiceType = dto.ServiceType,
                EstimatedDeliveryDate = CalculateEstimatedDelivery(dto.ServiceType),
                SpecialInstructions = dto.SpecialInstructions,
                CreatedAt = DateTime.UtcNow
            };

            _context.Shipments.Add(shipment);
            await _context.SaveChangesAsync();

            // Add packages
            foreach (var packageDto in dto.Packages)
            {
                var package = new Package
                {
                    ShipmentId = shipment.Id,
                    Weight = packageDto.Weight,
                    Length = packageDto.Length,
                    Width = packageDto.Width,
                    Height = packageDto.Height,
                    Description = packageDto.Description
                };
                _context.Packages.Add(package);
            }

            // Create initial tracking event
            var trackingEvent = new TrackingEvent
            {
                ShipmentId = shipment.Id,
                Status = ShipmentStatus.Pending,
                Description = "Shipment created",
                EventDate = DateTime.UtcNow,
                CreatedBy = userId
            };
            _context.TrackingEvents.Add(trackingEvent);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetShipment), new { id = shipment.Id }, 
                await GetShipmentResponse(shipment.Id));
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var shipment = await _context.Shipments.FindAsync(id);
            if (shipment == null) return NotFound();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            shipment.Status = dto.Status;
            shipment.UpdatedAt = DateTime.UtcNow;

            if (dto.Status == ShipmentStatus.Delivered)
            {
                shipment.ActualDeliveryDate = DateTime.UtcNow;
            }

            // Create tracking event
            var trackingEvent = new TrackingEvent
            {
                ShipmentId = shipment.Id,
                Status = dto.Status,
                Location = dto.Location,
                Description = dto.Description ?? $"Status updated to {dto.Status}",
                EventDate = DateTime.UtcNow,
                CreatedBy = userId
            };
            _context.TrackingEvents.Add(trackingEvent);

            await _context.SaveChangesAsync();

            return Ok(await GetShipmentResponse(shipment.Id));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelShipment(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null) return Unauthorized();

            var shipment = await _context.Shipments.FindAsync(id);
            if (shipment == null) return NotFound();

            // Customers can only cancel their own shipments if pending
            if (user.Role == Domain.Enums.UserRole.Customer)
            {
                var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
                if (customer == null || shipment.CustomerId != customer.Id)
                    return Forbid();
                
                if (shipment.Status != ShipmentStatus.Pending)
                    return BadRequest("Only pending shipments can be cancelled");
            }

            shipment.Status = ShipmentStatus.Cancelled;
            shipment.UpdatedAt = DateTime.UtcNow;

            var trackingEvent = new TrackingEvent
            {
                ShipmentId = shipment.Id,
                Status = ShipmentStatus.Cancelled,
                Description = "Shipment cancelled",
                EventDate = DateTime.UtcNow,
                CreatedBy = userId
            };
            _context.TrackingEvents.Add(trackingEvent);

            await _context.SaveChangesAsync();

            return Ok(await GetShipmentResponse(shipment.Id));
        }

        [HttpGet("{id}/tracking")]
        public async Task<IActionResult> GetTracking(int id)
        {
            var trackingEvents = await _context.TrackingEvents
                .Where(t => t.ShipmentId == id)
                .OrderByDescending(t => t.EventDate)
                .ToListAsync();

            var result = trackingEvents.Select(t => new TrackingEventDto
            {
                Id = t.Id,
                Status = t.Status,
                Location = t.Location,
                Description = t.Description,
                EventDate = t.EventDate
            });

            return Ok(result);
        }

        private async Task<ShipmentResponseDto> GetShipmentResponse(int shipmentId)
        {
            var shipment = await _context.Shipments
                .Include(s => s.Packages)
                .Include(s => s.TrackingEvents.OrderByDescending(t => t.EventDate))
                .FirstOrDefaultAsync(s => s.Id == shipmentId);

            if (shipment == null) throw new InvalidOperationException("Shipment not found");

            return new ShipmentResponseDto
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
        }

        private decimal CalculateDistance(string originCity, string destinationCity)
        {
            // Mock distance calculation - replace with Google Distance Matrix API
            // For now, return a random distance between 50-500 km
            return new Random().Next(50, 500);
        }

        private DateTime CalculateEstimatedDelivery(ServiceType serviceType)
        {
            var days = serviceType switch
            {
                ServiceType.Standard => 5,
                ServiceType.Express => 2,
                ServiceType.Overnight => 1,
                _ => 5
            };
            return DateTime.UtcNow.AddDays(days);
        }
    }
}
