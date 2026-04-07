using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationRepository _notificationRepository;

    public NotificationsController(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    [HttpGet("recipient/{recipientId:guid}")]
    public async Task<ActionResult> GetByRecipient(Guid recipientId, [FromQuery] bool unreadOnly = false)
    {
        var notifications = await _notificationRepository.GetByRecipientAsync(recipientId, unreadOnly);

        return Ok(new
        {
            Notifications = notifications.Select(MapToDto).ToList(),
            TotalCount = notifications.Count,
            UnreadCount = notifications.Count(n => !n.Read)
        });
    }

    [HttpPut("{id:guid}/mark-as-read")]
    public async Task<ActionResult> MarkAsRead(Guid id)
    {
        var notification = await _notificationRepository.GetByIdAsync(id);

        if (notification is null)
            return NotFound();

        await _notificationRepository.MarkAsReadAsync(id);

        return Ok(new { Message = "Notification marked as read." });
    }

    private static object MapToDto(Notification n) => new
    {
        n.Id,
        n.Type,
        n.Title,
        n.Message,
        n.ActionUrl,
        n.RecipientType,
        n.Priority,
        n.Read,
        n.ReadAt,
        n.Dismissed,
        n.Channels,
        n.SentAt,
        n.RecipientId,
        n.BookingId,
        n.SalonId
    };
}
