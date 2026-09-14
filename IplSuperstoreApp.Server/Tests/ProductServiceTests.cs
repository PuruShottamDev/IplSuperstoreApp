using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using Xunit;
using IPLMerchandise.Server.Application.Services;
using IPLMerchandise.Server.Application.Interfaces;
using IPLMerchandise.Server.Domain.Entities;

namespace IPLMerchandise.Server.Tests
{
    public class ProductServiceTests
    {
        [Fact]
        public async Task ListAsync_ReturnsItems()
        {
            var repoMock = new Mock<IProductRepository>();
            repoMock.Setup(r => r.ListAsync(1, 10, null)).ReturnsAsync(new List<Product>
            {
                new Product { Id = Guid.NewGuid(), Name = "A" }
            });

            var svc = new ProductService(repoMock.Object);
            var res = await svc.ListAsync(1, 10);
            Assert.NotNull(res);
        }
    }
}
