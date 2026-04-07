using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using CRMKatia.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CRMKatia.Infrastructure.Persistence.Repositories;

public class MasterRepository : RepositoryBase<Master>, IMasterRepository
{
    public MasterRepository(ApplicationDbContext context) : base(context) { }

    public async Task<List<Master>> GetBySalonAsync(Guid salonId)
    {
        return await DbSet
            .Where(m => m.SalonId == salonId)
            .Include(m => m.MasterServices)
                .ThenInclude(ms => ms.Service)
            .OrderBy(m => m.FirstName)
            .ToListAsync();
    }

    public async Task<Master?> GetByUserIdAsync(Guid userId)
    {
        return await DbSet
            .Include(m => m.Salon)
            .FirstOrDefaultAsync(m => m.UserId == userId);
    }

    public async Task<Master?> GetWithServicesAsync(Guid id)
    {
        return await DbSet
            .Include(m => m.MasterServices)
                .ThenInclude(ms => ms.Service)
            .FirstOrDefaultAsync(m => m.Id == id);
    }
}
