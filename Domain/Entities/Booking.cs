using CRMKatia.Domain.Enums;

namespace CRMKatia.Domain.Entities;

public class Booking
{
    public Guid Id { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public bool IsNewClient { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public DateTime? ConfirmedDateTime { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public bool ConfirmationRequired { get; set; } = true;
    public DateTime? ConfirmationDeadline { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public string CalendarSlotStatus { get; set; } = "temp_hold";
    public DateTime? TempHoldExpiresAt { get; set; }
    public DateTime? RescheduleRequestedAt { get; set; }
    public string? RescheduleRequestedBy { get; set; }
    public DateTime? RescheduleOriginalTime { get; set; }
    public DateTime? RescheduleNewTime { get; set; }
    public string? RescheduleReason { get; set; }
    public DateTime? RescheduleExpiresAt { get; set; }
    public string? DeclineReason { get; set; }
    public DateTime? DeclinedAt { get; set; }
    public string? DeclinedBy { get; set; }
    public string? CancellationReason { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancelledBy { get; set; }
    public DateTime? NoShowMarkedAt { get; set; }
    public decimal? NoShowPenalty { get; set; }
    public decimal? RefundAmount { get; set; }
    public string? Notes { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Guid SalonId { get; set; }
    public Guid? ClientId { get; set; }
    public Guid MasterId { get; set; }
    public Guid ServiceId { get; set; }
    public Salon Salon { get; set; } = null!;
    public Client? Client { get; set; }
    public Master Master { get; set; } = null!;
    public Service Service { get; set; } = null!;
    public BookingPayment? Payment { get; set; }
    public ICollection<BookingStatusHistory> StatusHistory { get; set; } = [];
}
