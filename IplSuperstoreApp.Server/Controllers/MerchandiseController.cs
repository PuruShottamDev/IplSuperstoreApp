using Microsoft.AspNetCore.Mvc;

namespace IplSuperstoreApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MerchandiseController : ControllerBase
{
    [HttpGet("catalog")]
    public IActionResult GetCatalog([FromQuery] string? franchise)
    {
        // Return your database products or verified items
        return Ok(new[]
        {
            new {
                Id = "CSK-JERSEY-07",
                Name = "CSK 2025 Match Edition Jersey - Dhoni #7",
                Franchise = "CSK",
                Category = "Jerseys",
                PriceINR = 3499,
                MrpINR = 4299,
                Rating = 4.9,
                Stock = 14
            }
        });
    }

    [HttpPost("orders")]
    public IActionResult CreateOrder([FromBody] object orderPayload)
    {
        var orderId = $"IPL-ORD-{Random.Shared.Next(10000, 99999)}";
        return CreatedAtAction(nameof(GetCatalog), new { id = orderId, status = "In Transit" });
    }
}