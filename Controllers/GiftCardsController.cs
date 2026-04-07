using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("api/giftcards")]
[Authorize]
public class GiftCardsController : ControllerBase
{
    private readonly IGiftCardRepository _giftCardRepository;

    public GiftCardsController(IGiftCardRepository giftCardRepository)
    {
        _giftCardRepository = giftCardRepository;
    }

    [HttpGet("salon/{salonId:guid}")]
    public async Task<ActionResult> GetBySalon(Guid salonId)
    {
        var giftCards = await _giftCardRepository.GetBySalonAsync(salonId);

        return Ok(new
        {
            GiftCards = giftCards.Select(MapToDto).ToList(),
            TotalCount = giftCards.Count
        });
    }

    [HttpGet("code/{code}")]
    public async Task<ActionResult> GetByCode(string code)
    {
        var giftCard = await _giftCardRepository.GetByCodeAsync(code);

        if (giftCard is null)
            return NotFound();

        return Ok(MapToDto(giftCard));
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateGiftCardRequest request)
    {
        var giftCard = new GiftCard
        {
            Id = Guid.NewGuid(),
            Code = GenerateCode(),
            Amount = request.Amount,
            Currency = request.Currency ?? "AED",
            RemainingBalance = request.Amount,
            PurchaserName = request.PurchaserName,
            PurchaserEmail = request.PurchaserEmail,
            RecipientName = request.RecipientName,
            RecipientEmail = request.RecipientEmail,
            PersonalMessage = request.PersonalMessage,
            DeliveryMethod = request.DeliveryMethod ?? "email",
            Theme = request.Theme ?? "birthday",
            Status = GiftCardStatus.Active,
            AllowPartialUse = request.AllowPartialUse,
            AllowMultipleServices = request.AllowMultipleServices,
            ExpiresAt = request.ExpiresAt,
            SalonId = request.SalonId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _giftCardRepository.AddAsync(giftCard);
        await _giftCardRepository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetByCode), new { code = giftCard.Code }, MapToDto(giftCard));
    }

    private static string GenerateCode()
    {
        return $"GC-{Guid.NewGuid().ToString("N")[..12].ToUpperInvariant()}";
    }

    private static object MapToDto(GiftCard g) => new
    {
        g.Id,
        g.Code,
        g.Amount,
        g.Currency,
        g.RemainingBalance,
        g.PurchaserName,
        g.PurchaserEmail,
        g.RecipientName,
        g.RecipientEmail,
        g.PersonalMessage,
        g.DeliveryMethod,
        g.Theme,
        Status = g.Status.ToString(),
        g.AllowPartialUse,
        g.AllowMultipleServices,
        g.ExpiresAt,
        g.CreatedAt,
        g.SalonId
    };
}

public class CreateGiftCardRequest
{
    public decimal Amount { get; set; }
    public string? Currency { get; set; }
    public string PurchaserName { get; set; } = string.Empty;
    public string PurchaserEmail { get; set; } = string.Empty;
    public string RecipientName { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
    public string? PersonalMessage { get; set; }
    public string? DeliveryMethod { get; set; }
    public string? Theme { get; set; }
    public bool AllowPartialUse { get; set; } = true;
    public bool AllowMultipleServices { get; set; } = true;
    public DateTime? ExpiresAt { get; set; }
    public Guid SalonId { get; set; }
}
