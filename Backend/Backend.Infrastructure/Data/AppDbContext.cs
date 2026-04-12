using Microsoft.EntityFrameworkCore;
using Backend.Domain.Entities;

namespace Backend.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<PricingRule> PricingRules { get; set; }
        public DbSet<ContactForm> ContactForms { get; set; }
        public DbSet<Quote> Quotes { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Role).HasConversion<int>();
            });

            // PricingRule configuration
            modelBuilder.Entity<PricingRule>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ServiceType).HasConversion<int>();
            });

            // ContactForm configuration
            modelBuilder.Entity<ContactForm>(entity =>
            {
                entity.HasKey(e => e.ContactFormId);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Subject).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Message).IsRequired();
            });

            // Quote configuration
            modelBuilder.Entity<Quote>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.QuoteNumber).IsUnique();
                entity.Property(e => e.QuoteNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Origin).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Destination).IsRequired().HasMaxLength(255);
                entity.Property(e => e.CargoType).IsRequired().HasMaxLength(100);
                entity.Property(e => e.ServiceType).HasConversion<int>();
                entity.Property(e => e.Currency).HasMaxLength(10);
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(q => q.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Notification configuration
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Message).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Type).HasConversion<int>();
                entity.Property(e => e.ReferenceId).HasMaxLength(100);
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(n => n.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(e => new { e.UserId, e.IsRead });
            });
        }
    }
}
