using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using CRMKatia.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CRMKatia.Infrastructure.Persistence.Repositories;

public class InvitationRepository : RepositoryBase<SalonInvitation>, IInvitationRepository
{
    public InvitationRepository(ApplicationDbContext context) : base(context) { }

    public async Task<SalonInvitation?> GetByTokenAsync(string token)
    {
        return await DbSet
            .Include(i => i.Salon)
            .FirstOrDefaultAsync(i => i.Token == token);
    }

    public async Task<List<SalonInvitation>> GetBySalonAsync(Guid salonId)
    {
        return await DbSet
            .Where(i => i.SalonId == salonId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
    }
}
