using CRMKatia.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRMKatia.Infrastructure.Persistence.Configurations;

public class GiftCardConfiguration : IEntityTypeConfiguration<GiftCard>
{
    public void Configure(EntityTypeBuilder<GiftCard> builder)
    {
        builder.ToTable("gift_cards");

        builder.HasKey(g => g.Id);

        builder.Property(g => g.Code).IsRequired().HasMaxLength(100);
        builder.Property(g => g.Currency).HasMaxLength(10);
        builder.Property(g => g.PurchaserName).IsRequired().HasMaxLength(200);
        builder.Property(g => g.PurchaserEmail).IsRequired().HasMaxLength(200);
        builder.Property(g => g.RecipientName).IsRequired().HasMaxLength(200);
        builder.Property(g => g.RecipientEmail).IsRequired().HasMaxLength(200);
        builder.Property(g => g.DeliveryMethod).HasMaxLength(50);
        builder.Property(g => g.Theme).HasMaxLength(50);
        builder.Property(g => g.PaymentIntentId).HasMaxLength(200);
        builder.Property(g => g.StripeChargeId).HasMaxLength(200);

        builder.Property(g => g.Amount).HasPrecision(18, 2);
        builder.Property(g => g.RemainingBalance).HasPrecision(18, 2);

        builder.Property(g => g.Status)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.HasIndex(g => g.Code).IsUnique();

        // Relationships
        builder.HasOne(g => g.Salon)
            .WithMany(s => s.GiftCards)
            .HasForeignKey(g => g.SalonId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(g => g.UsageHistory)
            .WithOne(u => u.GiftCard)
            .HasForeignKey(u => u.GiftCardId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
