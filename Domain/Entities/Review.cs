namespace CRMKatia.Domain.Entities;

public class Review
{
    public Guid Id { get; set; }
    public Guid SalonId { get; set; }
    public Guid? ClientId { get; set; }
    public Guid? MasterId { get; set; }
    public Guid? BookingId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Comment { get; set; }
    public int Rating { get; set; }
    public int? ServiceRating { get; set; }
    public int? CleanlinessRating { get; set; }
    public int? ValueRating { get; set; }
    public bool IsPublic { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public Salon Salon { get; set; } = null!;
    public Client? Client { get; set; }
    public Master? Master { get; set; }
    public Booking? Booking { get; set; }
}

public class CreateReviewRequest
{
    public Guid SalonId { get; set; }
    public Guid? ClientId { get; set; }
    public Guid? MasterId { get; set; }
    public Guid? BookingId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Comment { get; set; }
    public int Rating { get; set; }
    public int? ServiceRating { get; set; }
    public int? CleanlinessRating { get; set; }
    public int? ValueRating { get; set; }
    public bool IsPublic { get; set; } = true;
}

public class UpdateReviewRequest
{
    public string? Title { get; set; }
    public string? Comment { get; set; }
    public int? Rating { get; set; }
    public int? ServiceRating { get; set; }
    public int? CleanlinessRating { get; set; }
    public int? ValueRating { get; set; }
    public bool? IsPublic { get; set; }
}