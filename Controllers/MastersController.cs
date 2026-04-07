using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("api/masters")]
[Authorize]
public class MastersController : ControllerBase
{
    private readonly IMasterRepository _masterRepository;
    private readonly ISalonRepository _salonRepository;
    private readonly UserManager<User> _userManager;

    public MastersController(
        IMasterRepository masterRepository,
        ISalonRepository salonRepository,
        UserManager<User> userManager)
    {
        _masterRepository = masterRepository;
        _salonRepository = salonRepository;
        _userManager = userManager;
    }

    [HttpGet("salon/{salonId:guid}")]
    public async Task<ActionResult> GetBySalon(Guid salonId)
    {
        var masters = await _masterRepository.GetBySalonAsync(salonId);
        return Ok(new { masters = masters.Select(MapToDto).ToList() });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var master = await _masterRepository.GetWithServicesAsync(id);
        if (master is null) return NotFound();
        return Ok(MapToDto(master));
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateMasterRequest request)
    {
        var salon = await _salonRepository.GetByIdAsync(request.SalonId);
        if (salon is null) return BadRequest(new { message = "Salon not found." });

        var master = new Master
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Phone = request.Phone,
            Email = request.Email,
            Avatar = request.Avatar,
            Role = UserRole.Master,
            Categories = request.Categories ?? [],
            SalonId = request.SalonId,
            BaseSalary = request.BaseSalary ?? 0,
            MonthlyTarget = request.MonthlyTarget ?? 0,
            BonusType = request.BonusType ?? "percentage",
            BonusValue = request.BonusValue ?? 0,
            WorkingHours = request.WorkingHours?.Select(wh => new WorkingHours
            {
                Day = wh.Day,
                IsWorking = wh.IsWorking,
                StartTime = wh.StartTime,
                EndTime = wh.EndTime
            }).ToList() ?? [],
        };

        await _masterRepository.AddAsync(master);
        await _masterRepository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = master.Id }, new { masterId = master.Id, master = MapToDto(master) });
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateMasterRequest request)
    {
        var master = await _masterRepository.GetByIdAsync(id);
        if (master is null) return NotFound();

        if (request.FirstName is not null) master.FirstName = request.FirstName;
        if (request.LastName is not null) master.LastName = request.LastName;
        if (request.Phone is not null) master.Phone = request.Phone;
        if (request.Email is not null) master.Email = request.Email;
        if (request.Avatar is not null) master.Avatar = request.Avatar;
        if (request.Categories is not null) master.Categories = request.Categories;
        if (request.BaseSalary.HasValue) master.BaseSalary = request.BaseSalary.Value;
        if (request.MonthlyTarget.HasValue) master.MonthlyTarget = request.MonthlyTarget.Value;
        if (request.BonusType is not null) master.BonusType = request.BonusType;
        if (request.BonusValue.HasValue) master.BonusValue = request.BonusValue.Value;
        if (request.WorkingHours is not null)
        {
            master.WorkingHours = request.WorkingHours.Select(wh => new WorkingHours
            {
                Day = wh.Day,
                IsWorking = wh.IsWorking,
                StartTime = wh.StartTime,
                EndTime = wh.EndTime
            }).ToList();
        }
        if (request.DaysOff is not null) master.DaysOff = request.DaysOff;

        _masterRepository.Update(master);
        await _masterRepository.SaveChangesAsync();

        return Ok(new { master = MapToDto(master) });
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var master = await _masterRepository.GetByIdAsync(id);
        if (master is null) return NotFound();

        _masterRepository.Remove(master);
        await _masterRepository.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult> RegisterMaster([FromBody] RegisterMasterRequest request)
    {
        // Create user account
        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Phone = request.Phone,
            Role = UserRole.Master,
        };

        var result = await _userManager.CreateAsync(user, request.Password ?? Guid.NewGuid().ToString("N") + "Aa1!");
        if (!result.Succeeded)
            return BadRequest(new { error = string.Join("; ", result.Errors.Select(e => e.Description)) });

        // Create master record linked to the user
        var master = new Master
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Phone = request.Phone ?? string.Empty,
            Email = request.Email,
            SalonId = request.SalonId,
            UserId = user.Id,
            Role = UserRole.Master,
        };

        await _masterRepository.AddAsync(master);
        await _masterRepository.SaveChangesAsync();

        return Ok(new { success = true, masterId = master.Id, userId = user.Id });
    }

    private static object MapToDto(Master m) => new
    {
        m.Id,
        m.FirstName,
        m.LastName,
        m.Phone,
        m.Email,
        m.Avatar,
        role = m.Role.ToString().ToLower(),
        m.Categories,
        m.SalonId,
        m.UserId,
        m.Rating,
        m.CompletedBookings,
        m.Revenue,
        m.BaseSalary,
        m.MonthlyTarget,
        m.CurrentRevenue,
        m.BonusType,
        m.BonusValue,
        workingHours = m.WorkingHours.Select(wh => new { wh.Day, wh.IsWorking, wh.StartTime, wh.EndTime }),
        m.DaysOff,
        vacations = m.Vacations.Select(v => new { v.Id, v.StartDate, v.EndDate, v.Reason }),
        extraWorkDays = m.ExtraWorkDays.Select(e => new { e.Id, e.Date, e.StartTime, e.EndTime }),
        m.CreatedAt,
        services = m.MasterServices.Select(ms => ms.ServiceId.ToString()),
    };
}

public class CreateMasterRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public List<string>? Categories { get; set; }
    public Guid SalonId { get; set; }
    public decimal? BaseSalary { get; set; }
    public decimal? MonthlyTarget { get; set; }
    public string? BonusType { get; set; }
    public decimal? BonusValue { get; set; }
    public List<WorkingHoursDto>? WorkingHours { get; set; }
}

public class UpdateMasterRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Avatar { get; set; }
    public List<string>? Categories { get; set; }
    public decimal? BaseSalary { get; set; }
    public decimal? MonthlyTarget { get; set; }
    public string? BonusType { get; set; }
    public decimal? BonusValue { get; set; }
    public List<WorkingHoursDto>? WorkingHours { get; set; }
    public List<string>? DaysOff { get; set; }
}

public class WorkingHoursDto
{
    public string Day { get; set; } = string.Empty;
    public bool IsWorking { get; set; }
    public string StartTime { get; set; } = "09:00";
    public string EndTime { get; set; } = "18:00";
}

public class RegisterMasterRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Password { get; set; }
    public Guid SalonId { get; set; }
    public string InvitedBy { get; set; } = string.Empty;
}
