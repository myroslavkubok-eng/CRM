namespace CRMKatia.Domain.Entities;

public class Notification
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? ActionUrl { get; set; }
    public string RecipientType { get; set; } = string.Empty;
    public string Priority { get; set; } = "medium";
    public bool Read { get; set; }
    public DateTime? ReadAt { get; set; }
    public bool Dismissed { get; set; }
    public List<string> Channels { get; set; } = ["app"];
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public Guid RecipientId { get; set; }
    public Guid? BookingId { get; set; }
    public Guid? SalonId { get; set; }
    public User Recipient { get; set; } = null!;
    public Booking? Booking { get; set; }
}
