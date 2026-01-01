namespace Backend.Infrastructure.Services
{
    public static class TrackingNumberGenerator
    {
        public static string Generate()
        {
            // Format: SL + YYMMDD + 6 random alphanumeric
            var date = DateTime.UtcNow;
            var datePart = date.ToString("yyMMdd");
            var randomPart = GenerateRandomString(6);
            return $"SL{datePart}{randomPart}";
        }

        private static string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}

