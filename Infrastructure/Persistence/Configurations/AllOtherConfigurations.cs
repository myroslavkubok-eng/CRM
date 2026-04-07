using CRMKatia.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRMKatia.Infrastructure.Persistence.Configurations;

public class ServiceConfiguration : IEntityTypeConfiguration<Service>
{
    public void Configure(EntityTypeBuilder<Service> builder)
    {
        builder.ToTable("services");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Name).IsRequired().HasMaxLength(200);
        builder.Property(s => s.Category).IsRequired().HasMaxLength(100);
        builder.Property(s => s.ImageUrl).HasMaxLength(500);

        builder.Property(s => s.Price).HasPrecision(18, 2);
        builder.Property(s => s.Discount).HasPrecision(18, 2);
    }
}

public class MasterServiceConfiguration : IEntityTypeConfiguration<MasterService>
{
    public void Configure(EntityTypeBuilder<MasterService> builder)
    {
        builder.ToTable("master_services");

        builder.HasKey(ms => new { ms.MasterId, ms.ServiceId });

        builder.HasOne(ms => ms.Master)
            .WithMany(m => m.MasterServices)
            .HasForeignKey(ms => ms.MasterId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ms => ms.Service)
            .WithMany(s => s.MasterServices)
            .HasForeignKey(ms => ms.ServiceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class ClientConfiguration : IEntityTypeConfiguration<Client>
{
    public void Configure(EntityTypeBuilder<Client> builder)
    {
        builder.ToTable("clients");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.FirstName).IsRequired().HasMaxLength(100);
        builder.Property(c => c.LastName).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Email).IsRequired().HasMaxLength(200);
        builder.Property(c => c.Phone).IsRequired().HasMaxLength(50);

        builder.Property(c => c.TotalSpent).HasPrecision(18, 2);

        builder.HasMany(c => c.Bookings)
            .WithOne(b => b.Client)
            .HasForeignKey(b => b.ClientId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class BookingStatusHistoryConfiguration : IEntityTypeConfiguration<BookingStatusHistory>
{
    public void Configure(EntityTypeBuilder<BookingStatusHistory> builder)
    {
        builder.ToTable("booking_status_history");

        builder.HasKey(h => h.Id);

        builder.Property(h => h.ChangedBy).IsRequired().HasMaxLength(100);
        builder.Property(h => h.ActorName).IsRequired().HasMaxLength(200);
        builder.Property(h => h.Reason).HasMaxLength(500);
        builder.Property(h => h.Notes).HasMaxLength(1000);

        builder.Property(h => h.Status)
            .HasConversion<string>()
            .HasMaxLength(50);
    }
}

public class BookingPaymentConfiguration : IEntityTypeConfiguration<BookingPayment>
{
    public void Configure(EntityTypeBuilder<BookingPayment> builder)
    {
        builder.ToTable("booking_payments");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.PaymentOption).HasMaxLength(50);
        builder.Property(p => p.PaymentStatus).HasMaxLength(50);
        builder.Property(p => p.PaymentIntentId).HasMaxLength(200);
        builder.Property(p => p.ChargeId).HasMaxLength(200);
        builder.Property(p => p.RefundId).HasMaxLength(200);
        builder.Property(p => p.CancelReason).HasMaxLength(500);

        builder.Property(p => p.TotalAmount).HasPrecision(18, 2);
        builder.Property(p => p.DepositAmount).HasPrecision(18, 2);
        builder.Property(p => p.PaidAmount).HasPrecision(18, 2);
        builder.Property(p => p.RemainingAmount).HasPrecision(18, 2);
        builder.Property(p => p.RefundAmount).HasPrecision(18, 2);
        builder.Property(p => p.PenaltyAmount).HasPrecision(18, 2);
    }
}

public class DepositSettingsConfiguration : IEntityTypeConfiguration<DepositSettings>
{
    public void Configure(EntityTypeBuilder<DepositSettings> builder)
    {
        builder.ToTable("deposit_settings");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.StripeAccountId).HasMaxLength(200);
        builder.Property(d => d.CustomMessage).HasMaxLength(1000);

        builder.Property(d => d.DepositType)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(d => d.FixedAmount).HasPrecision(18, 2);
        builder.Property(d => d.PercentageAmount).HasPrecision(5, 2);
        builder.Property(d => d.MinDepositAmount).HasPrecision(18, 2);
        builder.Property(d => d.MaxDepositAmount).HasPrecision(18, 2);
        builder.Property(d => d.PartialRefundPercent).HasPrecision(5, 2);
        builder.Property(d => d.NoShowPenalty).HasPrecision(18, 2);
        builder.Property(d => d.PlatformFeePercent).HasPrecision(5, 2);

        builder.Property(d => d.ReminderHoursBefore)
            .HasColumnType("jsonb");

        builder.HasIndex(d => d.SalonId).IsUnique();
    }
}

public class GiftCardUsageConfiguration : IEntityTypeConfiguration<GiftCardUsage>
{
    public void Configure(EntityTypeBuilder<GiftCardUsage> builder)
    {
        builder.ToTable("gift_card_usages");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.ServiceName).IsRequired().HasMaxLength(200);
        builder.Property(u => u.CustomerName).IsRequired().HasMaxLength(200);

        builder.Property(u => u.AmountUsed).HasPrecision(18, 2);
        builder.Property(u => u.RemainingAfter).HasPrecision(18, 2);

        builder.HasOne(u => u.Booking)
            .WithMany()
            .HasForeignKey(u => u.BookingId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("notifications");

        builder.HasKey(n => n.Id);

        builder.Property(n => n.Type).IsRequired().HasMaxLength(100);
        builder.Property(n => n.Title).IsRequired().HasMaxLength(200);
        builder.Property(n => n.Message).IsRequired().HasMaxLength(2000);
        builder.Property(n => n.ActionUrl).HasMaxLength(500);
        builder.Property(n => n.RecipientType).IsRequired().HasMaxLength(50);
        builder.Property(n => n.Priority).HasMaxLength(20);

        builder.Property(n => n.Channels)
            .HasColumnType("jsonb");

        builder.HasOne(n => n.Recipient)
            .WithMany(u => u.Notifications)
            .HasForeignKey(n => n.RecipientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(n => n.Booking)
            .WithMany()
            .HasForeignKey(n => n.BookingId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class FeedPostConfiguration : IEntityTypeConfiguration<FeedPost>
{
    public void Configure(EntityTypeBuilder<FeedPost> builder)
    {
        builder.ToTable("feed_posts");

        builder.HasKey(f => f.Id);

        builder.Property(f => f.ImageUrl).IsRequired().HasMaxLength(500);
        builder.Property(f => f.ServiceName).HasMaxLength(200);
        builder.Property(f => f.ServiceCategory).HasMaxLength(100);
        builder.Property(f => f.Currency).HasMaxLength(10);

        builder.Property(f => f.OriginalPrice).HasPrecision(18, 2);
        builder.Property(f => f.Discount).HasPrecision(18, 2);

        builder.HasOne(f => f.Salon)
            .WithMany(s => s.FeedPosts)
            .HasForeignKey(f => f.SalonId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(f => f.Service)
            .WithMany()
            .HasForeignKey(f => f.ServiceId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class SalonInvitationConfiguration : IEntityTypeConfiguration<SalonInvitation>
{
    public void Configure(EntityTypeBuilder<SalonInvitation> builder)
    {
        builder.ToTable("salon_invitations");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.Token).IsRequired().HasMaxLength(100);
        builder.Property(i => i.Email).IsRequired().HasMaxLength(200);

        builder.Property(i => i.Role)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.HasIndex(i => i.Token).IsUnique();

        builder.HasOne(i => i.Salon)
            .WithMany()
            .HasForeignKey(i => i.SalonId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Inviter)
            .WithMany(u => u.SentInvitations)
            .HasForeignKey(i => i.InvitedBy)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
