using Microsoft.EntityFrameworkCore;
using Backend.Domain.Entities;
using Backend.Domain.Enums;

namespace Backend.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Ensure migration history is consistent before applying migrations.
            // If tables already exist but __EFMigrationsHistory is missing/empty,
            // mark the initial migration as applied to avoid "relation already exists" errors.
            var conn = context.Database.GetDbConnection();
            await conn.OpenAsync();
            using (var cmd = conn.CreateCommand())
            {
                // Create the history table if it doesn't exist
                cmd.CommandText = @"
                    CREATE TABLE IF NOT EXISTS ""__EFMigrationsHistory"" (
                        ""MigrationId"" VARCHAR(150) NOT NULL PRIMARY KEY,
                        ""ProductVersion"" VARCHAR(32) NOT NULL
                    );";
                await cmd.ExecuteNonQueryAsync();

                // Check if initial migration is already recorded
                cmd.CommandText = @"
                    SELECT COUNT(*) FROM ""__EFMigrationsHistory""
                    WHERE ""MigrationId"" = '20260201064125_InitialPostgreSQLMigration';";
                var migrationExists = Convert.ToInt64(await cmd.ExecuteScalarAsync()) > 0;

                if (!migrationExists)
                {
                    // Check if tables were already created outside of EF migrations
                    cmd.CommandText = @"
                        SELECT COUNT(*) FROM information_schema.tables
                        WHERE table_schema = 'public' AND table_name = 'Users';";
                    var tablesExist = Convert.ToInt64(await cmd.ExecuteScalarAsync()) > 0;

                    if (tablesExist)
                    {
                        // Tables exist but migration not recorded — mark it as applied
                        cmd.CommandText = @"
                            INSERT INTO ""__EFMigrationsHistory"" (""MigrationId"", ""ProductVersion"")
                            VALUES ('20260201064125_InitialPostgreSQLMigration', '10.0.0');";
                        await cmd.ExecuteNonQueryAsync();
                    }
                }
            }
            await conn.CloseAsync();

            // Apply pending migrations automatically
            await context.Database.MigrateAsync();

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

