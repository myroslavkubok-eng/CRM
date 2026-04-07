using CRMKatia.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRMKatia.Infrastructure.Persistence.Configurations;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.ToTable("bookings");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.ClientName).IsRequired().HasMaxLength(200);
        builder.Property(b => b.ClientEmail).IsRequired().HasMaxLength(200);
        builder.Property(b => b.ClientPhone).IsRequired().HasMaxLength(50);
        builder.Property(b => b.CalendarSlotStatus).HasMaxLength(50);
        builder.Property(b => b.RescheduleRequestedBy).HasMaxLength(100);
        builder.Property(b => b.RescheduleReason).HasMaxLength(500);
        builder.Property(b => b.DeclineReason).HasMaxLength(500);
        builder.Property(b => b.DeclinedBy).HasMaxLength(100);
        builder.Property(b => b.CancellationReason).HasMaxLength(500);
        builder.Property(b => b.CancelledBy).HasMaxLength(100);
        builder.Property(b => b.CreatedBy).HasMaxLength(100);

        builder.Property(b => b.Status)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(b => b.NoShowPenalty)
            .HasPrecision(18, 2);

        builder.Property(b => b.RefundAmount)
            .HasPrecision(18, 2);

        // Relationships
        builder.HasOne(b => b.Payment)
            .WithOne(p => p.Booking)
            .HasForeignKey<BookingPayment>(p => p.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(b => b.StatusHistory)
            .WithOne(h => h.Booking)
            .HasForeignKey(h => h.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(b => b.Master)
            .WithMany(m => m.Bookings)
            .HasForeignKey(b => b.MasterId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.Service)
            .WithMany(s => s.Bookings)
            .HasForeignKey(b => b.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.Salon)
            .WithMany(s => s.Bookings)
            .HasForeignKey(b => b.SalonId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(b => new { b.SalonId, b.Status });
        builder.HasIndex(b => new { b.MasterId, b.StartTime });
        builder.HasIndex(b => b.StartTime);
        builder.HasIndex(b => b.ConfirmationDeadline);
    }
}
