# Migration Guide: Katia Backend to .NET

**Project:** Katia - Beauty Salon SaaS Platform  
**Current Stack:** Supabase + Deno/Hono Edge Functions  
**Target Stack:** ASP.NET Core Web API + Entity Framework Core  
**Estimated Timeline:** 3-4 months

---

## Table of Contents

1. [Overview](#1-overview)
2. [Technology Mapping](#2-technology-mapping)
3. [Project Setup](#3-project-setup)
4. [Database Migration](#4-database-migration)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [API Endpoints Migration](#6-api-endpoints-migration)
7. [Business Logic Migration](#7-business-logic-migration)
8. [Payments (Stripe)](#8-payments-stripe)
9. [File Storage](#9-file-storage)
10. [Real-time & Background Jobs](#10-real-time--background-jobs)
11. [Notifications & Email](#11-notifications--email)
12. [Frontend Integration](#12-frontend-integration)
13. [Migration Phases & Roadmap](#13-migration-phases--roadmap)
14. [Environment Variables](#14-environment-variables)

---

## 1. Overview

### Current Architecture

```
Frontend (React + TypeScript + Vite)
         │
         ├─── Supabase JS Client (supabase-js)
         │         ├── PostgreSQL (database queries)
         │         ├── Supabase Auth (authentication)
         │         ├── Supabase Storage (file uploads)
         │         └── Supabase Realtime (WebSockets)
         │
         └─── Supabase Edge Functions (Deno + Hono)
                   ├── /register
                   ├── /salon-routes
                   ├── /bookings
                   ├── /stripe-routes
                   ├── /deposit
                   ├── /notifications
                   └── ... (18+ route groups)
```

### Target Architecture

```
Frontend (React + TypeScript + Vite) — NO changes needed
         │
         └─── ASP.NET Core Web API (C#)
                   ├── Entity Framework Core → PostgreSQL (or SQL Server)
                   ├── ASP.NET Core Identity + JWT (authentication)
                   ├── Azure Blob Storage / AWS S3 (file uploads)
                   ├── SignalR (WebSockets / real-time)
                   ├── Hangfire (background jobs / scheduler)
                   └── Stripe.net (payments)
```

---

## 2. Technology Mapping

| Current (Supabase/Deno) | .NET Equivalent |
|---|---|
| Supabase PostgreSQL | PostgreSQL or SQL Server + EF Core |
| Supabase Auth (JWT) | ASP.NET Core Identity + JwtBearer |
| Supabase Storage | Azure Blob Storage or AWS S3 |
| Supabase Realtime | SignalR |
| Deno Edge Functions | ASP.NET Core Web API |
| Hono framework | ASP.NET Core minimal APIs or Controllers |
| 15-min notification scheduler | Hangfire recurring jobs |
| Row-Level Security (RLS) | Authorization policies + EF Core filters |
| Deno env vars | `appsettings.json` + dotnet user-secrets |

---

## 3. Project Setup

### 3.1 Create the .NET Solution

```bash
# Create the solution
dotnet new sln -n Katia

# Create the Web API project
dotnet new webapi -n Katia.API -o src/Katia.API

# Create supporting projects
dotnet new classlib -n Katia.Domain     -o src/Katia.Domain
dotnet new classlib -n Katia.Application -o src/Katia.Application
dotnet new classlib -n Katia.Infrastructure -o src/Katia.Infrastructure

# Add all projects to solution
dotnet sln add src/Katia.API/Katia.API.csproj
dotnet sln add src/Katia.Domain/Katia.Domain.csproj
dotnet sln add src/Katia.Application/Katia.Application.csproj
dotnet sln add src/Katia.Infrastructure/Katia.Infrastructure.csproj
```

### 3.2 Recommended NuGet Packages

```bash
# In Katia.API
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Swashbuckle.AspNetCore              # Swagger
dotnet add package Hangfire.AspNetCore                 # Background jobs
dotnet add package Hangfire.PostgreSql                 # If using PostgreSQL
dotnet add package Microsoft.AspNetCore.SignalR        # Real-time

# In Katia.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL  # For PostgreSQL
# OR
dotnet add package Microsoft.EntityFrameworkCore.SqlServer # For SQL Server

dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Stripe.net                          # Stripe payments
dotnet add package Azure.Storage.Blobs                 # File storage
dotnet add package MailKit                             # Email (replaces Resend)
dotnet add package Serilog.AspNetCore                  # Logging
```

### 3.3 Folder Structure

```
Katia/
├── src/
│   ├── Katia.API/                    # Entry point, controllers, middleware
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs
│   │   │   ├── SalonController.cs
│   │   │   ├── BookingController.cs
│   │   │   ├── PaymentController.cs
│   │   │   ├── DepositController.cs
│   │   │   ├── GiftCardController.cs
│   │   │   ├── NotificationController.cs
│   │   │   ├── StorageController.cs
│   │   │   └── FeedController.cs
│   │   ├── Hubs/
│   │   │   └── BookingHub.cs         # SignalR hub
│   │   ├── Middleware/
│   │   │   └── ErrorHandlingMiddleware.cs
│   │   └── Program.cs
│   │
│   ├── Katia.Domain/                 # Entities, enums, business rules
│   │   ├── Entities/
│   │   │   ├── User.cs
│   │   │   ├── Salon.cs
│   │   │   ├── Service.cs
│   │   │   ├── Master.cs
│   │   │   ├── Booking.cs
│   │   │   ├── Client.cs
│   │   │   ├── Payment.cs
│   │   │   ├── GiftCard.cs
│   │   │   ├── FeedPost.cs
│   │   │   └── Notification.cs
│   │   └── Enums/
│   │       ├── BookingStatus.cs
│   │       ├── UserRole.cs
│   │       └── DepositType.cs
│   │
│   ├── Katia.Application/            # Use cases, DTOs, interfaces
│   │   ├── Interfaces/
│   │   ├── Services/
│   │   └── DTOs/
│   │
│   └── Katia.Infrastructure/         # EF Core, external services
│       ├── Data/
│       │   ├── ApplicationDbContext.cs
│       │   └── Migrations/
│       ├── Repositories/
│       └── Services/
│
└── tests/
    └── Katia.Tests/
```

---

## 4. Database Migration

### 4.1 Entity Models

The current app uses Supabase PostgreSQL. You can keep PostgreSQL or switch to SQL Server. Here are the main entity models to create in C#:

**`Katia.Domain/Entities/User.cs`**
```csharp
public class User : IdentityUser<Guid>
{
    public string FullName { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Salon> OwnedSalons { get; set; } = [];
    public ICollection<Booking> Bookings { get; set; } = [];
}
```

**`Katia.Domain/Entities/Salon.cs`**
```csharp
public class Salon
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public SubscriptionPlan Plan { get; set; }
    public string? StripeCustomerId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;
    public ICollection<Service> Services { get; set; } = [];
    public ICollection<Master> Masters { get; set; } = [];
    public ICollection<Booking> Bookings { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

**`Katia.Domain/Entities/Booking.cs`**
```csharp
public class Booking
{
    public Guid Id { get; set; }
    public Guid SalonId { get; set; }
    public Guid ClientId { get; set; }
    public Guid MasterId { get; set; }
    public Guid ServiceId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public decimal Price { get; set; }
    public decimal? DepositAmount { get; set; }
    public bool DepositPaid { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeclineDeadline { get; set; }  // Auto-decline in 2 hours
    public Salon Salon { get; set; } = null!;
    public User Client { get; set; } = null!;
    public Master Master { get; set; } = null!;
    public Service Service { get; set; } = null!;
    public ICollection<BookingStatusHistory> StatusHistory { get; set; } = [];
}
```

**`Katia.Domain/Enums/BookingStatus.cs`**
```csharp
public enum BookingStatus
{
    Pending,
    Confirmed,
    RescheduledPending,
    DeclinedBySalon,
    CancelledByClient,
    CancelledBySalon,
    Completed,
    NoShow,
    Expired
}
```

**`Katia.Domain/Enums/UserRole.cs`**
```csharp
public enum UserRole
{
    SuperAdmin,
    Owner,
    Admin,
    Master,
    Client
}
```

### 4.2 DbContext

**`Katia.Infrastructure/Data/ApplicationDbContext.cs`**
```csharp
public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Salon> Salons => Set<Salon>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Master> Masters => Set<Master>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<GiftCard> GiftCards => Set<GiftCard>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<FeedPost> FeedPosts => Set<FeedPost>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<DepositSettings> DepositSettings => Set<DepositSettings>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Multi-tenant query filters (replaces Supabase RLS)
        // Example: clients only see their own bookings
        builder.Entity<Booking>()
            .HasIndex(b => new { b.SalonId, b.Status });

        builder.Entity<GiftCard>()
            .HasIndex(g => g.Code)
            .IsUnique();
    }
}
```

### 4.3 Run EF Core Migrations

```bash
# Install EF Core tools
dotnet tool install --global dotnet-ef

# Create initial migration
dotnet ef migrations add InitialCreate --project src/Katia.Infrastructure --startup-project src/Katia.API

# Apply to database
dotnet ef database update --project src/Katia.Infrastructure --startup-project src/Katia.API
```

### 4.4 Migrate Existing Data from Supabase

```bash
# Export data from Supabase
pg_dump "postgresql://postgres:password@db.bbayqzqlqgqipohulcsd.supabase.co:5432/postgres" \
  --data-only --format=plain > supabase_data.sql

# Import into your new database
psql "your-new-connection-string" < supabase_data.sql
```

---

## 5. Authentication & Authorization

### 5.1 Replace Supabase Auth with ASP.NET Core Identity + JWT

**`Program.cs`**
```csharp
// Add Identity
builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// Add Authorization Policies (replaces Supabase RLS)
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("OwnerOnly", policy => policy.RequireRole("Owner"));
    options.AddPolicy("StaffOrAbove", policy => policy.RequireRole("Owner", "Admin", "Master"));
    options.AddPolicy("AdminOrAbove", policy => policy.RequireRole("Owner", "Admin"));
});
```

### 5.2 Auth Controller

**`Katia.API/Controllers/AuthController.cs`**
```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _config;

    [HttpPost("register/owner")]
    public async Task<IActionResult> RegisterOwner([FromBody] RegisterOwnerDto dto)
    {
        var user = new User { Email = dto.Email, UserName = dto.Email, FullName = dto.FullName, Role = UserRole.Owner };
        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);
        await _userManager.AddToRoleAsync(user, "Owner");
        return Ok(new { message = "Registration successful. Please verify your email." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user is null) return Unauthorized();

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!result.Succeeded) return Unauthorized();

        var token = GenerateJwtToken(user);
        return Ok(new { token, user = new { user.Id, user.Email, user.FullName, user.Role } });
    }

    [HttpPost("register/master")]
    [Authorize(Policy = "AdminOrAbove")]
    public async Task<IActionResult> InviteMaster([FromBody] InviteMasterDto dto)
    {
        // Generate invitation token, send email
        // Similar to current /register/master Hono route
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

### 5.3 Frontend JWT Update

Update the Supabase client calls in the frontend to use your .NET JWT. The token format is the same (JWT), so most of the auth logic stays the same — you just need to change where you get the token from.

```typescript
// src/lib/api.ts (new file)
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // your .NET API URL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('katia_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 6. API Endpoints Migration

All current edge function routes map directly to ASP.NET Core controllers. Here is the complete mapping:

### 6.1 Salon Controller

**Current Hono routes → `SalonController.cs`**

| Current Route | .NET Route | Method |
|---|---|---|
| `GET /salon/:salonId` | `GET /api/salons/{id}` | GetById |
| `POST /salon/:salonId/update` | `PUT /api/salons/{id}` | Update |
| `GET /salon/:salonId/masters` | `GET /api/salons/{id}/masters` | GetMasters |
| `GET /salon/:salonId/services` | `GET /api/salons/{id}/services` | GetServices |
| `GET /salon/:salonId/staff` | `GET /api/salons/{id}/staff` | GetStaff |
| `POST /salon/:salonId/invite` | `POST /api/salons/{id}/invite` | InviteStaff |
| `DELETE /salon/:salonId/staff/:id` | `DELETE /api/salons/{id}/staff/{staffId}` | RemoveStaff |

```csharp
[ApiController]
[Route("api/salons")]
[Authorize]
public class SalonController : ControllerBase
{
    private readonly ISalonService _salonService;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id) { ... }

    [HttpPut("{id}")]
    [Authorize(Policy = "AdminOrAbove")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSalonDto dto) { ... }

    [HttpGet("{id}/masters")]
    public async Task<IActionResult> GetMasters(Guid id) { ... }

    [HttpPost("{id}/invite")]
    [Authorize(Policy = "OwnerOnly")]
    public async Task<IActionResult> InviteStaff(Guid id, [FromBody] InviteStaffDto dto) { ... }

    [HttpDelete("{id}/staff/{staffId}")]
    [Authorize(Policy = "OwnerOnly")]
    public async Task<IActionResult> RemoveStaff(Guid id, Guid staffId) { ... }
}
```

### 6.2 Booking Controller

| Current Route | .NET Route | Method |
|---|---|---|
| `POST /bookings/create` | `POST /api/bookings` | Create |
| `GET /bookings/:id` | `GET /api/bookings/{id}` | GetById |
| `PATCH /bookings/:id` | `PATCH /api/bookings/{id}` | Update |
| `DELETE /bookings/:id` | `DELETE /api/bookings/{id}` | Cancel |
| `POST /bookings/:id/confirm` | `POST /api/bookings/{id}/confirm` | Confirm |
| `POST /bookings/:id/decline` | `POST /api/bookings/{id}/decline` | Decline |
| `POST /bookings/:id/reschedule` | `POST /api/bookings/{id}/reschedule` | Reschedule |
| `POST /bookings/:id/accept-reschedule` | `POST /api/bookings/{id}/accept-reschedule` | AcceptReschedule |
| `GET /salon/:salonId/bookings` | `GET /api/salons/{id}/bookings` | GetBySalon |

### 6.3 Payment Controller

| Current Route | .NET Route |
|---|---|
| `POST /stripe/create-payment-intent` | `POST /api/payments/intent` |
| `POST /stripe/subscription/create` | `POST /api/payments/subscriptions` |
| `POST /stripe/subscription/cancel` | `DELETE /api/payments/subscriptions/{id}` |
| `GET /stripe/subscription/:id` | `GET /api/payments/subscriptions/{id}` |
| `POST /stripe/webhook` | `POST /api/payments/webhook` |

### 6.4 Program.cs Full Setup

```csharp
var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity + JWT (see section 5)
// ...

// SignalR
builder.Services.AddSignalR();

// Hangfire
builder.Services.AddHangfire(config =>
    config.UsePostgreSqlStorage(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddHangfireServer();

// CORS (same as current Hono setup - all origins)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// Stripe
StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Application Services
builder.Services.AddScoped<ISalonService, SalonService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IGiftCardService, GiftCardService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IStorageService, AzureBlobStorageService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<BookingHub>("/hubs/booking");  // SignalR

// Register Hangfire recurring job (replaces 15-min Deno scheduler)
RecurringJob.AddOrUpdate<INotificationService>(
    "send-booking-reminders",
    service => service.SendPendingReminders(),
    Cron.Minutely(15));

app.Run();
```

---

## 7. Business Logic Migration

### 7.1 Booking Workflow State Machine

The current booking workflow is a complex state machine. Port it as a service:

**`Katia.Application/Services/BookingService.cs`**
```csharp
public class BookingService : IBookingService
{
    private readonly ApplicationDbContext _db;
    private readonly INotificationService _notifications;

    public async Task<Booking> CreateAsync(CreateBookingDto dto, Guid clientId)
    {
        // 1. Check for calendar conflicts
        var conflict = await _db.Bookings
            .Where(b => b.MasterId == dto.MasterId
                     && b.Status != BookingStatus.Cancelled
                     && b.StartTime < dto.EndTime
                     && b.EndTime > dto.StartTime)
            .AnyAsync();

        if (conflict) throw new ConflictException("Time slot is not available.");

        // 2. Create booking in Pending state
        var booking = new Booking
        {
            SalonId = dto.SalonId,
            ClientId = clientId,
            MasterId = dto.MasterId,
            ServiceId = dto.ServiceId,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Status = BookingStatus.Pending,
            DeclineDeadline = DateTime.UtcNow.AddHours(2)  // Auto-decline in 2 hours
        };

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();

        // 3. Send notification to salon
        await _notifications.SendAsync(booking.SalonId, "New booking request", booking.Id);

        return booking;
    }

    public async Task ConfirmAsync(Guid bookingId, Guid actorId)
    {
        var booking = await GetAndValidateAsync(bookingId);
        ValidateTransition(booking.Status, BookingStatus.Confirmed);

        booking.Status = BookingStatus.Confirmed;
        booking.StatusHistory.Add(new BookingStatusHistory
        {
            Status = BookingStatus.Confirmed,
            ActorId = actorId,
            ChangedAt = DateTime.UtcNow
        });

        await _db.SaveChangesAsync();
        await _notifications.SendAsync(booking.ClientId, "Your booking is confirmed!", bookingId);
    }

    public async Task DeclineAsync(Guid bookingId, Guid actorId, string? reason = null)
    {
        var booking = await GetAndValidateAsync(bookingId);
        ValidateTransition(booking.Status, BookingStatus.DeclinedBySalon);

        booking.Status = BookingStatus.DeclinedBySalon;
        await _db.SaveChangesAsync();
        await _notifications.SendAsync(booking.ClientId, "Your booking was declined.", bookingId);
    }

    public async Task RescheduleAsync(Guid bookingId, RescheduleDto dto, Guid actorId)
    {
        var booking = await GetAndValidateAsync(bookingId);

        booking.Status = BookingStatus.RescheduledPending;
        booking.StartTime = dto.NewStartTime;
        booking.EndTime = dto.NewEndTime;
        await _db.SaveChangesAsync();

        await _notifications.SendAsync(booking.ClientId, "Reschedule request from salon.", bookingId);
    }

    // Auto-expire pending bookings older than 2 hours (called by Hangfire)
    public async Task ExpirePendingBookingsAsync()
    {
        var expired = await _db.Bookings
            .Where(b => b.Status == BookingStatus.Pending
                     && b.DeclineDeadline < DateTime.UtcNow)
            .ToListAsync();

        foreach (var booking in expired)
        {
            booking.Status = BookingStatus.Expired;
            await _notifications.SendAsync(booking.ClientId, "Booking request expired.", booking.Id);
        }

        await _db.SaveChangesAsync();
    }

    private static void ValidateTransition(BookingStatus from, BookingStatus to)
    {
        var allowed = new Dictionary<BookingStatus, BookingStatus[]>
        {
            [BookingStatus.Pending] = [BookingStatus.Confirmed, BookingStatus.DeclinedBySalon, BookingStatus.Expired, BookingStatus.CancelledByClient],
            [BookingStatus.Confirmed] = [BookingStatus.RescheduledPending, BookingStatus.CancelledBySalon, BookingStatus.Completed, BookingStatus.NoShow],
            [BookingStatus.RescheduledPending] = [BookingStatus.Confirmed, BookingStatus.DeclinedBySalon],
        };

        if (!allowed.TryGetValue(from, out var validTargets) || !validTargets.Contains(to))
            throw new InvalidOperationException($"Cannot transition from {from} to {to}.");
    }
}
```

### 7.2 Deposit Calculation

**`Katia.Application/Services/DepositService.cs`**
```csharp
public class DepositService : IDepositService
{
    public decimal CalculateDeposit(DepositSettings settings, decimal servicePrice)
    {
        if (!settings.DepositEnabled) return 0;

        decimal amount = settings.DepositType switch
        {
            DepositType.Fixed => settings.FixedAmount,
            DepositType.Percentage => servicePrice * (settings.PercentageAmount / 100),
            _ => 0
        };

        return Math.Clamp(amount, settings.MinDepositAmount, settings.MaxDepositAmount);
    }

    public decimal CalculateRefund(Booking booking, DateTime cancellationTime)
    {
        if (booking.DepositAmount is null or 0) return 0;

        var hoursUntilAppointment = (booking.StartTime - cancellationTime).TotalHours;

        return hoursUntilAppointment switch
        {
            >= 24 => booking.DepositAmount.Value,                           // Full refund
            >= 12 => booking.DepositAmount.Value * 0.5m,                    // 50% refund
            _ => 0                                                           // No refund
        };
    }
}
```

### 7.3 Gift Card System

**`Katia.Application/Services/GiftCardService.cs`**
```csharp
public class GiftCardService : IGiftCardService
{
    private readonly ApplicationDbContext _db;

    public async Task<GiftCard> CreateAsync(CreateGiftCardDto dto)
    {
        var code = GenerateCode();  // KATIA-XXXX-XXXX-XXXX

        var card = new GiftCard
        {
            Code = code,
            InitialAmount = dto.Amount,
            RemainingAmount = dto.Amount,
            Theme = dto.Theme,
            RecipientEmail = dto.RecipientEmail,
            ExpiresAt = dto.NeverExpires ? null : DateTime.UtcNow.AddYears(1),
            Status = GiftCardStatus.Active,
            SalonId = dto.SalonId,
            PurchasedBy = dto.PurchasedBy
        };

        _db.GiftCards.Add(card);
        await _db.SaveChangesAsync();
        return card;
    }

    public async Task<GiftCard> RedeemAsync(string code, decimal amount, Guid bookingId)
    {
        var card = await _db.GiftCards
            .FirstOrDefaultAsync(g => g.Code == code && g.Status == GiftCardStatus.Active)
            ?? throw new NotFoundException("Gift card not found or already used.");

        if (card.ExpiresAt.HasValue && card.ExpiresAt < DateTime.UtcNow)
            throw new InvalidOperationException("Gift card has expired.");

        if (card.RemainingAmount < amount)
            throw new InvalidOperationException("Insufficient gift card balance.");

        card.RemainingAmount -= amount;
        card.Status = card.RemainingAmount == 0
            ? GiftCardStatus.FullyUsed
            : GiftCardStatus.PartiallyUsed;

        card.UsageHistory.Add(new GiftCardUsage
        {
            AmountUsed = amount,
            BookingId = bookingId,
            UsedAt = DateTime.UtcNow
        });

        await _db.SaveChangesAsync();
        return card;
    }

    private static string GenerateCode()
    {
        static string Segment() => Random.Shared.Next(0x1000, 0xFFFF).ToString("X4");
        return $"KATIA-{Segment()}-{Segment()}-{Segment()}";
    }
}
```

### 7.4 Multi-Currency

**`Katia.Application/Services/CurrencyService.cs`**
```csharp
public class CurrencyService : ICurrencyService
{
    // AED and SAR use psychological 1:1 pricing (not real exchange rates)
    private static readonly HashSet<string> PsychologicalPricingCurrencies = ["AED", "SAR"];

    public decimal ConvertPrice(decimal usdPrice, string targetCurrency, decimal exchangeRate)
    {
        if (targetCurrency == "USD") return usdPrice;

        if (PsychologicalPricingCurrencies.Contains(targetCurrency))
            return usdPrice; // 1:1 psychological pricing

        return Math.Round(usdPrice * exchangeRate, 2);
    }
}
```

---

## 8. Payments (Stripe)

The Stripe integration can be mostly reused since the frontend already uses `@stripe/react-stripe-js`. You only need to rewrite the server-side routes.

**`Katia.API/Controllers/PaymentController.cs`**
```csharp
[ApiController]
[Route("api/payments")]
public class PaymentController : ControllerBase
{
    [HttpPost("intent")]
    [Authorize]
    public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentIntentDto dto)
    {
        var options = new PaymentIntentCreateOptions
        {
            Amount = (long)(dto.Amount * 100), // Convert to cents
            Currency = dto.Currency.ToLower(),
            Metadata = new Dictionary<string, string>
            {
                { "bookingId", dto.BookingId.ToString() },
                { "salonId", dto.SalonId.ToString() }
            }
        };

        var service = new PaymentIntentService();
        var intent = await service.CreateAsync(options);

        return Ok(new { clientSecret = intent.ClientSecret });
    }

    [HttpPost("subscriptions")]
    [Authorize(Policy = "OwnerOnly")]
    public async Task<IActionResult> CreateSubscription([FromBody] CreateSubscriptionDto dto)
    {
        var options = new SubscriptionCreateOptions
        {
            Customer = dto.StripeCustomerId,
            Items = [new SubscriptionItemOptions { Price = dto.PriceId }],
            PaymentBehavior = "default_incomplete",
            Expand = ["latest_invoice.payment_intent"]
        };

        var service = new SubscriptionService();
        var subscription = await service.CreateAsync(options);

        return Ok(new
        {
            subscriptionId = subscription.Id,
            clientSecret = subscription.LatestInvoice.PaymentIntent.ClientSecret
        });
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var stripeEvent = EventUtility.ConstructEvent(
            json,
            Request.Headers["Stripe-Signature"],
            _config["Stripe:WebhookSecret"]);

        switch (stripeEvent.Type)
        {
            case "payment_intent.succeeded":
                // Update booking payment status
                break;
            case "customer.subscription.deleted":
                // Downgrade salon plan
                break;
        }

        return Ok();
    }
}
```

---

## 9. File Storage

Replace Supabase Storage (7 buckets) with Azure Blob Storage or AWS S3.

**`Katia.Infrastructure/Services/AzureBlobStorageService.cs`**
```csharp
public class AzureBlobStorageService : IStorageService
{
    private readonly BlobServiceClient _blobServiceClient;

    // Supabase buckets → Azure containers:
    // salons, services, products, masters, clients, beauty-feed, certificates
    private static readonly string[] Containers =
        ["salons", "services", "products", "masters", "clients", "beauty-feed", "certificates"];

    public async Task<string> UploadAsync(Stream fileStream, string bucket, string fileName, string contentType)
    {
        var container = _blobServiceClient.GetBlobContainerClient(bucket);
        await container.CreateIfNotExistsAsync(PublicAccessType.Blob);

        var blobName = $"{Guid.NewGuid()}/{fileName}";
        var blob = container.GetBlobClient(blobName);

        await blob.UploadAsync(fileStream, new BlobHttpHeaders { ContentType = contentType });

        return blob.Uri.ToString();
    }

    public async Task DeleteAsync(string bucket, string blobName)
    {
        var container = _blobServiceClient.GetBlobContainerClient(bucket);
        await container.GetBlobClient(blobName).DeleteIfExistsAsync();
    }
}
```

**Frontend update** — replace Supabase storage calls:
```typescript
// Before (Supabase)
const { data } = await supabase.storage.from('salons').upload(path, file);

// After (.NET API)
const formData = new FormData();
formData.append('file', file);
formData.append('bucket', 'salons');
const { data } = await apiClient.post('/api/storage/upload', formData);
```

---

## 10. Real-time & Background Jobs

### 10.1 SignalR (replaces Supabase Realtime)

**`Katia.API/Hubs/BookingHub.cs`**
```csharp
[Authorize]
public class BookingHub : Hub
{
    public async Task JoinSalonGroup(string salonId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"salon-{salonId}");
    }

    public async Task LeaveSalonGroup(string salonId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"salon-{salonId}");
    }
}
```

**Notify clients from services:**
```csharp
// In BookingService.cs - inject IHubContext
await _hubContext.Clients.Group($"salon-{booking.SalonId}")
    .SendAsync("BookingStatusChanged", new { booking.Id, booking.Status });
```

**Frontend update:**
```typescript
import { HubConnectionBuilder } from '@microsoft/signalr';

const connection = new HubConnectionBuilder()
  .withUrl(`${API_BASE_URL}/hubs/booking`, {
    accessTokenFactory: () => localStorage.getItem('katia_token') ?? ''
  })
  .withAutomaticReconnect()
  .build();

await connection.start();
connection.on('BookingStatusChanged', (data) => {
  // update UI
});
```

Install the npm package: `npm install @microsoft/signalr`

### 10.2 Hangfire (replaces Deno 15-min scheduler)

Register recurring jobs in `Program.cs`:
```csharp
// Send booking reminders every 15 minutes
RecurringJob.AddOrUpdate<INotificationService>(
    "booking-reminders",
    s => s.SendPendingReminders(),
    "*/15 * * * *");

// Auto-expire pending bookings hourly
RecurringJob.AddOrUpdate<IBookingService>(
    "expire-pending-bookings",
    s => s.ExpirePendingBookingsAsync(),
    Cron.Hourly());
```

Access Hangfire dashboard: `app.MapHangfireDashboard("/hangfire");`

---

## 11. Notifications & Email

Replace Resend API with MailKit (or keep Resend via HTTP):

**`Katia.Infrastructure/Services/EmailService.cs`**
```csharp
public class EmailService : IEmailService
{
    private readonly SmtpClient _smtp;
    private readonly IConfiguration _config;

    public async Task SendBookingConfirmationAsync(string toEmail, Booking booking)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Katia", "noreply@katia.app"));
        message.To.Add(new MailboxAddress("", toEmail));
        message.Subject = "Your booking is confirmed!";
        message.Body = new TextPart("html")
        {
            Text = BuildBookingConfirmationHtml(booking)
        };

        await _smtp.SendAsync(message);
    }
}
```

> **Alternative:** Keep using Resend API via HTTP client — it works with any backend, not just Deno.

---

## 12. Frontend Integration

The React frontend requires minimal changes. The key is replacing Supabase client calls with your .NET API calls.

### 12.1 Replace Supabase Client

```typescript
// src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('katia_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('katia_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);
```

### 12.2 Update AuthContext

```typescript
// src/contexts/AuthContext.tsx — simplified
const login = async (email: string, password: string) => {
  const { data } = await api.post('/api/auth/login', { email, password });
  localStorage.setItem('katia_token', data.token);
  setUser(data.user);
};

const logout = () => {
  localStorage.removeItem('katia_token');
  setUser(null);
};
```

### 12.3 New Environment Variables for Frontend

```env
VITE_API_BASE_URL=https://api.katia.app          # Your .NET API URL
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...          # Keep as is
# Remove VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

---

## 13. Migration Phases & Roadmap

### Phase 1 — Foundation (Weeks 1-3)

- [ ] Set up .NET solution and project structure
- [ ] Configure PostgreSQL + Entity Framework Core
- [ ] Define all domain entities (User, Salon, Booking, etc.)
- [ ] Create and run initial migrations
- [ ] Set up ASP.NET Core Identity and JWT authentication
- [ ] Implement `AuthController` (register owner, login, invite master/admin)
- [ ] Verify frontend can authenticate with .NET JWT

**Milestone:** Users can log in and receive a JWT token.

### Phase 2 — Core API (Weeks 4-6)

- [ ] Implement `SalonController` (CRUD, staff management)
- [ ] Implement `BookingController` (create, list, cancel)
- [ ] Implement `ServiceController` and `MasterController`
- [ ] Set up CORS, Swagger, Serilog logging
- [ ] Deploy .NET API to staging environment
- [ ] Update frontend to call .NET API for salons and bookings

**Milestone:** Core salon and booking management works end-to-end.

### Phase 3 — Business Logic (Weeks 7-9)

- [ ] Port booking state machine (`Pending → Confirmed → Completed`, etc.)
- [ ] Port deposit calculation and refund logic
- [ ] Port gift card system (create, redeem, partial usage)
- [ ] Port multi-currency conversion logic
- [ ] Configure Hangfire for background jobs
- [ ] Port auto-expire pending bookings job

**Milestone:** Full booking workflow with deposits and gift cards works.

### Phase 4 — Payments & Storage (Weeks 10-11)

- [ ] Implement Stripe payment intents
- [ ] Implement Stripe subscription management (3 plans)
- [ ] Implement Stripe webhook handler
- [ ] Set up Azure Blob Storage (7 containers)
- [ ] Implement file upload/delete API
- [ ] Update frontend file uploads to use new API

**Milestone:** Payments and file uploads work.

### Phase 5 — Real-time & Notifications (Week 12)

- [ ] Set up SignalR hub for real-time booking updates
- [ ] Update frontend to use `@microsoft/signalr`
- [ ] Implement email notifications (booking confirmation, reminders)
- [ ] Set up Hangfire recurring job for 15-minute reminder scheduler
- [ ] Port SMS notifications if applicable

**Milestone:** Real-time updates and notifications work.

### Phase 6 — Testing & Cutover (Weeks 13-16)

- [ ] Write integration tests for all controllers
- [ ] Migrate existing Supabase data to new database
- [ ] Run both systems in parallel (blue/green)
- [ ] Validate all features against the current production system
- [ ] Switch DNS / update environment variables
- [ ] Monitor for 1 week, then decommission Supabase

---

## 14. Environment Variables

### Backend (`appsettings.json` / environment variables)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=katia;Username=postgres;Password=yourpassword"
  },
  "Jwt": {
    "Key": "your-super-secret-jwt-signing-key-minimum-32-chars",
    "Issuer": "https://api.katia.app",
    "Audience": "https://katia.app"
  },
  "Stripe": {
    "SecretKey": "sk_live_...",
    "WebhookSecret": "whsec_...",
    "PublishableKey": "pk_live_..."
  },
  "Azure": {
    "BlobStorageConnectionString": "DefaultEndpointsProtocol=https;AccountName=..."
  },
  "Email": {
    "SmtpHost": "smtp.youremail.com",
    "SmtpPort": 587,
    "Username": "noreply@katia.app",
    "Password": "your-smtp-password"
  }
}
```

### Frontend (`.env`)

```env
VITE_API_BASE_URL=https://api.katia.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Quick Reference: Current vs. Target

| Concern | Current | Target |
|---|---|---|
| Runtime | Deno | .NET 9 |
| Language | TypeScript | C# |
| HTTP Framework | Hono | ASP.NET Core |
| Database ORM | Supabase JS | Entity Framework Core |
| Auth | Supabase Auth | ASP.NET Identity + JWT |
| File Storage | Supabase Storage | Azure Blob / S3 |
| Real-time | Supabase Realtime | SignalR |
| Background Jobs | Deno cron (15 min) | Hangfire |
| Email | Resend API | MailKit or Resend HTTP |
| Payments | Stripe (Deno) | Stripe.net |
| Deployment | Supabase Edge | Any: Azure / Railway / Fly.io / VPS |
