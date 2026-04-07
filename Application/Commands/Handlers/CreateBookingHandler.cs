using CRMKatia.Application.Commands.Interfaces;
using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using CRMKatia.Domain.Interfaces;

namespace CRMKatia.Application.Commands.Handlers;

public class CreateBookingCommand : ICommand<CommandResult>
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
    public string? CreatedBy { get; set; }
}

public class CommandResult
{
    public bool Success { get; set; }
    public Guid? BookingId { get; set; }
    public string Message { get; set; } = string.Empty;

    public static CommandResult Ok(Guid bookingId, string message = "Booking created successfully.")
        => new() { Success = true, BookingId = bookingId, Message = message };

    public static CommandResult Fail(string message)
        => new() { Success = false, Message = message };
}

public class CreateBookingHandler : ICommandHandler<CreateBookingCommand, CommandResult>
{
    private readonly IBookingRepository _bookingRepository;

    public CreateBookingHandler(IBookingRepository bookingRepository)
    {
        _bookingRepository = bookingRepository;
    }

    public async Task<CommandResult> HandleAsync(CreateBookingCommand command)
    {
        var hasConflict = await _bookingRepository.HasConflictAsync(
            command.MasterId, command.StartTime, command.EndTime);

        if (hasConflict)
            return CommandResult.Fail("The selected time slot conflicts with an existing booking.");

        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            SalonId = command.SalonId,
            MasterId = command.MasterId,
            ServiceId = command.ServiceId,
            ClientId = command.ClientId,
            ClientName = command.ClientName,
            ClientEmail = command.ClientEmail,
            ClientPhone = command.ClientPhone,
            IsNewClient = command.IsNewClient,
            StartTime = command.StartTime,
            EndTime = command.EndTime,
            Notes = command.Notes,
            CreatedBy = command.CreatedBy,
            Status = BookingStatus.Pending,
            ConfirmationRequired = true,
            ConfirmationDeadline = DateTime.UtcNow.AddHours(2),
            CalendarSlotStatus = "temp_hold",
            TempHoldExpiresAt = DateTime.UtcNow.AddHours(2),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        booking.StatusHistory.Add(new BookingStatusHistory
        {
            Id = Guid.NewGuid(),
            BookingId = booking.Id,
            Status = BookingStatus.Pending,
            ChangedBy = command.CreatedBy ?? "system",
            ActorId = command.ClientId ?? Guid.Empty,
            ActorName = command.ClientName,
            ChangedAt = DateTime.UtcNow,
            Notes = "Booking created"
        });

        await _bookingRepository.AddAsync(booking);
        await _bookingRepository.SaveChangesAsync();

        return CommandResult.Ok(booking.Id);
    }
}
