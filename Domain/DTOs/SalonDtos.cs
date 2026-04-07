using CRMKatia.Domain.Enums;

namespace CRMKatia.Domain.DTOs;

public class CreateSalonRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? Country { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}

public class UpdateSalonRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}

public class SalonDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Logo { get; set; }
    public string? Cover { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public SubscriptionPlan Plan { get; set; }
    public SubscriptionStatus SubscriptionStatus { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid OwnerId { get; set; }
}

public class SalonListResponse
{
    public List<SalonDto> Salons { get; set; } = [];
    public int TotalCount { get; set; }
}
