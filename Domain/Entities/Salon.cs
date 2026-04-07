using CRMKatia.Domain.Enums;

namespace CRMKatia.Domain.Entities;

public class Salon
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Logo { get; set; }
    public string? Cover { get; set; }
    public List<string> Photos { get; set; } = [];
    public string? City { get; set; }
    public string? Country { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public SubscriptionPlan Plan { get; set; } = SubscriptionPlan.BasicStart;
    public BillingPeriod BillingPeriod { get; set; } = BillingPeriod.Monthly;
    public SubscriptionStatus SubscriptionStatus { get; set; } = SubscriptionStatus.Trial;
    public string? StripeCustomerId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public bool IsPublished { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // FK
    public Guid OwnerId { get; set; }

    // Navigation
    public User Owner { get; set; } = null!;
    public ICollection<Service> Services { get; set; } = [];
    public ICollection<Master> Masters { get; set; } = [];
    public ICollection<Booking> Bookings { get; set; } = [];
    public ICollection<GiftCard> GiftCards { get; set; } = [];
    public ICollection<FeedPost> FeedPosts { get; set; } = [];
    public DepositSettings? DepositSettings { get; set; }
}
