using System;

namespace IPLMerchandise.Server.Domain.Entities
{
    public enum ProductType { Jersey, Cap, Ball, Accessory }

    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; } = "USD";
        public ProductType Type { get; set; }
        public Guid? FranchiseId { get; set; }
        public int StockQuantity { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
