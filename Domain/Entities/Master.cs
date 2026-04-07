using CRMKatia.Domain.Enums;

namespace CRMKatia.Domain.Entities;

public class Master
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public UserRole Role { get; set; } = UserRole.Master;
    public List<string> Categories { get; set; } = [];
    public List<WorkingHours> WorkingHours { get; set; } = [];
    public List<string> DaysOff { get; set; } = [];
    public List<Vacation> Vacations { get; set; } = [];
    public List<ExtraWorkDay> ExtraWorkDays { get; set; } = [];
    public decimal? Rating { get; set; }
    public int CompletedBookings { get; set; }
    public decimal Revenue { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal MonthlyTarget { get; set; }
    public decimal CurrentRevenue { get; set; }
    public string BonusType { get; set; } = "percentage";
    public decimal BonusValue { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid SalonId { get; set; }
    public Guid? UserId { get; set; }
    public Salon Salon { get; set; } = null!;
    public User? User { get; set; }
    public ICollection<MasterService> MasterServices { get; set; } = [];
    public ICollection<Booking> Bookings { get; set; } = [];
}

public class WorkingHours
{
    public string Day { get; set; } = string.Empty;
    public bool IsWorking { get; set; }
    public string StartTime { get; set; } = "09:00";
    public string EndTime { get; set; } = "18:00";
}

public class Vacation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Reason { get; set; }
}

public class ExtraWorkDay
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime Date { get; set; }
    public string StartTime { get; set; } = "09:00";
    public string EndTime { get; set; } = "18:00";
}
