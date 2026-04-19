using System.ComponentModel.DataAnnotations;

namespace Backend.Application.DTOs.Ratings
{
    public class CreateRatingDto
    {
        [Range(1, 5)]
        public int Stars { get; set; }

        [MaxLength(500)]
        public string? Comment { get; set; }
    }
}
