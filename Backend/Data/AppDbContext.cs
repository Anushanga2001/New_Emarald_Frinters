namespace Shipping_Line_Backend.Data
{
    using Microsoft.EntityFrameworkCore;
    using Shipping_Line_Backend.Model;

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<CargoType> CargoTypes { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<Shipment> Shipments { get; set; }
        public DbSet<Quote> Quotes { get; set; }
        public DbSet<ContactForm> ContactForms { get; set; }
    }
}
