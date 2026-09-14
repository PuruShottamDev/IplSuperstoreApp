using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using IPLMerchandise.Server.Application.Interfaces;
using IPLMerchandise.Server.Domain.Entities;

namespace IPLMerchandise.Server.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repo;

        public ProductService(IProductRepository repo)
        {
            _repo = repo;
        }

        public async Task CreateAsync(Product product)
        {
            await _repo.AddAsync(product);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repo.DeleteAsync(id);
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Product>> ListAsync(int page, int pageSize, string? search = null)
        {
            return await _repo.ListAsync(page, pageSize, search);
        }

        public async Task UpdateAsync(Product product)
        {
            await _repo.UpdateAsync(product);
        }
    }
}
