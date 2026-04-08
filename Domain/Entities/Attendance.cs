namespace CRMKatia.Domain.Entities;

public class Attendance
{
    public Guid Id { get; set; }
    public Guid MasterId { get; set; }
    public Guid SalonId { get; set; }
    public DateTime Date { get; set; }
    public DateTime? CheckIn { get; set; }
    public DateTime? CheckOut { get; set; }
    public string Status { get; set; } = "pending"; // pending, present, late, absent, leave
    public string? Notes { get; set; }
    public TimeSpan? WorkingHours { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public Master Master { get; set; } = null!;
    public Salon Salon { get; set; } = null!;
}

public class CreateAttendanceRequest
{
    public Guid MasterId { get; set; }
    public Guid SalonId { get; set; }
    public DateTime Date { get; set; }
    public DateTime? CheckIn { get; set; }
    public DateTime? CheckOut { get; set; }
    public string Status { get; set; } = "pending";
    public string? Notes { get; set; }
}

public class UpdateAttendanceRequest
{
    public DateTime? CheckIn { get; set; }
    public DateTime? CheckOut { get; set; }
    public string? Status { get; set; }
    public string? Notes { get; set; }
}