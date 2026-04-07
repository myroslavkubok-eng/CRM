using CRMKatia.Domain.Entities;

namespace CRMKatia.Domain.Interfaces;

public interface ILeadRepository : IRepository<Lead>
{
    Task<Lead?> GetByEmailAsync(string email);
}
