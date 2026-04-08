using CRMKatia.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;

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
            .HasColumnType("jsonb")
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<WorkingHours>>(v, (JsonSerializerOptions?)null) ?? new List<WorkingHours>()
            )
            .Metadata.SetValueComparer(
                new ValueComparer<List<WorkingHours>>(
                    (c1, c2) => JsonSerializer.Serialize(c1, (JsonSerializerOptions?)null) == JsonSerializer.Serialize(c2, (JsonSerializerOptions?)null),
                    c => c == null ? 0 : JsonSerializer.Serialize(c, (JsonSerializerOptions?)null).GetHashCode(),
                    c => c == null ? new List<WorkingHours>() : JsonSerializer.Deserialize<List<WorkingHours>>(JsonSerializer.Serialize(c, (JsonSerializerOptions?)null), (JsonSerializerOptions?)null) ?? new List<WorkingHours>()
                )
            );

        builder.Property(m => m.DaysOff)
            .HasColumnType("jsonb")
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
            )
            .Metadata.SetValueComparer(
                new ValueComparer<List<string>>(
                    (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
                    c => c == null ? 0 : c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c == null ? new List<string>() : c.ToList()
                )
            );

        builder.Property(m => m.Vacations)
            .HasColumnType("jsonb")
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<Vacation>>(v, (JsonSerializerOptions?)null) ?? new List<Vacation>()
            )
            .Metadata.SetValueComparer(
                new ValueComparer<List<Vacation>>(
                    (c1, c2) => JsonSerializer.Serialize(c1, (JsonSerializerOptions?)null) == JsonSerializer.Serialize(c2, (JsonSerializerOptions?)null),
                    c => c == null ? 0 : JsonSerializer.Serialize(c, (JsonSerializerOptions?)null).GetHashCode(),
                    c => c == null ? new List<Vacation>() : JsonSerializer.Deserialize<List<Vacation>>(JsonSerializer.Serialize(c, (JsonSerializerOptions?)null), (JsonSerializerOptions?)null) ?? new List<Vacation>()
                )
            );

        builder.Property(m => m.ExtraWorkDays)
            .HasColumnType("jsonb")
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<ExtraWorkDay>>(v, (JsonSerializerOptions?)null) ?? new List<ExtraWorkDay>()
            )
            .Metadata.SetValueComparer(
                new ValueComparer<List<ExtraWorkDay>>(
                    (c1, c2) => JsonSerializer.Serialize(c1, (JsonSerializerOptions?)null) == JsonSerializer.Serialize(c2, (JsonSerializerOptions?)null),
                    c => c == null ? 0 : JsonSerializer.Serialize(c, (JsonSerializerOptions?)null).GetHashCode(),
                    c => c == null ? new List<ExtraWorkDay>() : JsonSerializer.Deserialize<List<ExtraWorkDay>>(JsonSerializer.Serialize(c, (JsonSerializerOptions?)null), (JsonSerializerOptions?)null) ?? new List<ExtraWorkDay>()
                )
            );

        builder.Property(m => m.Categories)
            .HasColumnType("jsonb")
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
            )
            .Metadata.SetValueComparer(
                new ValueComparer<List<string>>(
                    (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
                    c => c == null ? 0 : c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c == null ? new List<string>() : c.ToList()
                )
            );

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
