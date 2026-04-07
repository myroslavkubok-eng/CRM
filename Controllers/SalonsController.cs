using CRMKatia.Application.Commands.Handlers;
using CRMKatia.Application.Commands.Interfaces;
using CRMKatia.Domain.DTOs;
using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("api/salons")]
[Authorize]
public class SalonsController : ControllerBase
{
    private readonly ICommandDispatcher _commandDispatcher;
    private readonly ISalonRepository _salonRepository;

    public SalonsController(ICommandDispatcher commandDispatcher, ISalonRepository salonRepository)
    {
        _commandDispatcher = commandDispatcher;
        _salonRepository = salonRepository;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<SalonListResponse>> GetAll()
    {
        var salons = await _salonRepository.GetAllAsync();

        return Ok(new SalonListResponse
        {
            Salons = salons.Select(MapToDto).ToList(),
            TotalCount = salons.Count
        });
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<SalonDto>> GetById(Guid id)
    {
        var salon = await _salonRepository.GetWithDetailsAsync(id);

        if (salon is null)
            return NotFound();

        return Ok(MapToDto(salon));
    }

    [HttpGet("owner/{ownerId:guid}")]
    public async Task<ActionResult<SalonListResponse>> GetByOwner(Guid ownerId)
    {
        var salons = await _salonRepository.GetByOwnerAsync(ownerId);

        return Ok(new SalonListResponse
        {
            Salons = salons.Select(MapToDto).ToList(),
            TotalCount = salons.Count
        });
    }

    /// <summary>Returns all salons for a given user (by owner ID). Used by FeedPage and dashboards.</summary>
    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult> GetByUser(Guid userId)
    {
        var salons = await _salonRepository.GetByOwnerAsync(userId);
        return Ok(new { salons = salons.Select(MapToDto).ToList(), count = salons.Count });
    }

    [HttpPut("{id:guid}/settings")]
    public async Task<ActionResult> UpdateSettings(Guid id, [FromBody] UpdateSalonRequest request)
    {
        var salon = await _salonRepository.GetByIdAsync(id);
        if (salon is null) return NotFound();

        if (request.Name is not null) salon.Name = request.Name;
        if (request.Description is not null) salon.Description = request.Description;
        if (request.Address is not null) salon.Address = request.Address;
        if (request.Phone is not null) salon.Phone = request.Phone;
        if (request.Email is not null) salon.Email = request.Email;
        if (request.City is not null) salon.City = request.City;
        if (request.Country is not null) salon.Country = request.Country;
        if (request.Latitude.HasValue) salon.Latitude = request.Latitude;
        if (request.Longitude.HasValue) salon.Longitude = request.Longitude;
        salon.UpdatedAt = DateTime.UtcNow;

        _salonRepository.Update(salon);
        await _salonRepository.SaveChangesAsync();

        return Ok(new { salon = MapToDto(salon) });
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateSalonRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var ownerId))
            return Unauthorized();

        var command = new CreateSalonCommand
        {
            Name = request.Name,
            Description = request.Description,
            Address = request.Address,
            Phone = request.Phone,
            Email = request.Email,
            City = request.City,
            Country = request.Country,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            OwnerId = ownerId
        };

        var result = await _commandDispatcher.DispatchAsync(command);

        if (!result.Success)
            return BadRequest(new { result.Message });

        return CreatedAtAction(nameof(GetById), new { id = result.BookingId }, new { SalonId = result.BookingId, result.Message });
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateSalonRequest request)
    {
        var salon = await _salonRepository.GetByIdAsync(id);

        if (salon is null)
            return NotFound();

        if (request.Name is not null) salon.Name = request.Name;
        if (request.Description is not null) salon.Description = request.Description;
        if (request.Address is not null) salon.Address = request.Address;
        if (request.Phone is not null) salon.Phone = request.Phone;
        if (request.Email is not null) salon.Email = request.Email;
        if (request.City is not null) salon.City = request.City;
        if (request.Country is not null) salon.Country = request.Country;
        if (request.Latitude.HasValue) salon.Latitude = request.Latitude;
        if (request.Longitude.HasValue) salon.Longitude = request.Longitude;
        salon.UpdatedAt = DateTime.UtcNow;

        _salonRepository.Update(salon);
        await _salonRepository.SaveChangesAsync();

        return Ok(MapToDto(salon));
    }

    [HttpPut("{id:guid}/publish")]
    public async Task<ActionResult> Publish(Guid id)
    {
        var salon = await _salonRepository.GetByIdAsync(id);

        if (salon is null)
            return NotFound();

        salon.IsPublished = true;
        salon.PublishedAt = DateTime.UtcNow;
        salon.UpdatedAt = DateTime.UtcNow;

        _salonRepository.Update(salon);
        await _salonRepository.SaveChangesAsync();

        return Ok(new { Message = "Salon published successfully.", SalonId = salon.Id });
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var salon = await _salonRepository.GetByIdAsync(id);

        if (salon is null)
            return NotFound();

        _salonRepository.Remove(salon);
        await _salonRepository.SaveChangesAsync();

        return NoContent();
    }

    private static SalonDto MapToDto(Salon s) => new()
    {
        Id = s.Id,
        Name = s.Name,
        Description = s.Description,
        Address = s.Address,
        Phone = s.Phone,
        Email = s.Email,
        Logo = s.Logo,
        Cover = s.Cover,
        City = s.City,
        Country = s.Country,
        Latitude = s.Latitude,
        Longitude = s.Longitude,
        Plan = s.Plan,
        SubscriptionStatus = s.SubscriptionStatus,
        IsPublished = s.IsPublished,
        CreatedAt = s.CreatedAt,
        OwnerId = s.OwnerId
    };
}
