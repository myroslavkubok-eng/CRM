using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRMKatia.Infrastructure.Persistence.Configurations;

public class SalonConfiguration : IEntityTypeConfiguration<Salon>
{
    public void Configure(EntityTypeBuilder<Salon> builder)
    {
        builder.ToTable("salons");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Name).IsRequired().HasMaxLength(200);
        builder.Property(s => s.Address).IsRequired().HasMaxLength(500);
        builder.Property(s => s.Phone).IsRequired().HasMaxLength(50);
        builder.Property(s => s.Email).IsRequired().HasMaxLength(200);
        builder.Property(s => s.Logo).HasMaxLength(500);
        builder.Property(s => s.Cover).HasMaxLength(500);
        builder.Property(s => s.City).HasMaxLength(100);
        builder.Property(s => s.Country).HasMaxLength(100);
        builder.Property(s => s.StripeCustomerId).HasMaxLength(200);
        builder.Property(s => s.StripeSubscriptionId).HasMaxLength(200);

        builder.Property(s => s.Photos)
            .HasColumnType("jsonb");

        builder.Property(s => s.Plan)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(s => s.BillingPeriod)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(s => s.SubscriptionStatus)
            .HasConversion<string>()
            .HasMaxLength(50);

        // Relationships
        builder.HasOne(s => s.Owner)
            .WithMany(u => u.OwnedSalons)
            .HasForeignKey(s => s.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(s => s.Services)
            .WithOne(svc => svc.Salon)
            .HasForeignKey(svc => svc.SalonId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(s => s.Masters)
            .WithOne(m => m.Salon)
            .HasForeignKey(m => m.SalonId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(s => s.DepositSettings)
            .WithOne(d => d.Salon)
            .HasForeignKey<DepositSettings>(d => d.SalonId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(s => s.OwnerId);
        builder.HasIndex(s => s.IsPublished);
    }
}
