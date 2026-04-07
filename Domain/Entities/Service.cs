namespace CRMKatia.Domain.Entities;

public class Service
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Duration { get; set; }
    public string? Description { get; set; }
    public decimal? Discount { get; set; }
    public string? ImageUrl { get; set; }
    public Guid SalonId { get; set; }
    public Salon Salon { get; set; } = null!;
    public ICollection<MasterService> MasterServices { get; set; } = [];
    public ICollection<Booking> Bookings { get; set; } = [];
}
