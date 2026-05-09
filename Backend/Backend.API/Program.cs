using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Backend.Application.Interfaces;
using Backend.Infrastructure.Data;
using Backend.Infrastructure.Services;
using Serilog;
using FluentValidation;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;
using Backend.API.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog (Story 1.1)
builder.Host.UseSerilog((context, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Application", "NewEmaraldFrinters")
        .Enrich.WithProperty("Environment", context.HostingEnvironment.EnvironmentName)
        .Enrich.WithMachineName()
        .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
        .WriteTo.File(
            path: "logs/app-.txt",
            rollingInterval: RollingInterval.Day,
            outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}",
            retainedFileCountLimit: 30);
});

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// FluentValidation with auto-validation (Story 1.1, updated Story 1.2)
builder.Services.AddValidatorsFromAssemblyContaining<Backend.Application.Validators.RegisterDtoValidator>();
builder.Services.AddFluentValidationAutoValidation();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Shipping Line API",
        Version = "v1",
        Description = "API for Shipping Line Management System",
        Contact = new OpenApiContact
        {
            Name = "Shipping Line Support",
            Email = "support@shippingline.com"
        }
    });

    // Swagger will auto-detect the server URL (removed hardcoded AddServer to fix CORS issues)

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add CORS - reads allowed origins from configuration (Cors:AllowedOrigins)
// plus FRONTEND_URL env var, plus localhost defaults for dev.
builder.Services.AddCors(options =>
{
    var configuredOrigins = builder.Configuration
        .GetSection("Cors:AllowedOrigins")
        .Get<string[]>() ?? Array.Empty<string>();

    var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL");

    var allowedOrigins = new[]
        {
            "http://localhost:5173",
            "http://localhost:3000",
            "http://frontend:5173",
            "http://frontend:5174"
        }
        .Concat(configuredOrigins)
        .Concat(string.IsNullOrWhiteSpace(frontendUrl) ? Array.Empty<string>() : new[] { frontendUrl })
        .Where(o => !string.IsNullOrWhiteSpace(o))
        .Distinct()
        .ToArray();

    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .SetIsOriginAllowed(origin =>
              {
                  if (allowedOrigins.Contains(origin)) return true;
                  // Allow any *.vercel.app preview deployment
                  try
                  {
                      var host = new Uri(origin).Host;
                      return host.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase);
                  }
                  catch { return false; }
              })
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Database - SQL Server with connection pooling and retry policy
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null);
        sqlOptions.CommandTimeout(30);
        sqlOptions.MinBatchSize(5);
        sqlOptions.MaxBatchSize(100);
    }));

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLong!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "ShippingLine";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "ShippingLineUsers";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// SignalR for real-time notifications
builder.Services.AddSignalR();

// Application Services
builder.Services.AddScoped<IAuthService, JwtTokenService>();
builder.Services.AddScoped<IPricingService, PricingService>();
builder.Services.AddScoped<IProfileService, ProfileService>();

var app = builder.Build();

// Global Exception Middleware (Story 1.1) - Must be early in pipeline
app.UseMiddleware<Backend.API.Middleware.GlobalExceptionMiddleware>();

// Seed database (do not crash startup if the DB is unreachable — log and continue)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var startupLogger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        await DbSeeder.SeedAsync(context);
    }
    catch (Exception ex)
    {
        startupLogger.LogError(ex, "Database migration/seeding failed at startup. The app will continue, but DB-backed endpoints will fail until the database is reachable.");
    }
}

// Configure the HTTP request pipeline.
// Swagger is enabled in all environments (including production) for easier API testing.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Shipping Line API v1");
    c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
});

app.UseCors("AllowFrontend");

// Serilog request logging (Story 1.1)
app.UseSerilogRequestLogging(options =>
{
    options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
        diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].ToString());
    };
});

// Only redirect to HTTPS in production (avoids issues with Swagger in development)
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();
