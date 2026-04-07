using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("api/clients")]
[Authorize]
public class ClientsController : ControllerBase
{
    private readonly IClientRepository _clientRepository;

    public ClientsController(IClientRepository clientRepository)
    {
        _clientRepository = clientRepository;
    }

    [HttpGet("salon/{salonId:guid}")]
    public async Task<ActionResult> GetBySalon(Guid salonId)
    {
        var clients = await _clientRepository.GetBySalonAsync(salonId);

        return Ok(new
        {
            Clients = clients.Select(MapToDto).ToList(),
            TotalCount = clients.Count
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var client = await _clientRepository.GetByIdAsync(id);

        if (client is null)
            return NotFound();

        return Ok(MapToDto(client));
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateClientRequest request)
    {
        var existing = await _clientRepository.GetByEmailAndSalonAsync(request.Email, request.SalonId);
        if (existing is not null)
            return Conflict(new { Message = "A client with this email already exists for this salon." });

        var client = new Client
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            Notes = request.Notes,
            SalonId = request.SalonId,
            CreatedAt = DateTime.UtcNow
        };

        await _clientRepository.AddAsync(client);
        await _clientRepository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = client.Id }, MapToDto(client));
    }

    private static object MapToDto(Client c) => new
    {
        c.Id,
        c.FirstName,
        c.LastName,
        c.Email,
        c.Phone,
        c.Notes,
        c.TotalBookings,
        c.TotalSpent,
        c.LastVisit,
        c.CreatedAt,
        c.SalonId
    };
}

public class CreateClientRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public Guid SalonId { get; set; }
}
