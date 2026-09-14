using System;
using System.Collections.Generic;

namespace IPLMerchandise.Server.Domain.Entities
{
    public class Order
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = null!;
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Created";
        public DateTime CreatedAt { get; set; }
    }

    public class OrderItem
    {
        public Guid ProductId { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal => UnitPrice * Quantity;
    }
}
