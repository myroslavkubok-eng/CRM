using CRMKatia.Application.Commands.Interfaces;
using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using CRMKatia.Domain.Interfaces;

namespace CRMKatia.Application.Commands.Handlers;

public class UpdateBookingStatusCommand : ICommand<CommandResult>
{
    public Guid BookingId { get; set; }
    public BookingStatus NewStatus { get; set; }
    public string ChangedBy { get; set; } = string.Empty;
    public Guid ActorId { get; set; }
    public string ActorName { get; set; } = string.Empty;
    public string? Reason { get; set; }
}

public class UpdateBookingStatusHandler : ICommandHandler<UpdateBookingStatusCommand, CommandResult>
{
    private readonly IBookingRepository _bookingRepository;

    public UpdateBookingStatusHandler(IBookingRepository bookingRepository)
    {
        _bookingRepository = bookingRepository;
    }

    public async Task<CommandResult> HandleAsync(UpdateBookingStatusCommand command)
    {
        var booking = await _bookingRepository.GetByIdAsync(command.BookingId);

        if (booking is null)
            return CommandResult.Fail("Booking not found.");

        var previousStatus = booking.Status;
        booking.Status = command.NewStatus;
        booking.UpdatedAt = DateTime.UtcNow;

        switch (command.NewStatus)
        {
            case BookingStatus.Confirmed:
                booking.ConfirmedAt = DateTime.UtcNow;
                booking.CalendarSlotStatus = "confirmed";
                break;
            case BookingStatus.CancelledByClient:
                booking.CancelledAt = DateTime.UtcNow;
                booking.CancelledBy = command.ChangedBy;
                booking.CancellationReason = command.Reason;
                break;
            case BookingStatus.CancelledBySalon:
                booking.CancelledAt = DateTime.UtcNow;
                booking.CancelledBy = command.ChangedBy;
                booking.CancellationReason = command.Reason;
                break;
            case BookingStatus.DeclinedBySalon:
                booking.DeclinedAt = DateTime.UtcNow;
                booking.DeclinedBy = command.ChangedBy;
                booking.DeclineReason = command.Reason;
                break;
            case BookingStatus.NoShow:
                booking.NoShowMarkedAt = DateTime.UtcNow;
                break;
        }

        booking.StatusHistory.Add(new BookingStatusHistory
        {
            Id = Guid.NewGuid(),
            BookingId = booking.Id,
            Status = command.NewStatus,
            ChangedBy = command.ChangedBy,
            ActorId = command.ActorId,
            ActorName = command.ActorName,
            ChangedAt = DateTime.UtcNow,
            Reason = command.Reason,
            Notes = $"Status changed from {previousStatus} to {command.NewStatus}"
        });

        _bookingRepository.Update(booking);
        await _bookingRepository.SaveChangesAsync();

        return CommandResult.Ok(booking.Id, $"Booking status updated to {command.NewStatus}.");
    }
}
