namespace CRMKatia.Domain.Entities;

public class LoyaltyProgram
{
    public Guid Id { get; set; }
    public Guid SalonId { get; set; }
    public bool IsEnabled { get; set; } = true;
    public int PointsPerDollar { get; set; } = 10;
    public int PointsToRedeemDollar { get; set; } = 100;
    public int BonusPointsOnSignup { get; set; } = 50;
    public int PointsExpiryMonths { get; set; } = 12;
    public int MinimumPointsToRedeem { get; set; } = 500;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public Salon Salon { get; set; } = null!;
    public ICollection<LoyaltyPoint> LoyaltyPoints { get; set; } = [];
}

public class LoyaltyPoint
{
    public Guid Id { get; set; }
    public Guid ClientId { get; set; }
    public Guid SalonId { get; set; }
    public int Points { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Type { get; set; } = "earned"; // earned, redeemed, bonus, expired
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Client Client { get; set; } = null!;
    public Salon Salon { get; set; } = null!;
}

public class LoyaltySettingsRequest
{
    public bool IsEnabled { get; set; }
    public int PointsPerDollar { get; set; }
    public int PointsToRedeemDollar { get; set; }
    public int BonusPointsOnSignup { get; set; }
    public int PointsExpiryMonths { get; set; }
    public int MinimumPointsToRedeem { get; set; }
}