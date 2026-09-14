using Microsoft.EntityFrameworkCore;
using IPLMerchandise.Server.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure EF Core In-Memory database for development
builder.Services.AddDbContext<ShopDbContext>(options =>
    options.UseInMemoryDatabase("ShopDb"));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");

// Seed sample data into in-memory DB on startup (development only)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ShopDbContext>();
    ShopDbContext.SeedSampleData(db);
}

app.Run();
