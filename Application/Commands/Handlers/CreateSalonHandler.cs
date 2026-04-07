using CRMKatia.Application.Commands.Interfaces;
using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using CRMKatia.Domain.Interfaces;

namespace CRMKatia.Application.Commands.Handlers;

public class CreateSalonCommand : ICommand<CommandResult>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? Country { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public Guid OwnerId { get; set; }
}

public class CreateSalonHandler : ICommandHandler<CreateSalonCommand, CommandResult>
{
    private readonly ISalonRepository _salonRepository;

    public CreateSalonHandler(ISalonRepository salonRepository)
    {
        _salonRepository = salonRepository;
    }

    public async Task<CommandResult> HandleAsync(CreateSalonCommand command)
    {
        var salon = new Salon
        {
            Id = Guid.NewGuid(),
            Name = command.Name,
            Description = command.Description,
            Address = command.Address,
            Phone = command.Phone,
            Email = command.Email,
            City = command.City,
            Country = command.Country,
            Latitude = command.Latitude,
            Longitude = command.Longitude,
            OwnerId = command.OwnerId,
            Plan = SubscriptionPlan.BasicStart,
            BillingPeriod = BillingPeriod.Monthly,
            SubscriptionStatus = SubscriptionStatus.Trial,
            IsPublished = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _salonRepository.AddAsync(salon);
        await _salonRepository.SaveChangesAsync();

        return CommandResult.Ok(salon.Id, "Salon created successfully.");
    }
}
