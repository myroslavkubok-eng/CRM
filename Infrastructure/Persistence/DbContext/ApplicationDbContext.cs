using CRMKatia.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CRMKatia.Infrastructure.Persistence.DbContext;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Salon> Salons => Set<Salon>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Master> Masters => Set<Master>();
    public DbSet<MasterService> MasterServices => Set<MasterService>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<BookingStatusHistory> BookingStatusHistories => Set<BookingStatusHistory>();
    public DbSet<BookingPayment> BookingPayments => Set<BookingPayment>();
    public DbSet<DepositSettings> DepositSettings => Set<DepositSettings>();
    public DbSet<GiftCard> GiftCards => Set<GiftCard>();
    public DbSet<GiftCardUsage> GiftCardUsages => Set<GiftCardUsage>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<FeedPost> FeedPosts => Set<FeedPost>();
    public DbSet<SalonInvitation> SalonInvitations => Set<SalonInvitation>();
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<SupportMessage> SupportMessages => Set<SupportMessage>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Attendance> Attendances => Set<Attendance>();
    public DbSet<LoyaltyProgram> LoyaltyPrograms => Set<LoyaltyProgram>();
    public DbSet<LoyaltyPoint> LoyaltyPoints => Set<LoyaltyPoint>();
    public DbSet<ReferralProgram> ReferralPrograms => Set<ReferralProgram>();
    public DbSet<Referral> Referrals => Set<Referral>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<Salon>()
                     .Where(e => e.State == EntityState.Modified))
        {
            entry.Entity.UpdatedAt = now;
        }

        foreach (var entry in ChangeTracker.Entries<GiftCard>()
                     .Where(e => e.State == EntityState.Modified))
        {
            entry.Entity.UpdatedAt = now;
        }

        foreach (var entry in ChangeTracker.Entries<Booking>()
                     .Where(e => e.State == EntityState.Modified))
        {
            entry.Entity.UpdatedAt = now;
        }

        foreach (var entry in ChangeTracker.Entries<Product>()
                     .Where(e => e.State == EntityState.Modified))
        {
            entry.Entity.UpdatedAt = now;
        }

        foreach (var entry in ChangeTracker.Entries<Review>()
                     .Where(e => e.State == EntityState.Modified))
        {
            entry.Entity.UpdatedAt = now;
        }

        foreach (var entry in ChangeTracker.Entries<Attendance>()
                     .Where(e => e.State == EntityState.Modified))
        {
            entry.Entity.UpdatedAt = now;
        }

        foreach (var entry in ChangeTracker.Entries<LoyaltyProgram>()
                     .Where(e => e.State == EntityState.Modified))
        {
            entry.Entity.UpdatedAt = now;
        }

        foreach (var entry in ChangeTracker.Entries<ReferralProgram>()
                     .Where(e => e.State == EntityState.Modified))
        {
            entry.Entity.UpdatedAt = now;
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
