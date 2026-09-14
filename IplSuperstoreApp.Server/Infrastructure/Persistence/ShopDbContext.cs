using Microsoft.EntityFrameworkCore;
using IPLMerchandise.Server.Domain.Entities;
using System;

namespace IPLMerchandise.Server.Infrastructure.Persistence
{
    public class ShopDbContext : DbContext
    {
        public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; } = null!;

        public static void SeedSampleData(ShopDbContext db)
        {
            if (db.Products.Any()) return;

            var p1 = new Product
            {
                Id = Guid.NewGuid(),
                Name = "Team Jersey",
                Description = "Official team jersey",
                Price = 79.99m,
                Currency = "USD",
                Type = ProductType.Jersey,
                StockQuantity = 100,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var p2 = new Product
            {
                Id = Guid.NewGuid(),
                Name = "Fan Cap",
                Description = "Adjustable cap",
                Price = 19.99m,
                Currency = "USD",
                Type = ProductType.Cap,
                StockQuantity = 200,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            db.Products.AddRange(p1, p2);
            db.SaveChanges();
        }
    }
}
