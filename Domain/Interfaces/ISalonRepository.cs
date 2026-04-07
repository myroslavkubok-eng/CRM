using CRMKatia.Domain.Entities;

namespace CRMKatia.Domain.Interfaces;

public interface ISalonRepository : IRepository<Salon>
{
    Task<List<Salon>> GetByOwnerAsync(Guid ownerId);
    Task<Salon?> GetWithDetailsAsync(Guid id);
}
