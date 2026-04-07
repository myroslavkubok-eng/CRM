using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("api/support-messages")]
public class SupportMessagesController : ControllerBase
{
    private readonly ISupportMessageRepository _repository;

    public SupportMessagesController(ISupportMessageRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult> GetAll([FromQuery] string? status = null)
    {
        var messages = await _repository.GetByStatusAsync(status);
        return Ok(new { messages = messages.Select(MapToDto).ToList(), count = messages.Count });
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<ActionResult> GetById(Guid id)
    {
        var message = await _repository.GetByIdAsync(id);
        if (message is null) return NotFound();
        return Ok(MapToDto(message));
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult> Create([FromBody] CreateSupportMessageRequest request)
    {
        var message = new SupportMessage
        {
            Name = request.Name,
            Email = request.Email,
            Subject = request.Subject,
            Message = request.Message,
        };

        await _repository.AddAsync(message);
        await _repository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = message.Id }, new { messageId = message.Id, success = true });
    }

    [HttpPut("{id:guid}/status")]
    [Authorize]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] UpdateMessageStatusRequest request)
    {
        var message = await _repository.GetByIdAsync(id);
        if (message is null) return NotFound();

        message.Status = request.Status;
        message.UpdatedAt = DateTime.UtcNow;
        _repository.Update(message);
        await _repository.SaveChangesAsync();

        return Ok(MapToDto(message));
    }

    [HttpPut("{id:guid}/priority")]
    [Authorize]
    public async Task<ActionResult> UpdatePriority(Guid id, [FromBody] UpdateMessagePriorityRequest request)
    {
        var message = await _repository.GetByIdAsync(id);
        if (message is null) return NotFound();

        message.Priority = request.Priority;
        message.UpdatedAt = DateTime.UtcNow;
        _repository.Update(message);
        await _repository.SaveChangesAsync();

        return Ok(MapToDto(message));
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateSupportMessageRequest request)
    {
        var message = await _repository.GetByIdAsync(id);
        if (message is null) return NotFound();

        if (request.InternalNotes is not null) message.InternalNotes = request.InternalNotes;
        if (request.Status is not null) message.Status = request.Status;
        if (request.Priority is not null) message.Priority = request.Priority;
        message.UpdatedAt = DateTime.UtcNow;

        _repository.Update(message);
        await _repository.SaveChangesAsync();

        return Ok(MapToDto(message));
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<ActionResult> Delete(Guid id)
    {
        var message = await _repository.GetByIdAsync(id);
        if (message is null) return NotFound();

        _repository.Remove(message);
        await _repository.SaveChangesAsync();

        return NoContent();
    }

    private static object MapToDto(SupportMessage m) => new
    {
        m.Id,
        m.Name,
        m.Email,
        m.Subject,
        m.Message,
        m.Status,
        m.Priority,
        m.InternalNotes,
        m.UserId,
        m.CreatedAt,
        m.UpdatedAt,
    };
}

public class CreateSupportMessageRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class UpdateMessageStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class UpdateMessagePriorityRequest
{
    public string Priority { get; set; } = string.Empty;
}

public class UpdateSupportMessageRequest
{
    public string? InternalNotes { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
}
