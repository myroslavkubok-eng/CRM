using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("services")]
[Authorize]
public class ServicesController : ControllerBase
{
    private readonly ISalonRepository _salonRepository;
    private readonly IRepository<Service> _serviceRepository;

    public ServicesController(ISalonRepository salonRepository, IRepository<Service> serviceRepository)
    {
        _salonRepository = salonRepository;
        _serviceRepository = serviceRepository;
    }

[HttpGet("salon/{salonId:guid}")]
[AllowAnonymous]
public async Task<ActionResult> GetBySalon(Guid salonId)
    {
        var salon = await _salonRepository.GetWithDetailsAsync(salonId);
        if (salon == null)
            return NotFound(new { message = "Salon not found" });

        var services = salon.Services?.ToList() ?? new List<Service>();
        return Ok(new { services = services.Select(MapToDto), totalCount = services.Count });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var service = await _serviceRepository.GetByIdAsync(id);
        if (service == null)
            return NotFound(new { message = "Service not found" });

        return Ok(MapToDto(service));
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateServiceRequest request)
    {
        var salon = await _salonRepository.GetByIdAsync(request.SalonId);
        if (salon == null)
            return BadRequest(new { message = "Salon not found" });

        var service = new Service
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Category = request.Category ?? "General",
            Duration = request.Duration,
            Price = request.Price,
            Discount = request.Discount,
            ImageUrl = request.ImageUrl,
            SalonId = request.SalonId
        };

        await _serviceRepository.AddAsync(service);
        await _serviceRepository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = service.Id }, MapToDto(service));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateServiceRequest request)
    {
        var service = await _serviceRepository.GetByIdAsync(id);
        if (service == null)
            return NotFound(new { message = "Service not found" });

        if (request.Name != null) service.Name = request.Name;
        if (request.Description != null) service.Description = request.Description;
        if (request.Category != null) service.Category = request.Category;
        if (request.Duration.HasValue) service.Duration = request.Duration.Value;
        if (request.Price.HasValue) service.Price = request.Price.Value;
        if (request.Discount.HasValue) service.Discount = request.Discount;
        if (request.ImageUrl != null) service.ImageUrl = request.ImageUrl;

        _serviceRepository.Update(service);
        await _serviceRepository.SaveChangesAsync();

        return Ok(MapToDto(service));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var service = await _serviceRepository.GetByIdAsync(id);
        if (service == null)
            return NotFound(new { message = "Service not found" });

        _serviceRepository.Remove(service);
        await _serviceRepository.SaveChangesAsync();

        return NoContent();
    }

    private static object MapToDto(Service s) => new
    {
        s.Id,
        s.Name,
        s.Description,
        s.Category,
        s.Duration,
        s.Price,
        s.Discount,
        ImageUrl = s.ImageUrl,
        s.SalonId
    };
}

public class CreateServiceRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public int Duration { get; set; } = 60;
    public decimal Price { get; set; }
    public decimal? Discount { get; set; }
    public string? ImageUrl { get; set; }
    public Guid SalonId { get; set; }
}

public class UpdateServiceRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public int? Duration { get; set; }
    public decimal? Price { get; set; }
    public decimal? Discount { get; set; }
    public string? ImageUrl { get; set; }
}