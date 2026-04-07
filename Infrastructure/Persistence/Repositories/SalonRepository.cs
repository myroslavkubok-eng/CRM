using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using CRMKatia.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CRMKatia.Infrastructure.Persistence.Repositories;

public class SalonRepository : RepositoryBase<Salon>, ISalonRepository
{
    public SalonRepository(ApplicationDbContext context) : base(context) { }

    public async Task<List<Salon>> GetByOwnerAsync(Guid ownerId)
    {
        return await DbSet
            .Where(s => s.OwnerId == ownerId)
            .Include(s => s.Services)
            .Include(s => s.Masters)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task<Salon?> GetWithDetailsAsync(Guid id)
    {
        return await DbSet
            .Include(s => s.Owner)
            .Include(s => s.Services)
            .Include(s => s.Masters)
                .ThenInclude(m => m.MasterServices)
                    .ThenInclude(ms => ms.Service)
            .Include(s => s.DepositSettings)
            .Include(s => s.GiftCards)
            .Include(s => s.FeedPosts)
            .FirstOrDefaultAsync(s => s.Id == id);
    }
}
