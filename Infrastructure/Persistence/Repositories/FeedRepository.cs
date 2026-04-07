using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using CRMKatia.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CRMKatia.Infrastructure.Persistence.Repositories;

public class FeedRepository : RepositoryBase<FeedPost>, IFeedRepository
{
    public FeedRepository(ApplicationDbContext context) : base(context) { }

    public async Task<List<FeedPost>> GetPublishedAsync(string? type = null)
    {
        var query = DbSet
            .Include(fp => fp.Salon)
            .Where(fp => fp.PublishedToMainFeed);

        if (type == "service")
            query = query.Where(fp => fp.IsService);
        else if (type == "promotion")
            query = query.Where(fp => fp.IsPromoted);
        else if (type == "last_minute")
            query = query.Where(fp => fp.IsLastMinute);

        return await query
            .OrderByDescending(fp => fp.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<FeedPost>> GetBySalonAsync(Guid salonId)
    {
        return await DbSet
            .Include(fp => fp.Salon)
            .Where(fp => fp.SalonId == salonId)
            .OrderByDescending(fp => fp.CreatedAt)
            .ToListAsync();
    }
}
