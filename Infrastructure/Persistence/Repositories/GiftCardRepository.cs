using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using CRMKatia.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CRMKatia.Infrastructure.Persistence.Repositories;

public class GiftCardRepository : RepositoryBase<GiftCard>, IGiftCardRepository
{
    public GiftCardRepository(ApplicationDbContext context) : base(context) { }

    public async Task<GiftCard?> GetByCodeAsync(string code)
    {
        return await DbSet
            .Include(g => g.UsageHistory)
            .Include(g => g.Salon)
            .FirstOrDefaultAsync(g => g.Code == code);
    }

    public async Task<List<GiftCard>> GetBySalonAsync(Guid salonId)
    {
        return await DbSet
            .Where(g => g.SalonId == salonId)
            .Include(g => g.UsageHistory)
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();
    }
}
