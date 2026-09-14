using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IPLMerchandise.Server.Application.Interfaces;
using IPLMerchandise.Server.Domain.Entities;
using IPLMerchandise.Server.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace IPLMerchandise.Server.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ShopDbContext _db;

        public ProductRepository(ShopDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(Product product)
        {
            await _db.Products.AddAsync(product);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var p = await _db.Products.FindAsync(id);
            if (p == null) return;
            _db.Products.Remove(p);
            await _db.SaveChangesAsync();
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            return await _db.Products.FindAsync(id);
        }

        public async Task<IEnumerable<Product>> ListAsync(int page, int pageSize, string? search = null)
        {
            var q = _db.Products.AsQueryable();
            if (!string.IsNullOrWhiteSpace(search)) q = q.Where(x => x.Name.Contains(search));
            return await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        public async Task UpdateAsync(Product product)
        {
            _db.Products.Update(product);
            await _db.SaveChangesAsync();
        }
    }
}
