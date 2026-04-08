# CRMKatia — Project Analysis

> Generated: 2026-04-08  
> Branch: `aspnetcore-MarcoNunes`  
> Framework: ASP.NET Core 8.0 + Entity Framework Core 8.0 + PostgreSQL

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture](#3-architecture)
4. [Directory Structure](#4-directory-structure)
5. [Domain Model](#5-domain-model)
6. [Database & EF Core](#6-database--ef-core)
7. [Repository Pattern](#7-repository-pattern)
8. [Application Layer — CQRS](#8-application-layer--cqrs)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [API Controllers & Endpoints](#10-api-controllers--endpoints)
11. [Middleware](#11-middleware)
12. [Views & Frontend](#12-views--frontend)
13. [Configuration](#13-configuration)
14. [Key Business Flows](#14-key-business-flows)
15. [Deployment](#15-deployment)
16. [Feature Summary](#16-feature-summary)

---

## 1. Project Overview

**CRMKatia** is a multi-tenant SaaS CRM platform for salon and beauty businesses. It manages:

- Multiple salons, each with their own staff (Masters), services, and clients
- Complex booking workflows with confirmation deadlines, rescheduling, and cancellation
- Payment processing via Stripe (deposits, online payments, gift cards)
- Loyalty & referral programs, reviews, social feed, attendance tracking
- Role-based dashboards for SuperAdmin, Owner, Admin, Master, and Client

The project is a hybrid: a **RESTful JSON API** (for mobile/SPA clients) paired with **server-side Razor Views** for dashboard UIs.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Runtime | .NET 8.0 (`net8.0`) |
| Web Framework | ASP.NET Core 8.0 (MVC + API) |
| ORM | Entity Framework Core 8.0.8 |
| Database | PostgreSQL (via `Npgsql.EntityFrameworkCore.PostgreSQL`) |
| Identity | ASP.NET Core Identity + EF stores |
| Authentication | JWT Bearer (`System.IdentityModel.Tokens.Jwt 8.7.0`) |
| OAuth | Google (`Google.Apis.Auth v1.69.0`) + Apple |
| Payments | Stripe.net v47.0.0 |
| API Docs | Swashbuckle/Swagger v7.3.1 |
| DB Naming | EFCore.NamingConventions v8.0.0 (snake_case) |
| Views | Razor (.cshtml) |

**Project file:** `CRMKatia.csproj`

---

## 3. Architecture

The project uses a **layered architecture with Domain-Driven Design** principles, combined with the **CQRS pattern** for write operations.

```
┌────────────────────────────────────────────┐
│          Presentation Layer                │
│   Controllers (21) + Razor Views           │
├────────────────────────────────────────────┤
│          Application Layer                 │
│   Commands, Handlers (CQRS), Services      │
├────────────────────────────────────────────┤
│          Infrastructure Layer              │
│   Repositories, DbContext, Configurations  │
├────────────────────────────────────────────┤
│          Domain Layer                      │
│   Entities, Enums, Interfaces, DTOs        │
└────────────────────────────────────────────┘
```

**Key patterns:**
- **CQRS** — Write operations dispatched as commands to dedicated handlers
- **Repository Pattern** — Generic base + specialized repositories per aggregate
- **Dependency Injection** — Constructor injection throughout; scoped lifetime for DbContext
- **Global Exception Middleware** — Maps exception types to RFC 7807 ProblemDetails
- **Audit Trail** — `BookingStatusHistory` tracks every booking state transition

---

## 4. Directory Structure

```
CRMProject/
├── Domain/
│   ├── Entities/           # 25+ entity classes
│   ├── Enums/              # UserRole, BookingStatus, SubscriptionPlan, etc.
│   ├── Interfaces/         # IRepository<T> + 10 specialized interfaces
│   └── DTOs/               # Request/Response data transfer objects
├── Application/
│   ├── Commands/
│   │   ├── Interfaces/     # ICommand, ICommandHandler, ICommandDispatcher
│   │   ├── CommandDispatcher.cs
│   │   └── Handlers/       # 7 command handlers
│   └── Services/           # JwtTokenService
├── Infrastructure/
│   └── Persistence/
│       ├── DbContext/      # ApplicationDbContext
│       ├── Repositories/   # RepositoryBase<T> + specialized repos
│       ├── Configurations/ # IEntityTypeConfiguration per aggregate
│       └── Services/       # RoleSeeder, SalonSeeder
├── Controllers/            # 21 API controllers
├── Middleware/             # ExceptionHandlingMiddleware
├── Views/                  # Razor dashboards + feature panels
├── Migrations/             # EF Core migrations
├── Properties/
├── wwwroot/                # Static assets, compiled SPA, uploads
└── Program.cs              # Startup + DI wiring (~250 lines)
```

**Total C# source files:** ~118

---

## 5. Domain Model

### 5.1 Core Entities

#### User (`Domain/Entities/User.cs`)
- Inherits `IdentityUser<Guid>`
- Fields: `FirstName`, `LastName`, `Role` (UserRole enum), `Photo`, `CreatedAt`, `LastLogin`
- Computed: `FullName`
- Navigation: `OwnedSalons`, `ClientBookings`, `Notifications`, `SentInvitations`

#### Salon (`Domain/Entities/Salon.cs`)
- Core profile: Name, Description, Address, Phone, Email, City, Country, Latitude, Longitude, Logo, Cover
- Photos stored as **JSONB array**
- Subscription: `Plan` (BasicStart / StandardGrowth / BusinessPro), `BillingPeriod`, `SubscriptionStatus`
- Stripe: `StripeCustomerId`, `StripeSubscriptionId`
- Publishing: `IsPublished`, `PublishedAt`
- Navigation: Owner, Services, Masters, Bookings, GiftCards, FeedPosts, DepositSettings

#### Booking (`Domain/Entities/Booking.cs`) — complex state machine
| Group | Fields |
|---|---|
| Client | ClientName, ClientEmail, ClientPhone, IsNewClient |
| Time | StartTime, EndTime, ConfirmedDateTime, ConfirmationDeadline, ConfirmedAt |
| Status | BookingStatus enum (9 states) |
| Temp Hold | CalendarSlotStatus, TempHoldExpiresAt |
| Reschedule | RescheduleRequestedAt/By/Reason/ExpiresAt |
| Decline/Cancel | DeclineReason, DeclinedAt/By, CancellationReason, CancelledAt/By |
| No-Show | NoShowMarkedAt, NoShowPenalty |
| Relations | Salon, Client, Master, Service, Payment, StatusHistory |

#### Master (`Domain/Entities/Master.cs`) — employee profile
- Profile: FirstName, LastName, Phone, Email, Avatar
- Metrics: CompletedBookings, Rating, Revenue
- Compensation: BaseSalary, MonthlyTarget, BonusType, BonusValue
- Schedule (all **JSONB**): WorkingHours, DaysOff, Vacations, ExtraWorkDays, Categories

#### Other Entities

| Entity | Purpose |
|---|---|
| `Client` | Customer profile — TotalBookings, TotalSpent, LastVisit |
| `Service` | Salon service — Category, Price, Duration, Discount |
| `GiftCard` | Gift card with partial-use support and Stripe payment |
| `GiftCardUsage` | Usage history per redemption |
| `BookingPayment` | Deposit, online, and in-salon payment tracking |
| `Lead` | Sales prospect from marketing with email verification |
| `Review` | Star ratings (overall, service, cleanliness, value) |
| `LoyaltyProgram` + `LoyaltyPoint` | Points-based loyalty system |
| `ReferralProgram` + `Referral` | Referral tracking with rewards |
| `Attendance` | Master check-in/check-out with status |
| `Product` | Salon retail products (stock, SKU, cost) |
| `FeedPost` | Social content with likes/comments/shares |
| `Notification` | System alerts via multiple channels (JSONB) |
| `SalonInvitation` | Team invitation flow with token + expiry |
| `BookingStatusHistory` | Immutable audit log of booking transitions |
| `DepositSettings` | Salon-wide deposit/payment policy |
| `SupportMessage` | Customer support tickets with internal notes |
| `MasterService` | Many-to-many join (Master ↔ Service) |

### 5.2 Enums

| Enum | Values |
|---|---|
| `UserRole` | SuperAdmin, Owner, Admin, Master, Client |
| `BookingStatus` | Pending, Confirmed, RescheduledPending, DeclinedBySalon, CancelledByClient, CancelledBySalon, Completed, NoShow, Expired |
| `SubscriptionPlan` | BasicStart, StandardGrowth, BusinessPro |
| `BillingPeriod` | Monthly, SemiAnnual, Annual |
| `SubscriptionStatus` | Trial, Active, Expired, Cancelled |
| `GiftCardStatus` | Active, PartiallyUsed, FullyUsed, Expired, Cancelled |
| `DepositType` | None, Fixed, Percentage |

---

## 6. Database & EF Core

**DbContext:** `Infrastructure/Persistence/DbContext/ApplicationDbContext.cs`  
Inherits: `IdentityDbContext<User, IdentityRole<Guid>, Guid>`

**26 DbSets:** Salons, Services, Masters, MasterServices, Clients, Bookings, BookingStatusHistories, BookingPayments, DepositSettings, GiftCards, GiftCardUsages, Notifications, FeedPosts, SalonInvitations, Leads, SupportMessages, Products, Reviews, Attendances, LoyaltyPrograms, LoyaltyPoints, ReferralPrograms, Referrals, and Identity tables.

**Auto-timestamp:** `SaveChangesAsync()` is overridden to auto-update `UpdatedAt` on modified Salon, GiftCard, Booking, Product, Review, Attendance, LoyaltyProgram, ReferralProgram entities.

### Entity Configurations (`Infrastructure/Persistence/Configurations/`)

| File | Entities Configured |
|---|---|
| `SalonConfiguration.cs` | Salon — JSONB photos, enum-as-string, relationships |
| `BookingConfiguration.cs` | Booking — enum-as-string, decimal precision (18,2), covering indexes |
| `MasterConfiguration.cs` | Master — complex JSONB (WorkingHours, DaysOff, Vacations, ExtraWorkDays, Categories) |
| `GiftCardConfiguration.cs` | GiftCard — unique Code index, decimal precision |
| `AllOtherConfigurations.cs` | All remaining entities — see individual configs |

**Notable conventions:**
- All PKs are `Guid`
- All timestamps use `DateTime.UtcNow`
- Money fields use `precision(18, 2)`
- Snake_case via `EFCore.NamingConventions`
- JSONB for complex/flexible types
- Indexes on all FK columns + frequently filtered columns

**Migrations:**
- `20260407185833_InitialCreate`
- `20260408165627_AddNewEntities`
- Auto-applied on startup in Development / Docker (`ApplyMigrationsOnStartup: true`)

**Connection String:** `Host=db;Port=5432;Database=katia;Username=katia_user;Password=katia_user`

---

## 7. Repository Pattern

**Base interface:** `Domain/Interfaces/IRepository<T>`
```csharp
GetByIdAsync(Guid id)
GetAllAsync()
FindAsync(Func<T, bool> predicate)
AddAsync(T entity)
Update(T entity)
Remove(T entity)
SaveChangesAsync()
```

**Base implementation:** `Infrastructure/Persistence/Repositories/RepositoryBase<T>` — all methods `virtual` for override.

**Specialized repositories:**

| Repository | Key Methods |
|---|---|
| `BookingRepository` | `GetBySalonAsync`, `GetByMasterAsync`, `HasConflictAsync`, `GetExpiredPendingAsync` |
| `SalonRepository` | `GetByOwnerAsync`, `GetWithDetailsAsync` (deep eager load) |
| `ClientRepository` | `GetBySalonAsync`, `GetByEmailAndSalonAsync` |
| `MasterRepository` | `GetBySalonAsync`, `GetByUserIdAsync`, `GetWithServicesAsync` |
| + 7 more | GiftCard, Feed, Lead, Notification, SupportMessage, Invitation, StorageController |

**All repositories are registered in `Program.cs` (lines 70–95) with Scoped lifetime.**

---

## 8. Application Layer — CQRS

**Pattern:** Commands encapsulate write operations and are dispatched to typed handlers via `ICommandDispatcher`.

**Command infrastructure (`Application/Commands/Interfaces/`):**
- `ICommand<TResult>` — marker interface
- `ICommandHandler<TCommand, TResult>` — `HandleAsync(TCommand)` 
- `ICommandDispatcher` — `DispatchAsync<TResult>(ICommand<TResult>)`

**Dispatcher (`Application/Commands/CommandDispatcher.cs`):** Resolves handler from DI container using reflection and dynamic invocation.

**Registered handlers (7):**

| Command | Handler | Output |
|---|---|---|
| `RegisterUserCommand` | `RegisterUserHandler` | `AuthCommandResult` |
| `LoginUserCommand` | `LoginUserHandler` | `AuthCommandResult` |
| `GoogleAuthCommand` | `GoogleAuthHandler` | `AuthCommandResult` |
| `AppleAuthCommand` | `AppleAuthHandler` | `AuthCommandResult` |
| `CreateBookingCommand` | `CreateBookingHandler` | `CommandResult` |
| `UpdateBookingStatusCommand` | `UpdateBookingStatusHandler` | `CommandResult` |
| `CreateSalonCommand` | `CreateSalonHandler` | `CommandResult` |

**Auth handlers:** Validate credentials → assign role → generate JWT via `IJwtTokenService`.  
**Booking handler:** Checks master conflicts via `HasConflictAsync` → creates booking with `Pending` status → sets 2-hour confirmation deadline.

---

## 9. Authentication & Authorization

**Strategy:** JWT Bearer tokens + ASP.NET Core Identity

### Password Policy (`Program.cs` lines 31–40)
- Minimum length: 8 characters
- Requires digit, uppercase letter
- Does NOT require non-alphanumeric
- Unique emails required

### JWT Configuration (`Program.cs` lines 43–67)
- Algorithm: HmacSha256
- Issuer: `katia-api`, Audience: `katia-clients`
- Expiry: 60 minutes (default)
- Clock skew: 2 minutes
- Claims: `NameIdentifier` (UserId), `Email`, `Name` (FullName), `Role` (all roles)

**Token generation:** `Application/Services/JwtTokenService.cs` → `IJwtTokenService`

### Role System
- Roles seeded on startup: SuperAdmin, Owner, Admin, Master, Client
- Role-based `[Authorize(Roles = "...")]` on controller actions
- `[AllowAnonymous]` for public salon listing/profile

### OAuth
- **Google** — `GoogleAuthHandler` validates `IdToken` via `Google.Apis.Auth`
- **Apple** — `AppleAuthHandler` validates `IdToken`
- Both handlers create or update user, assign role, return JWT

### Test seed data (startup)
- User: `test@salon.com` / `TestOwner@123` — Role: Owner
- One test salon with services

---

## 10. API Controllers & Endpoints

**21 controllers** in `Controllers/`. All return JSON by default; some controllers also serve Razor views.

### Core Controllers

#### `AuthController`
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/auth/register` | Anonymous |
| POST | `/auth/login` | Anonymous |
| POST | `/auth/google` | Anonymous |
| POST | `/auth/apple` | Anonymous |
| GET | `/auth/me` | Required |
| GET | `/auth/debug/roles` | — |
| GET | `/auth/debug/users` | — |

#### `SalonsController`
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/salons` | Anonymous |
| GET | `/salons/{id}` | Anonymous |
| GET | `/salons/owner/{ownerId}` | Required |
| POST | `/salons` | Required |
| PUT | `/salons/{id}` | Required |
| PUT | `/salons/{id}/settings` | Required |
| PUT | `/salons/{id}/publish` | Required |
| DELETE | `/salons/{id}` | Required |

#### `BookingsController`
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/bookings/{id}` | — |
| GET | `/bookings/salon/{salonId}` | `?status=` filter |
| POST | `/bookings` | Dispatches CreateBookingCommand |
| PUT | `/bookings/{id}/status` | Dispatches UpdateBookingStatusCommand |
| DELETE | `/bookings/{id}` | — |

#### `ClientsController`
| Method | Endpoint |
|---|---|
| GET | `/clients/{id}` |
| GET | `/clients/salon/{salonId}` |
| GET | `/clients/search?salonId&query` |
| POST | `/clients` |
| PUT | `/clients/{id}` |
| DELETE | `/clients/{id}` |

### Additional Controllers (14)

| Controller | Domain |
|---|---|
| `MastersController` | Employee CRUD |
| `ServicesController` | Service CRUD |
| `ProductsController` | Retail product CRUD |
| `GiftCardsController` | Gift card lifecycle |
| `ReviewsController` | Reviews & ratings |
| `NotificationsController` | System notifications |
| `LeadsController` | Sales lead pipeline |
| `InvitationsController` | Team invitation flow |
| `FeedController` | Social feed posts |
| `LoyaltyController` | Loyalty program + points |
| `ReferralsController` | Referral program |
| `AttendanceController` | Staff attendance |
| `SupportMessagesController` | Support tickets |
| `AnalyticsController` | Reporting & analytics |
| `SalonRolesController` | Role management |
| `StorageController` | File/image uploads |
| `HomeController` | Landing page view |

**Response patterns:** DTOs + `ListResponse<T>` wrappers with `TotalCount`.

---

## 11. Middleware

**`ExceptionHandlingMiddleware`** (`Middleware/ExceptionHandlingMiddleware.cs`)

Registered as the outermost middleware. Maps exception types → HTTP status codes:

| Exception | Status Code |
|---|---|
| `ArgumentException` | 400 Bad Request |
| `KeyNotFoundException` | 404 Not Found |
| `UnauthorizedAccessException` | 401 Unauthorized |
| `InvalidOperationException` | 409 Conflict |
| Any other | 500 Internal Server Error |

Returns RFC 7807 **ProblemDetails** JSON. Logs all exceptions.

---

## 12. Views & Frontend

**Location:** `Views/`

### Dashboard Views (per role)
- `Views/Dashboard/SuperAdmin.cshtml`
- `Views/Dashboard/Owner.cshtml`
- `Views/Dashboard/Admin.cshtml`
- `Views/Dashboard/Master.cshtml`
- `Views/Dashboard/Client.cshtml`

### Feature Panel Partials (`_` prefix)
28 panel partials including: `_BookingSettingsPanel`, `_CalendarPanel`, `_ClientsPanel`, `_GiftCardPanel`, `_LoyaltyPanel`, `_MastersPanel`, `_PaymentPanel`, `_ProductsPanel`, `_SchedulePanel`, `_ServicesPanel`, `_SettingsPanel`, `_SubscriptionPanel`, `_SupportPanel`, `_AnalyticsPanel`, `_AIToolsPanel`, etc.

### Other Views
- `Views/Auth/Index.cshtml` — Login/Register UI
- `Views/Home/Index.cshtml` — Landing page
- `Views/Contact/Index.cshtml` — Contact form
- `Views/Admin/Leads.cshtml` — Lead management
- `Views/Admin/BecomePartner.cshtml` — Partnership signups
- `Views/Salon/` — Booking, Listing, Profile, Register

**Static assets:** `wwwroot/` (compiled SPA bundles, icons, uploads)

**SPA fallback:** `Program.cs` includes a fallback route to `index.html` for client-side routing.

---

## 13. Configuration

### `appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db;Port=5432;Database=katia;Username=katia_user;Password=katia_user"
  },
  "ApplyMigrationsOnStartup": true,
  "JwtSettings": {
    "SecretKey": "...",
    "Issuer": "katia-api",
    "Audience": "katia-clients",
    "ExpiryMinutes": 60
  },
  "Stripe": {
    "SecretKey": "sk_test_...",
    "PublishableKey": "pk_test_..."
  },
  "Authentication": {
    "Google": { "ClientId": "..." },
    "Apple":  { "ClientId": "..." }
  }
}
```

Environment-specific overrides: `appsettings.Development.json`, `appsettings.Docker.json`

### `Program.cs` startup steps (summary)

1. Add `ApplicationDbContext` with PostgreSQL + snake_case
2. Add Identity with password policy
3. Add JWT Bearer authentication
4. Register repositories (11 specialized + 14 generic)
5. Register services (JwtTokenService, HttpClient)
6. Register CommandDispatcher + 7 handlers
7. AddControllersWithViews + CORS (allow-all in dev)
8. Configure Swagger with Bearer security scheme
9. Auto-migrate + seed roles + seed test salon on startup
10. Middleware pipeline: exceptions → swagger → HTTPS → CORS → auth → static files → MVC routes → SPA fallback → health check

---

## 14. Key Business Flows

### Booking Lifecycle

```
CreateBookingCommand
  → HasConflictAsync() — check master availability
  → Create Booking (status: Pending)
  → Set ConfirmationDeadline = UtcNow + 2h
  → Add BookingStatusHistory entry
  → Save

Status transitions:
  Pending → Confirmed → Completed
  Pending → DeclinedBySalon
  Pending → CancelledByClient / CancelledBySalon
  Confirmed → RescheduledPending → Confirmed
  Confirmed → NoShow
  Pending (expired) → Expired
```

### Authentication Flow

```
RegisterUserCommand / LoginUserCommand
  → UserManager.CreateAsync / CheckPasswordAsync
  → UserManager.AddToRoleAsync
  → JwtTokenService.GenerateToken (claims: UserId, Email, Name, Roles)
  → Return AuthCommandResult { Success, Token, UserId }
```

### Salon Setup Flow

```
Owner registers → CreateSalonCommand
  → New Salon: plan=BasicStart, status=Trial
  → Add Services, Masters, DepositSettings
  → PUT /salons/{id}/publish → IsPublished = true
```

### Gift Card Flow

```
Purchase → Stripe PaymentIntent created
  → GiftCard created (status: Active, Code: unique)
  → Redemption tracked via GiftCardUsage
  → Status: Active → PartiallyUsed → FullyUsed / Expired
```

---

## 15. Deployment

### Docker
- `Dockerfile` — multi-stage build
- `docker-compose.yml` — app + PostgreSQL services
- Service name `db` resolves to PostgreSQL container
- `ApplyMigrationsOnStartup: true` in Docker config — migrations auto-applied on first run

### Health Check
- Endpoint: `GET /health`
- Configured via `AddHealthChecks()` in `Program.cs`

### Environments
- Development: Swagger UI enabled, migrations auto-applied
- Docker: `appsettings.Docker.json` overrides, migrations auto-applied
- Production: Set environment variables for secrets (JwtSettings:SecretKey, Stripe:SecretKey, etc.)

---

## 16. Feature Summary

| Feature | Status |
|---|---|
| Multi-tenant salon management | Implemented |
| Complex booking state machine | Implemented |
| Stripe payment processing | Integrated |
| Deposit management | Implemented |
| Gift cards (partial use, expiry) | Implemented |
| Loyalty program (points, redemption) | Implemented |
| Referral program | Implemented |
| Staff management + scheduling (JSONB) | Implemented |
| Attendance tracking | Implemented |
| Reviews & ratings | Implemented |
| Social feed | Implemented |
| Lead management | Implemented |
| Support tickets | Implemented |
| Retail products (inventory) | Implemented |
| Notifications (multi-channel) | Implemented |
| Analytics & reporting | Implemented |
| Local auth (JWT) | Implemented |
| Google OAuth | Integrated |
| Apple OAuth | Integrated |
| Multi-role authorization | Implemented |
| Role-based dashboards (Razor) | Implemented |
| Swagger / OpenAPI | Implemented |
| Docker support | Configured |
| Auto-migration on startup | Implemented |

---

*This document was generated by analyzing 118 C# source files across the project.*
