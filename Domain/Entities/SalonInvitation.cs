using CRMKatia.Domain.Enums;

namespace CRMKatia.Domain.Entities;

public class SalonInvitation
{
    public Guid Id { get; set; }
    public string Token { get; set; } = Guid.NewGuid().ToString("N");
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool Accepted { get; set; }
    public DateTime? AcceptedAt { get; set; }
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(7);
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid SalonId { get; set; }
    public Guid InvitedBy { get; set; }
    public Salon Salon { get; set; } = null!;
    public User Inviter { get; set; } = null!;
}
