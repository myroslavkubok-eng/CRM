using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("api/invitations")]
public class InvitationsController : ControllerBase
{
    private readonly IInvitationRepository _invitationRepository;
    private readonly ISalonRepository _salonRepository;

    public InvitationsController(IInvitationRepository invitationRepository, ISalonRepository salonRepository)
    {
        _invitationRepository = invitationRepository;
        _salonRepository = salonRepository;
    }

    /// <summary>
    /// Generate an invitation token for a salon staff member.
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<ActionResult> Create([FromBody] CreateInvitationRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var invitedBy))
            return Unauthorized();

        if (!Enum.TryParse<UserRole>(request.Role, true, out var role))
            return BadRequest(new { error = "Invalid role." });

        var salon = await _salonRepository.GetByIdAsync(request.SalonId);
        if (salon is null) return NotFound(new { error = "Salon not found." });

        var invitation = new SalonInvitation
        {
            Id = Guid.NewGuid(),
            Token = Guid.NewGuid().ToString("N"),
            Email = request.Email,
            Role = role,
            SalonId = request.SalonId,
            InvitedBy = invitedBy,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
        };

        await _invitationRepository.AddAsync(invitation);
        await _invitationRepository.SaveChangesAsync();

        return Ok(new { token = invitation.Token, invitationId = invitation.Id });
    }

    /// <summary>
    /// Validate an invitation token.
    /// </summary>
    [HttpGet("{token}")]
    [AllowAnonymous]
    public async Task<ActionResult> GetByToken(string token)
    {
        var invitation = await _invitationRepository.GetByTokenAsync(token);

        if (invitation is null)
            return NotFound(new { invite = (object?)null });

        if (invitation.ExpiresAt < DateTime.UtcNow)
            return Ok(new { invite = (object?)null, error = "Invitation has expired." });

        if (invitation.Accepted)
            return Ok(new { invite = (object?)null, error = "Invitation already accepted." });

        return Ok(new
        {
            invite = new
            {
                invitation.Id,
                invitation.Token,
                invitation.Email,
                role = invitation.Role.ToString().ToLower(),
                salonId = invitation.SalonId,
                salonName = invitation.Salon?.Name,
                invitedBy = invitation.InvitedBy,
                invitation.ExpiresAt,
            }
        });
    }

    /// <summary>
    /// Accept an invitation.
    /// </summary>
    [HttpPost("{token}/accept")]
    [Authorize]
    public async Task<ActionResult> Accept(string token)
    {
        var invitation = await _invitationRepository.GetByTokenAsync(token);
        if (invitation is null) return NotFound(new { error = "Invitation not found." });
        if (invitation.ExpiresAt < DateTime.UtcNow) return BadRequest(new { error = "Invitation has expired." });
        if (invitation.Accepted) return BadRequest(new { error = "Invitation already accepted." });

        invitation.Accepted = true;
        invitation.AcceptedAt = DateTime.UtcNow;

        _invitationRepository.Update(invitation);
        await _invitationRepository.SaveChangesAsync();

        return Ok(new { success = true, salonId = invitation.SalonId, role = invitation.Role.ToString().ToLower() });
    }
}

public class CreateInvitationRequest
{
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "master";
    public Guid SalonId { get; set; }
}
