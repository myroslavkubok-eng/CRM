using CRMKatia.Domain.Entities;

namespace CRMKatia.Domain.Interfaces;

public interface ISupportMessageRepository : IRepository<SupportMessage>
{
    Task<List<SupportMessage>> GetByStatusAsync(string? status = null);
}
