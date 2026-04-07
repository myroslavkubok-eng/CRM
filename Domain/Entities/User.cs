using CRMKatia.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace CRMKatia.Domain.Entities;

public class User : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string? Photo { get; set; }
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLogin { get; set; }

    // Navigation
    public ICollection<Salon> OwnedSalons { get; set; } = [];
    public ICollection<Booking> ClientBookings { get; set; } = [];
    public ICollection<Notification> Notifications { get; set; } = [];
    public ICollection<SalonInvitation> SentInvitations { get; set; } = [];

    // Computed
    public string FullName => $"{FirstName} {LastName}".Trim();
}
