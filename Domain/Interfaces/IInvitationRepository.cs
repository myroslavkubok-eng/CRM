using CRMKatia.Domain.Entities;

namespace CRMKatia.Domain.Interfaces;

public interface IInvitationRepository : IRepository<SalonInvitation>
{
    Task<SalonInvitation?> GetByTokenAsync(string token);
    Task<List<SalonInvitation>> GetBySalonAsync(Guid salonId);
}
