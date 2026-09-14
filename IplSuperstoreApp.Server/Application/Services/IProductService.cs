using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using IPLMerchandise.Server.Domain.Entities;

namespace IPLMerchandise.Server.Application.Services
{
    public interface IProductService
    {
        Task<Product?> GetByIdAsync(Guid id);
        Task<IEnumerable<Product>> ListAsync(int page, int pageSize, string? search = null);
        Task CreateAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(Guid id);
    }
}
