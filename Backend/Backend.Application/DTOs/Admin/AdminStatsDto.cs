namespace Backend.Application.DTOs.Admin
{
    public class AdminStatsDto
    {
        public int TotalUsers { get; set; }
        public int PendingQuotes { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}
