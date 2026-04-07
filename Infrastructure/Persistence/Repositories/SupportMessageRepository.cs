using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using CRMKatia.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CRMKatia.Infrastructure.Persistence.Repositories;

public class SupportMessageRepository : RepositoryBase<SupportMessage>, ISupportMessageRepository
{
    public SupportMessageRepository(ApplicationDbContext context) : base(context) { }

    public async Task<List<SupportMessage>> GetByStatusAsync(string? status = null)
    {
        var query = DbSet.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(m => m.Status == status);

        return await query
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
    }

    public override async Task<List<SupportMessage>> GetAllAsync()
    {
        return await DbSet
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
    }
}
