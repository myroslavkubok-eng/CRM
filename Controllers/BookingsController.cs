using CRMKatia.Application.Commands.Handlers;
using CRMKatia.Application.Commands.Interfaces;
using CRMKatia.Domain.DTOs;
using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("bookings")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly ICommandDispatcher _commandDispatcher;
    private readonly IBookingRepository _bookingRepository;

    public BookingsController(ICommandDispatcher commandDispatcher, IBookingRepository bookingRepository)
    {
        _commandDispatcher = commandDispatcher;
        _bookingRepository = bookingRepository;
    }

    [HttpGet("salon/{salonId:guid}")]
    public async Task<ActionResult<BookingListResponse>> GetBySalon(Guid salonId, [FromQuery] BookingStatus? status = null)
    {
        var bookings = await _bookingRepository.GetBySalonAsync(salonId, status);

        return Ok(new BookingListResponse
        {
            Bookings = bookings.Select(MapToDto).ToList(),
            TotalCount = bookings.Count
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BookingDto>> GetById(Guid id)
    {
        var booking = await _bookingRepository.GetByIdAsync(id);

        if (booking is null)
            return NotFound();

        return Ok(MapToDto(booking));
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateBookingRequest request)
    {
        var command = new CreateBookingCommand
        {
            SalonId = request.SalonId,
            MasterId = request.MasterId,
            ServiceId = request.ServiceId,
            ClientId = request.ClientId,
            ClientName = request.ClientName,
            ClientEmail = request.ClientEmail,
            ClientPhone = request.ClientPhone,
            IsNewClient = request.IsNewClient,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Notes = request.Notes,
            CreatedBy = User.Identity?.Name
        };

        var result = await _commandDispatcher.DispatchAsync(command);

        if (!result.Success)
            return BadRequest(new { result.Message });

        return CreatedAtAction(nameof(GetById), new { id = result.BookingId }, new { result.BookingId, result.Message });
    }

    [HttpPut("{id:guid}/status")]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] UpdateBookingStatusRequest request)
    {
        var command = new UpdateBookingStatusCommand
        {
            BookingId = id,
            NewStatus = request.NewStatus,
            ChangedBy = request.ChangedBy,
            ActorId = request.ActorId,
            ActorName = request.ActorName,
            Reason = request.Reason
        };

        var result = await _commandDispatcher.DispatchAsync(command);

        if (!result.Success)
            return BadRequest(new { result.Message });

        return Ok(new { result.BookingId, result.Message });
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var booking = await _bookingRepository.GetByIdAsync(id);

        if (booking is null)
            return NotFound();

        _bookingRepository.Remove(booking);
        await _bookingRepository.SaveChangesAsync();

        return NoContent();
    }

    private static BookingDto MapToDto(Booking b) => new()
    {
        Id = b.Id,
        ClientName = b.ClientName,
        ClientEmail = b.ClientEmail,
        ClientPhone = b.ClientPhone,
        IsNewClient = b.IsNewClient,
        StartTime = b.StartTime,
        EndTime = b.EndTime,
        Status = b.Status,
        ConfirmationDeadline = b.ConfirmationDeadline,
        ConfirmedAt = b.ConfirmedAt,
        Notes = b.Notes,
        CreatedBy = b.CreatedBy,
        CreatedAt = b.CreatedAt,
        SalonId = b.SalonId,
        ClientId = b.ClientId,
        MasterId = b.MasterId,
        ServiceId = b.ServiceId
    };
}
