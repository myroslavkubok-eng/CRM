namespace CRMKatia.Domain.Entities;

public class Client
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public int TotalBookings { get; set; }
    public decimal TotalSpent { get; set; }
    public DateTime? LastVisit { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid SalonId { get; set; }
    public Guid? UserId { get; set; }
    public Salon Salon { get; set; } = null!;
    public User? User { get; set; }
    public ICollection<Booking> Bookings { get; set; } = [];
}
