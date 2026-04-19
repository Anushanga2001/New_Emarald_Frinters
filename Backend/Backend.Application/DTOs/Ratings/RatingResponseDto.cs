namespace Backend.Application.DTOs.Ratings
{
    public class RatingResponseDto
    {
        public int Id { get; set; }
        public int Stars { get; set; }
        public string? Comment { get; set; }
        public string? CustomerName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
