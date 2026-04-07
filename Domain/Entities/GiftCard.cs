using CRMKatia.Domain.Enums;

namespace CRMKatia.Domain.Entities;

public class GiftCard
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "AED";
    public decimal RemainingBalance { get; set; }
    public string PurchaserName { get; set; } = string.Empty;
    public string PurchaserEmail { get; set; } = string.Empty;
    public Guid? PurchaserUserId { get; set; }
    public string RecipientName { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
    public string? PersonalMessage { get; set; }
    public string DeliveryMethod { get; set; } = "email";
    public string Theme { get; set; } = "birthday";
    public GiftCardStatus Status { get; set; } = GiftCardStatus.Active;
    public string? PaymentIntentId { get; set; }
    public string? StripeChargeId { get; set; }
    public bool AllowPartialUse { get; set; } = true;
    public bool AllowMultipleServices { get; set; } = true;
    public DateTime? ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastUsedAt { get; set; }
    public Guid SalonId { get; set; }
    public Salon Salon { get; set; } = null!;
    public ICollection<GiftCardUsage> UsageHistory { get; set; } = [];
}
