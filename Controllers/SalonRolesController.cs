using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

/// <summary>
/// Determines a user's role within a salon (owner, admin, master).
/// Replaces the Supabase Edge Function /salon-role/{userId} endpoint.
/// </summary>
[ApiController]
[Route("salon-roles")]
[Authorize]
public class SalonRolesController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly ISalonRepository _salonRepository;
    private readonly IMasterRepository _masterRepository;

    public SalonRolesController(
        UserManager<User> userManager,
        ISalonRepository salonRepository,
        IMasterRepository masterRepository)
    {
        _userManager = userManager;
        _salonRepository = salonRepository;
        _masterRepository = masterRepository;
    }

    /// <summary>
    /// Get the salon role for a user.
    /// Returns { role: { userId, salonId, role, firstName, lastName } } or { role: null }
    /// </summary>
    [HttpGet("{userId}")]
    public async Task<ActionResult> GetUserRole(string userId)
    {
        if (!Guid.TryParse(userId, out var userGuid))
            return BadRequest(new { message = "Invalid user ID format." });

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return NotFound(new { role = (object?)null });

        // SuperAdmin role
        if (user.Role == UserRole.SuperAdmin)
        {
            return Ok(new
            {
                role = new
                {
                    userId = user.Id,
                    salonId = (Guid?)null,
                    role = "superadmin",
                    firstName = user.FirstName,
                    lastName = user.LastName,
                }
            });
        }

        // Owner: find salon where OwnerId = userId
        if (user.Role == UserRole.Owner)
        {
            var salons = await _salonRepository.GetByOwnerAsync(userGuid);
            var salon = salons.FirstOrDefault();
            return Ok(new
            {
                role = new
                {
                    userId = user.Id,
                    salonId = salon?.Id,
                    role = "owner",
                    firstName = user.FirstName,
                    lastName = user.LastName,
                }
            });
        }

        // Master / Admin: find master record linked to this user
        if (user.Role is UserRole.Master or UserRole.Admin)
        {
            var master = await _masterRepository.GetByUserIdAsync(userGuid);
            if (master is not null)
            {
                return Ok(new
                {
                    role = new
                    {
                        userId = user.Id,
                        salonId = (Guid?)master.SalonId,
                        role = user.Role == UserRole.Admin ? "admin" : "master",
                        firstName = user.FirstName,
                        lastName = user.LastName,
                    }
                });
            }
        }

        // Client or no salon role found
        return Ok(new { role = (object?)null });
    }

    /// <summary>
    /// Assign a salon role to a user (used after accepting an invitation).
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> AssignRole([FromBody] AssignRoleRequest request)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user is null)
            return NotFound(new { message = "User not found." });

        if (!Enum.TryParse<UserRole>(request.Role, true, out var role))
            return BadRequest(new { message = "Invalid role." });

        user.Role = role;
        await _userManager.UpdateAsync(user);

        // If master role, ensure master record exists
        if (role == UserRole.Master && request.SalonId.HasValue)
        {
            var existing = await _masterRepository.GetByUserIdAsync(user.Id);
            if (existing is null)
            {
                var master = new Master
                {
                    Id = Guid.NewGuid(),
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email ?? string.Empty,
                    Phone = user.Phone ?? string.Empty,
                    SalonId = request.SalonId.Value,
                    UserId = user.Id,
                };
                await _masterRepository.AddAsync(master);
                await _masterRepository.SaveChangesAsync();
            }
        }

        return Ok(new { success = true });
    }
}

public class AssignRoleRequest
{
    public string UserId { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public Guid? SalonId { get; set; }
}
