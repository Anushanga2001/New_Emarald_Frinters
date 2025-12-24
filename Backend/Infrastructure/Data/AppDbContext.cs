using Microsoft.EntityFrameworkCore;
using Shipping_Line_Backend.Domain.Entities;
using Shipping_Line_Backend.Domain.Enums;

namespace Shipping_Line_Backend.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Shipment> Shipments { get; set; }
        public DbSet<Package> Packages { get; set; }
        public DbSet<TrackingEvent> TrackingEvents { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceLineItem> InvoiceLineItems { get; set; }
        public DbSet<PricingRule> PricingRules { get; set; }
        public DbSet<Document> Documents { get; set; }

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

            // Customer configuration
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.UserId).IsUnique();
                entity.HasOne(e => e.User)
                    .WithOne(u => u.Customer)
                    .HasForeignKey<Customer>(c => c.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Shipment configuration
            modelBuilder.Entity<Shipment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.TrackingNumber).IsUnique();
                entity.Property(e => e.TrackingNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Status).HasConversion<int>();
                entity.Property(e => e.ServiceType).HasConversion<int>();
                entity.HasOne(e => e.Customer)
                    .WithMany(c => c.Shipments)
                    .HasForeignKey(s => s.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Package configuration
            modelBuilder.Entity<Package>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Shipment)
                    .WithMany(s => s.Packages)
                    .HasForeignKey(p => p.ShipmentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // TrackingEvent configuration
            modelBuilder.Entity<TrackingEvent>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Status).HasConversion<int>();
                entity.HasOne(e => e.Shipment)
                    .WithMany(s => s.TrackingEvents)
                    .HasForeignKey(t => t.ShipmentId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(t => t.CreatedBy)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Invoice configuration
            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.InvoiceNumber).IsUnique();
                entity.Property(e => e.InvoiceNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Status).HasConversion<int>();
                entity.HasOne(e => e.Customer)
                    .WithMany(c => c.Invoices)
                    .HasForeignKey(i => i.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // InvoiceLineItem configuration
            modelBuilder.Entity<InvoiceLineItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Invoice)
                    .WithMany(i => i.LineItems)
                    .HasForeignKey(l => l.InvoiceId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Shipment)
                    .WithMany(s => s.InvoiceLineItems)
                    .HasForeignKey(l => l.ShipmentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // PricingRule configuration
            modelBuilder.Entity<PricingRule>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ServiceType).HasConversion<int>();
            });

            // Document configuration
            modelBuilder.Entity<Document>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.DocumentType).HasConversion<int>();
                entity.HasOne(e => e.Shipment)
                    .WithMany(s => s.Documents)
                    .HasForeignKey(d => d.ShipmentId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.UploadedByUser)
                    .WithMany()
                    .HasForeignKey(d => d.UploadedBy)
                    .OnDelete(DeleteBehavior.SetNull);
            });
        }
    }
}
