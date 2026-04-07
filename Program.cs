using System.Text;
using CRMKatia.Application.Commands;
using CRMKatia.Application.Commands.Handlers;
using CRMKatia.Application.Commands.Interfaces;
using CRMKatia.Application.Services;
using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using CRMKatia.Infrastructure.Persistence.Repositories;
using CRMKatia.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using AppDbContext = CRMKatia.Infrastructure.Persistence.DbContext.ApplicationDbContext;
// enable multipart/form-data for file uploads


var builder = WebApplication.CreateBuilder(args);

// ───── Database ─────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsql => npgsql.MigrationsAssembly("CRMKatia")
    )
    .UseSnakeCaseNamingConvention()
);

// ───── Identity ─────
builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = true;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// ───── JWT Authentication ─────
var jwtSection = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSection["SecretKey"]
    ?? throw new InvalidOperationException("JwtSettings:SecretKey is not configured");

builder.Services
    .AddAuthentication(o =>
    {
        o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        o.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(o =>
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey         = key,
            ValidateIssuer           = true,
            ValidIssuer              = jwtSection["Issuer"],
            ValidateAudience         = true,
            ValidAudience            = jwtSection["Audience"],
            ValidateLifetime         = true,
            ClockSkew                = TimeSpan.Zero
        };
    });

// ───── Repositories (Domain.Interfaces -> Infrastructure.Persistence) ─────
builder.Services.AddScoped<ISalonRepository, SalonRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<IGiftCardRepository, GiftCardRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IMasterRepository, MasterRepository>();
builder.Services.AddScoped<IFeedRepository, FeedRepository>();
builder.Services.AddScoped<ILeadRepository, LeadRepository>();
builder.Services.AddScoped<ISupportMessageRepository, SupportMessageRepository>();
builder.Services.AddScoped<IInvitationRepository, InvitationRepository>();

// ───── Application Services ─────
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

// ───── Command Pattern ─────
builder.Services.AddScoped<ICommandDispatcher, CommandDispatcher>();

// Register all command handlers
builder.Services.AddScoped<ICommandHandler<CreateBookingCommand, CommandResult>,   CreateBookingHandler>();
builder.Services.AddScoped<ICommandHandler<UpdateBookingStatusCommand, CommandResult>, UpdateBookingStatusHandler>();
builder.Services.AddScoped<ICommandHandler<CreateSalonCommand, CommandResult>,     CreateSalonHandler>();
builder.Services.AddScoped<ICommandHandler<RegisterUserCommand, AuthCommandResult>, RegisterUserHandler>();
builder.Services.AddScoped<ICommandHandler<LoginUserCommand, AuthCommandResult>,   LoginUserHandler>();

// ───── Controllers / MVC Views / CORS / Swagger ─────
builder.Services.AddControllersWithViews();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p =>
        p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name        = "Authorization",
        Type        = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme      = "bearer",
        BearerFormat = "JWT",
        Description = "Enter your JWT token"
    });
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ═══════════════════════════════════════════════════════════════════
var app = builder.Build();
// ═══════════════════════════════════════════════════════════════════

// Global exception handling middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // Auto-apply migrations in development
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Ensure uploads directory exists
var uploadsDir = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "uploads");
Directory.CreateDirectory(uploadsDir);

app.UseAuthentication();
app.UseAuthorization();

// Static files (wwwroot: compiled React assets, uploads, icons, etc.)
app.UseDefaultFiles();
app.UseStaticFiles();

// MVC routes: API controllers + Razor View controllers
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// API controllers (attribute-routed, under /api/...)
app.MapControllers();

// Fallback: any route not matched by MVC or static files → SPA index.html
// (Handles deep links when the user refreshes on a hash route)
app.MapFallbackToFile("index.html");

app.Run();
