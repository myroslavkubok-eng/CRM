namespace CRMKatia.Domain.Entities;

public class BookingPayment
{
    public Guid Id { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DepositAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal RemainingAmount { get; set; }
    public string PaymentOption { get; set; } = "in-salon";
    public string PaymentStatus { get; set; } = "pending";
    public string? PaymentIntentId { get; set; }
    public string? ChargeId { get; set; }
    public string? RefundId { get; set; }
    public bool Cancelled { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancelReason { get; set; }
    public decimal? RefundAmount { get; set; }
    public bool NoShow { get; set; }
    public DateTime? NoShowAt { get; set; }
    public decimal? PenaltyAmount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PaidAt { get; set; }
    public DateTime? FullyPaidAt { get; set; }
    public Guid BookingId { get; set; }
    public Booking Booking { get; set; } = null!;
}
