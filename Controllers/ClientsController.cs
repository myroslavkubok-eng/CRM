using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("clients")]
[Authorize]
public class ClientsController : ControllerBase
{
    private readonly IClientRepository _clientRepository;
    private readonly ISalonRepository _salonRepository;
    private readonly IRepository<Client> _clientRepo;

    public ClientsController(IClientRepository clientRepository, ISalonRepository salonRepository, IRepository<Client> clientRepo)
    {
        _clientRepository = clientRepository;
        _salonRepository = salonRepository;
        _clientRepo = clientRepo;
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

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateClientRequest request)
    {
        var client = await _clientRepository.GetByIdAsync(id);
        if (client == null)
            return NotFound(new { message = "Client not found" });

        if (request.FirstName != null) client.FirstName = request.FirstName;
        if (request.LastName != null) client.LastName = request.LastName;
        if (request.Email != null) client.Email = request.Email;
        if (request.Phone != null) client.Phone = request.Phone;
        if (request.Notes != null) client.Notes = request.Notes;

        _clientRepository.Update(client);
        await _clientRepository.SaveChangesAsync();

        return Ok(MapToDto(client));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var client = await _clientRepository.GetByIdAsync(id);
        if (client == null)
            return NotFound(new { message = "Client not found" });

        _clientRepository.Remove(client);
        await _clientRepository.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("search")]
    public async Task<ActionResult> Search([FromQuery] Guid salonId, [FromQuery] string? query)
    {
        var clients = await _clientRepository.GetBySalonAsync(salonId);

        if (!string.IsNullOrEmpty(query))
        {
            clients = clients.Where(c => 
                c.FirstName.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                c.LastName.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                c.Email.Contains(query, StringComparison.OrdinalIgnoreCase)
            ).ToList();
        }

        return Ok(new { clients = clients.Select(MapToDto), totalCount = clients.Count });
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

public class UpdateClientRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Notes { get; set; }
}