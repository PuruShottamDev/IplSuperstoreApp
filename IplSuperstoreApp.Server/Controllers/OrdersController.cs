using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IPLMerchandise.Server.Domain.Entities;

namespace IPLMerchandise.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        [HttpPost]
        public IActionResult Create([FromBody] Order order)
        {
            order.Id = Guid.NewGuid();
            order.CreatedAt = DateTime.UtcNow;
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }

        [HttpGet]
        public IActionResult List([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            return Ok(new object[0]);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            return Ok(new { id });
        }
    }
}
