using Backend.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VesselsController : ControllerBase
    {
        private readonly VesselCache _cache;
        private readonly TrackedMmsiStore _tracked;

        public VesselsController(VesselCache cache, TrackedMmsiStore tracked)
        {
            _cache = cache;
            _tracked = tracked;
        }

        [HttpGet]
        public IActionResult GetSnapshot()
        {
            return Ok(_cache.Snapshot());
        }

        [HttpGet("track")]
        public IActionResult GetTracked()
        {
            return Ok(_tracked.All().OrderBy(m => m).ToArray());
        }

        public record TrackRequest(long Mmsi);

        [HttpPost("track")]
        public IActionResult AddTracked([FromBody] TrackRequest request)
        {
            if (!IsValidMmsi(request.Mmsi))
            {
                return BadRequest(new { error = "MMSI must be a 7–9 digit number." });
            }
            _tracked.Add(request.Mmsi);
            return Ok(new { mmsi = request.Mmsi });
        }

        [HttpDelete("track/{mmsi:long}")]
        public IActionResult RemoveTracked(long mmsi)
        {
            var removed = _tracked.Remove(mmsi);
            if (!removed) return NotFound();
            return NoContent();
        }

        private static bool IsValidMmsi(long mmsi) => mmsi >= 1_000_000 && mmsi <= 999_999_999;
    }
}
