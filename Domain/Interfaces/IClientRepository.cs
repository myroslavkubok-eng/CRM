using CRMKatia.Domain.Entities;

namespace CRMKatia.Domain.Interfaces;

public interface IClientRepository : IRepository<Client>
{
    Task<List<Client>> GetBySalonAsync(Guid salonId);
    Task<Client?> GetByEmailAndSalonAsync(string email, Guid salonId);
}
