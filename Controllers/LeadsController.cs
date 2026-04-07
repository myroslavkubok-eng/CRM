using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("api/leads")]
public class LeadsController : ControllerBase
{
    private readonly ILeadRepository _leadRepository;

    public LeadsController(ILeadRepository leadRepository)
    {
        _leadRepository = leadRepository;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult> GetAll()
    {
        var leads = await _leadRepository.GetAllAsync();
        return Ok(new { leads = leads.Select(MapToDto).ToList(), count = leads.Count });
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult> Create([FromBody] CreateLeadRequest request)
    {
        var existing = await _leadRepository.GetByEmailAsync(request.Email);
        if (existing is not null)
        {
            // Update the existing lead instead of creating a duplicate
            existing.BusinessName = request.BusinessName;
            existing.OwnerName = request.OwnerName;
            existing.Phone = request.Phone;
            existing.City = request.City;
            existing.Country = request.Country;
            existing.PlanInterest = request.PlanInterest;
            existing.Message = request.Message;
            existing.UpdatedAt = DateTime.UtcNow;
            _leadRepository.Update(existing);
            await _leadRepository.SaveChangesAsync();
            return Ok(new { leadId = existing.Id, updated = true });
        }

        var lead = new Lead
        {
            BusinessName = request.BusinessName,
            OwnerName = request.OwnerName,
            Email = request.Email,
            Phone = request.Phone,
            City = request.City,
            Country = request.Country,
            PlanInterest = request.PlanInterest,
            Message = request.Message,
        };

        await _leadRepository.AddAsync(lead);
        await _leadRepository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = lead.Id }, new { leadId = lead.Id });
    }

    [HttpPut("{id:guid}/status")]
    [Authorize]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] UpdateLeadStatusRequest request)
    {
        var lead = await _leadRepository.GetByIdAsync(id);
        if (lead is null) return NotFound();

        lead.Status = request.Status;
        if (request.Notes is not null) lead.Notes = request.Notes;
        lead.UpdatedAt = DateTime.UtcNow;

        _leadRepository.Update(lead);
        await _leadRepository.SaveChangesAsync();

        return Ok(MapToDto(lead));
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<ActionResult> Delete(Guid id)
    {
        var lead = await _leadRepository.GetByIdAsync(id);
        if (lead is null) return NotFound();

        _leadRepository.Remove(lead);
        await _leadRepository.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("send-verification")]
    [AllowAnonymous]
    public async Task<ActionResult> SendVerification([FromBody] SendVerificationRequest request)
    {
        var lead = await _leadRepository.GetByEmailAsync(request.Email);
        if (lead is null) return NotFound(new { error = "Lead not found." });

        // Generate a 6-digit code
        var code = Random.Shared.Next(100000, 999999).ToString();
        lead.VerificationCode = code;
        lead.VerificationCodeExpiresAt = DateTime.UtcNow.AddMinutes(15);
        lead.UpdatedAt = DateTime.UtcNow;

        _leadRepository.Update(lead);
        await _leadRepository.SaveChangesAsync();

        // In production: send email with code
        // For now, return success (email service integration needed separately)
        return Ok(new { success = true, message = "Verification code sent." });
    }

    [HttpPost("verify-code")]
    [AllowAnonymous]
    public async Task<ActionResult> VerifyCode([FromBody] VerifyCodeRequest request)
    {
        var lead = await _leadRepository.GetByEmailAsync(request.Email);
        if (lead is null) return NotFound(new { error = "Lead not found." });

        if (lead.VerificationCode != request.Code)
            return BadRequest(new { error = "Invalid verification code." });

        if (lead.VerificationCodeExpiresAt < DateTime.UtcNow)
            return BadRequest(new { error = "Verification code has expired." });

        lead.EmailVerified = true;
        lead.VerificationCode = null;
        lead.VerificationCodeExpiresAt = null;
        lead.UpdatedAt = DateTime.UtcNow;

        _leadRepository.Update(lead);
        await _leadRepository.SaveChangesAsync();

        return Ok(new { success = true, verified = true });
    }

    private static object MapToDto(Lead l) => new
    {
        l.Id,
        l.BusinessName,
        l.OwnerName,
        l.Email,
        l.Phone,
        l.City,
        l.Country,
        l.PlanInterest,
        l.Message,
        l.Status,
        l.Notes,
        l.EmailVerified,
        l.CreatedAt,
        l.UpdatedAt,
    };
}

public class CreateLeadRequest
{
    public string BusinessName { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? PlanInterest { get; set; }
    public string? Message { get; set; }
}

public class UpdateLeadStatusRequest
{
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class SendVerificationRequest
{
    public string Email { get; set; } = string.Empty;
}

public class VerifyCodeRequest
{
    public string Email { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}
