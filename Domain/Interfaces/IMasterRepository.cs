using CRMKatia.Domain.Entities;

namespace CRMKatia.Domain.Interfaces;

public interface IMasterRepository : IRepository<Master>
{
    Task<List<Master>> GetBySalonAsync(Guid salonId);
    Task<Master?> GetByUserIdAsync(Guid userId);
    Task<Master?> GetWithServicesAsync(Guid id);
}
