using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("referrals")]
[Authorize]
public class ReferralsController : ControllerBase
{
    private readonly IRepository<ReferralProgram> _programRepository;
    private readonly IRepository<Referral> _referralRepository;
    private readonly ISalonRepository _salonRepository;

    public ReferralsController(
        IRepository<ReferralProgram> programRepository,
        IRepository<Referral> referralRepository,
        ISalonRepository salonRepository)
    {
        _programRepository = programRepository;
        _referralRepository = referralRepository;
        _salonRepository = salonRepository;
    }

    [HttpGet("program/salon/{salonId:guid}")]
    public async Task<ActionResult> GetProgram(Guid salonId)
    {
        var allPrograms = await _programRepository.GetAllAsync();
        var program = allPrograms.FirstOrDefault(p => p.SalonId == salonId);
        
        if (program == null)
            return Ok(new { program = (object?)null, message = "No referral program configured" });

        return Ok(new { program = MapProgramToDto(program) });
    }

    [HttpPost("program")]
    public async Task<ActionResult> CreateProgram([FromBody] ReferralSettingsRequest request)
    {
        var allPrograms = await _programRepository.GetAllAsync();
        var existing = allPrograms.FirstOrDefault(p => p.SalonId == request.SalonId);
        
        if (existing != null)
            return Conflict(new { message = "Referral program already exists for this salon" });

        var program = new ReferralProgram
        {
            Id = Guid.NewGuid(),
            SalonId = request.SalonId,
            IsEnabled = request.IsEnabled,
            ReferrerReward = request.ReferrerReward,
            RefereeReward = request.RefereeReward,
            MinimumPurchaseForReward = request.MinimumPurchaseForReward,
            MaxReferralsPerClient = request.MaxReferralsPerClient,
            RewardExpiryDays = request.RewardExpiryDays,
            CreatedAt = DateTime.UtcNow
        };

        await _programRepository.AddAsync(program);
        await _programRepository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProgram), new { salonId = program.SalonId }, MapProgramToDto(program));
    }

    [HttpPut("program/{id:guid}")]
    public async Task<ActionResult> UpdateProgram(Guid id, [FromBody] ReferralSettingsRequest request)
    {
        var program = await _programRepository.GetByIdAsync(id);
        if (program == null)
            return NotFound(new { message = "Referral program not found" });

        program.IsEnabled = request.IsEnabled;
        program.ReferrerReward = request.ReferrerReward;
        program.RefereeReward = request.RefereeReward;
        program.MinimumPurchaseForReward = request.MinimumPurchaseForReward;
        program.MaxReferralsPerClient = request.MaxReferralsPerClient;
        program.RewardExpiryDays = request.RewardExpiryDays;
        program.UpdatedAt = DateTime.UtcNow;

        _programRepository.Update(program);
        await _programRepository.SaveChangesAsync();

        return Ok(MapProgramToDto(program));
    }

    [HttpGet("salon/{salonId:guid}")]
    public async Task<ActionResult> GetReferrals(Guid salonId)
    {
        var allReferrals = await _referralRepository.GetAllAsync();
        var referrals = allReferrals.Where(r => r.SalonId == salonId).ToList();

        var stats = new
        {
            totalReferrals = referrals.Count,
            pendingReferrerRewards = referrals.Count(r => !r.IsReferrerRewardClaimed),
            pendingRefereeRewards = referrals.Count(r => !r.IsRefereeRewardClaimed),
            totalRewardsGiven = referrals.Where(r => r.IsReferrerRewardClaimed).Sum(r => r.ReferrerReward) +
                                referrals.Where(r => r.IsRefereeRewardClaimed).Sum(r => r.RefereeReward)
        };

        return Ok(new { referrals = referrals.Select(MapReferralToDto), stats });
    }

    [HttpPost("{id:guid}/claim-referrer")]
    public async Task<ActionResult> ClaimReferrerReward(Guid id)
    {
        var referral = await _referralRepository.GetByIdAsync(id);
        if (referral == null)
            return NotFound(new { message = "Referral not found" });

        if (referral.IsReferrerRewardClaimed)
            return BadRequest(new { message = "Referrer reward already claimed" });

        referral.IsReferrerRewardClaimed = true;
        _referralRepository.Update(referral);
        await _referralRepository.SaveChangesAsync();

        return Ok(new { message = "Referrer reward claimed successfully", reward = referral.ReferrerReward });
    }

    [HttpPost("{id:guid}/claim-referee")]
    public async Task<ActionResult> ClaimRefereeReward(Guid id)
    {
        var referral = await _referralRepository.GetByIdAsync(id);
        if (referral == null)
            return NotFound(new { message = "Referral not found" });

        if (referral.IsRefereeRewardClaimed)
            return BadRequest(new { message = "Referee reward already claimed" });

        referral.IsRefereeRewardClaimed = true;
        _referralRepository.Update(referral);
        await _referralRepository.SaveChangesAsync();

        return Ok(new { message = "Referee reward claimed successfully", reward = referral.RefereeReward });
    }

    private static object MapProgramToDto(ReferralProgram p) => new
    {
        p.Id,
        p.SalonId,
        p.IsEnabled,
        p.ReferrerReward,
        p.RefereeReward,
        p.MinimumPurchaseForReward,
        p.MaxReferralsPerClient,
        p.RewardExpiryDays,
        p.CreatedAt
    };

    private static object MapReferralToDto(Referral r) => new
    {
        r.Id,
        r.SalonId,
        r.ReferrerId,
        r.RefereeId,
        r.ReferrerReward,
        r.RefereeReward,
        r.IsReferrerRewardClaimed,
        r.IsRefereeRewardClaimed,
        r.CreatedAt
    };
}

// Ensure SalonId is in request
public class ReferralSettingsRequest
{
    public Guid SalonId { get; set; }
    public bool IsEnabled { get; set; } = true;
    public decimal ReferrerReward { get; set; } = 25;
    public decimal RefereeReward { get; set; } = 15;
    public decimal MinimumPurchaseForReward { get; set; } = 50;
    public int MaxReferralsPerClient { get; set; } = 10;
    public int RewardExpiryDays { get; set; } = 90;
}