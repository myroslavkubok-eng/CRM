using CRMKatia.Domain.Entities;

namespace CRMKatia.Domain.Interfaces;

public interface IGiftCardRepository : IRepository<GiftCard>
{
    Task<GiftCard?> GetByCodeAsync(string code);
    Task<List<GiftCard>> GetBySalonAsync(Guid salonId);
}
