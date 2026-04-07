using CRMKatia.Domain.Enums;

namespace CRMKatia.Domain.Entities;

public class BookingStatusHistory
{
    public Guid Id { get; set; }
    public BookingStatus Status { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    public string ChangedBy { get; set; } = string.Empty;
    public Guid ActorId { get; set; }
    public string ActorName { get; set; } = string.Empty;
    public string? Reason { get; set; }
    public DateTime? PreviousTime { get; set; }
    public DateTime? NewTime { get; set; }
    public string? Notes { get; set; }
    public Guid BookingId { get; set; }
    public Booking Booking { get; set; } = null!;
}
