namespace CRMKatia.Domain.Entities;

public class ReferralProgram
{
    public Guid Id { get; set; }
    public Guid SalonId { get; set; }
    public bool IsEnabled { get; set; } = true;
    public decimal ReferrerReward { get; set; } = 25;
    public decimal RefereeReward { get; set; } = 15;
    public decimal MinimumPurchaseForReward { get; set; } = 50;
    public int MaxReferralsPerClient { get; set; } = 10;
    public int RewardExpiryDays { get; set; } = 90;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public Salon Salon { get; set; } = null!;
    public ICollection<Referral> Referrals { get; set; } = [];
}

public class Referral
{
    public Guid Id { get; set; }
    public Guid SalonId { get; set; }
    public Guid ReferrerId { get; set; } // Client who referred
    public Guid RefereeId { get; set; } // New client who was referred
    public decimal ReferrerReward { get; set; }
    public decimal RefereeReward { get; set; }
    public bool IsReferrerRewardClaimed { get; set; }
    public bool IsRefereeRewardClaimed { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Salon Salon { get; set; } = null!;
    public Client Referrer { get; set; } = null!;
    public Client Referee { get; set; } = null!;
}

public class ReferralSettingsRequest
{
    public bool IsEnabled { get; set; }
    public decimal ReferrerReward { get; set; }
    public decimal RefereeReward { get; set; }
    public decimal MinimumPurchaseForReward { get; set; }
    public int MaxReferralsPerClient { get; set; }
    public int RewardExpiryDays { get; set; }
}