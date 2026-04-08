using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("loyalty")]
[Authorize]
public class LoyaltyController : ControllerBase
{
    private readonly IRepository<LoyaltyProgram> _loyaltyRepository;
    private readonly ISalonRepository _salonRepository;

    public LoyaltyController(IRepository<LoyaltyProgram> loyaltyRepository, ISalonRepository salonRepository)
    {
        _loyaltyRepository = loyaltyRepository;
        _salonRepository = salonRepository;
    }

    [HttpGet("salon/{salonId:guid}")]
    public async Task<ActionResult> GetBySalon(Guid salonId)
    {
        var allPrograms = await _loyaltyRepository.GetAllAsync();
        var program = allPrograms.FirstOrDefault(p => p.SalonId == salonId);
        
        if (program == null)
            return Ok(new { program = (object?)null, message = "No loyalty program configured" });

        return Ok(new { program = MapToDto(program) });
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] LoyaltySettingsRequest request)
    {
        // Check if program already exists for this salon
        var allPrograms = await _loyaltyRepository.GetAllAsync();
        var existing = allPrograms.FirstOrDefault(p => p.SalonId == request.SalonId);
        
        if (existing != null)
            return Conflict(new { message = "Loyalty program already exists for this salon" });

        var program = new LoyaltyProgram
        {
            Id = Guid.NewGuid(),
            SalonId = request.SalonId,
            IsEnabled = request.IsEnabled,
            PointsPerDollar = request.PointsPerDollar,
            PointsToRedeemDollar = request.PointsToRedeemDollar,
            BonusPointsOnSignup = request.BonusPointsOnSignup,
            PointsExpiryMonths = request.PointsExpiryMonths,
            MinimumPointsToRedeem = request.MinimumPointsToRedeem,
            CreatedAt = DateTime.UtcNow
        };

        await _loyaltyRepository.AddAsync(program);
        await _loyaltyRepository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBySalon), new { salonId = program.SalonId }, MapToDto(program));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] LoyaltySettingsRequest request)
    {
        var program = await _loyaltyRepository.GetByIdAsync(id);
        if (program == null)
            return NotFound(new { message = "Loyalty program not found" });

        program.IsEnabled = request.IsEnabled;
        program.PointsPerDollar = request.PointsPerDollar;
        program.PointsToRedeemDollar = request.PointsToRedeemDollar;
        program.BonusPointsOnSignup = request.BonusPointsOnSignup;
        program.PointsExpiryMonths = request.PointsExpiryMonths;
        program.MinimumPointsToRedeem = request.MinimumPointsToRedeem;
        program.UpdatedAt = DateTime.UtcNow;

        _loyaltyRepository.Update(program);
        await _loyaltyRepository.SaveChangesAsync();

        return Ok(MapToDto(program));
    }

    [HttpPost("{id:guid}/toggle")]
    public async Task<ActionResult> Toggle(Guid id)
    {
        var program = await _loyaltyRepository.GetByIdAsync(id);
        if (program == null)
            return NotFound(new { message = "Loyalty program not found" });

        program.IsEnabled = !program.IsEnabled;
        program.UpdatedAt = DateTime.UtcNow;

        _loyaltyRepository.Update(program);
        await _loyaltyRepository.SaveChangesAsync();

        return Ok(new { message = $"Loyalty program {(program.IsEnabled ? "enabled" : "disabled")}", isEnabled = program.IsEnabled });
    }

    private static object MapToDto(LoyaltyProgram p) => new
    {
        p.Id,
        p.SalonId,
        p.IsEnabled,
        p.PointsPerDollar,
        p.PointsToRedeemDollar,
        p.BonusPointsOnSignup,
        p.PointsExpiryMonths,
        p.MinimumPointsToRedeem,
        p.CreatedAt
    };
}

// Add SalonId to LoyaltySettingsRequest
public class LoyaltySettingsRequest
{
    public Guid SalonId { get; set; }
    public bool IsEnabled { get; set; }
    public int PointsPerDollar { get; set; }
    public int PointsToRedeemDollar { get; set; }
    public int BonusPointsOnSignup { get; set; }
    public int PointsExpiryMonths { get; set; }
    public int MinimumPointsToRedeem { get; set; }
}