using System.Reflection;
using SuperFunicular.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Load env vars
builder.Configuration.AddEnvironmentVariables();


// --------------------
// Services
// --------------------

// 🔹 Add Controllers (REQUIRED for API controllers + Swagger)
builder.Services.AddControllers();

// 🔹 Swagger + XML Docs
var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "AI Career Toolkit API",
        Version = "v1",
        Description = "Backend API for AI Career Toolkit"
    });

    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});


// 🔹 CORS (Dev-friendly)
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// 🔹 DI
builder.Services.AddScoped<IAiService, MockAiService>();
builder.Services.AddHttpClient<IAiService, GeminiAiService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(15);
});
builder.Services.AddSingleton<UsageTracker>();
builder.Services.AddSingleton<UserRateLimiter>();



var app = builder.Build();


// --------------------
// Middleware
// --------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AI Career Toolkit API v1");
        c.RoutePrefix = "swagger"; // /swagger
    });
}

app.UseHttpsRedirection();

app.UseCors("DevCors");


// 🔹 IMPORTANT: Enables Controllers
app.MapControllers();


// --------------------
// Minimal APIs (Optional)
// --------------------

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool",
    "Mild", "Warm", "Balmy", "Hot",
    "Sweltering", "Scorching"
};

app.MapGet("/api/health", () => "OK")
   .WithDescription("Checks whether the API is running")
   .WithTags("Dev");

app.MapGet("/api/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast(
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();

    return forecast;
})
.WithDescription("Gets the Weather Forecast")
.WithTags("Dev");


app.Run();


// --------------------
// Records
// --------------------

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
