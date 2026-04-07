using CRMKatia.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRMKatia.Infrastructure.Persistence.Configurations;

public class MasterConfiguration : IEntityTypeConfiguration<Master>
{
    public void Configure(EntityTypeBuilder<Master> builder)
    {
        builder.ToTable("masters");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.FirstName).IsRequired().HasMaxLength(100);
        builder.Property(m => m.LastName).IsRequired().HasMaxLength(100);
        builder.Property(m => m.Phone).IsRequired().HasMaxLength(50);
        builder.Property(m => m.Email).IsRequired().HasMaxLength(200);
        builder.Property(m => m.Avatar).HasMaxLength(500);
        builder.Property(m => m.BonusType).HasMaxLength(50);

        builder.Property(m => m.Role)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(m => m.WorkingHours)
            .HasColumnType("jsonb");

        builder.Property(m => m.DaysOff)
            .HasColumnType("jsonb");

        builder.Property(m => m.Vacations)
            .HasColumnType("jsonb");

        builder.Property(m => m.ExtraWorkDays)
            .HasColumnType("jsonb");

        builder.Property(m => m.Categories)
            .HasColumnType("jsonb");

        builder.Property(m => m.Rating).HasPrecision(3, 2);
        builder.Property(m => m.BaseSalary).HasPrecision(18, 2);
        builder.Property(m => m.MonthlyTarget).HasPrecision(18, 2);
        builder.Property(m => m.CurrentRevenue).HasPrecision(18, 2);
        builder.Property(m => m.BonusValue).HasPrecision(18, 2);
        builder.Property(m => m.Revenue).HasPrecision(18, 2);

        // Relationships
        builder.HasOne(m => m.User)
            .WithMany()
            .HasForeignKey(m => m.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        // Indexes
        builder.HasIndex(m => m.SalonId);
        builder.HasIndex(m => m.Email);
    }
}
