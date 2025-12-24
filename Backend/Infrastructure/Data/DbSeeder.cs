using Microsoft.EntityFrameworkCore;
using Shipping_Line_Backend.Domain.Entities;
using Shipping_Line_Backend.Domain.Enums;

namespace Shipping_Line_Backend.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Seed Pricing Rules if they don't exist
            if (!await context.PricingRules.AnyAsync())
            {
                var pricingRules = new[]
                {
                    new PricingRule
                    {
                        ServiceType = ServiceType.Standard,
                        BaseRate = 50.00m,
                        WeightRatePerKg = 2.00m,
                        DistanceRatePerKm = 0.50m,
                        MinimumCharge = 100.00m,
                        IsActive = true,
                        EffectiveFrom = DateTime.UtcNow
                    },
                    new PricingRule
                    {
                        ServiceType = ServiceType.Express,
                        BaseRate = 100.00m,
                        WeightRatePerKg = 3.00m,
                        DistanceRatePerKm = 0.75m,
                        MinimumCharge = 200.00m,
                        IsActive = true,
                        EffectiveFrom = DateTime.UtcNow
                    },
                    new PricingRule
                    {
                        ServiceType = ServiceType.Overnight,
                        BaseRate = 200.00m,
                        WeightRatePerKg = 5.00m,
                        DistanceRatePerKm = 1.00m,
                        MinimumCharge = 400.00m,
                        IsActive = true,
                        EffectiveFrom = DateTime.UtcNow
                    }
                };

                context.PricingRules.AddRange(pricingRules);
                await context.SaveChangesAsync();
            }

            // Create default admin user if it doesn't exist
            if (!await context.Users.AnyAsync(u => u.Email == "admin@shipping.com"))
            {
                var adminUser = new User
                {
                    Email = "admin@shipping.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    FirstName = "Admin",
                    LastName = "User",
                    Role = UserRole.Admin,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();
            }
        }
    }
}
