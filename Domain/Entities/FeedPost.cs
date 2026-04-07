namespace CRMKatia.Domain.Entities;

public class FeedPost
{
    public Guid Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? Caption { get; set; }
    public int Likes { get; set; }
    public int Comments { get; set; }
    public int Shares { get; set; }
    public bool IsService { get; set; }
    public string? ServiceName { get; set; }
    public string? ServiceCategory { get; set; }
    public decimal? OriginalPrice { get; set; }
    public decimal? Discount { get; set; }
    public string? Currency { get; set; }
    public bool IsLastMinute { get; set; }
    public bool IsPromoted { get; set; }
    public int? Duration { get; set; }
    public string? ServiceDescription { get; set; }
    public bool PublishedToMainFeed { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid SalonId { get; set; }
    public Guid? ServiceId { get; set; }
    public Salon Salon { get; set; } = null!;
    public Service? Service { get; set; }
}
