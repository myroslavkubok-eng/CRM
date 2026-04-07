namespace CRMKatia.Domain.Entities;

public class GiftCardUsage
{
    public Guid Id { get; set; }
    public decimal AmountUsed { get; set; }
    public decimal RemainingAfter { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public DateTime UsedAt { get; set; } = DateTime.UtcNow;
    public Guid GiftCardId { get; set; }
    public Guid? BookingId { get; set; }
    public Guid? CustomerId { get; set; }
    public GiftCard GiftCard { get; set; } = null!;
    public Booking? Booking { get; set; }
}
