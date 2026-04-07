using CRMKatia.Domain.Enums;

namespace CRMKatia.Domain.DTOs;

public class CreateBookingRequest
{
    public Guid SalonId { get; set; }
    public Guid MasterId { get; set; }
    public Guid ServiceId { get; set; }
    public Guid? ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public bool IsNewClient { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string? Notes { get; set; }
}

public class UpdateBookingStatusRequest
{
    public BookingStatus NewStatus { get; set; }
    public string ChangedBy { get; set; } = string.Empty;
    public Guid ActorId { get; set; }
    public string ActorName { get; set; } = string.Empty;
    public string? Reason { get; set; }
}

public class BookingDto
{
    public Guid Id { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientEmail { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public bool IsNewClient { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public BookingStatus Status { get; set; }
    public DateTime? ConfirmationDeadline { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public string? Notes { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid SalonId { get; set; }
    public Guid? ClientId { get; set; }
    public Guid MasterId { get; set; }
    public Guid ServiceId { get; set; }
}

public class BookingListResponse
{
    public List<BookingDto> Bookings { get; set; } = [];
    public int TotalCount { get; set; }
}
