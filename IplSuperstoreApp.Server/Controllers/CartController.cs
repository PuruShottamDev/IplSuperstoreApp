using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IPLMerchandise.Server.Domain.Entities;

namespace IPLMerchandise.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        // For demo purposes, use in-memory per-user cart stored in claims session (not recommended for prod)

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { items = new object[0] });
        }

        [HttpPost("items")]
        public IActionResult Add([FromBody] OrderItem item)
        {
            return Created("", item);
        }

        [HttpPut("items/{productId}")]
        public IActionResult Update(Guid productId, [FromBody] OrderItem item)
        {
            return NoContent();
        }

        [HttpDelete("items/{productId}")]
        public IActionResult Delete(Guid productId)
        {
            return NoContent();
        }
    }
}
