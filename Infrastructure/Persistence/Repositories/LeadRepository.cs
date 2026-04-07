using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using CRMKatia.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CRMKatia.Infrastructure.Persistence.Repositories;

public class LeadRepository : RepositoryBase<Lead>, ILeadRepository
{
    public LeadRepository(ApplicationDbContext context) : base(context) { }

    public async Task<Lead?> GetByEmailAsync(string email)
    {
        return await DbSet
            .FirstOrDefaultAsync(l => l.Email.ToLower() == email.ToLower());
    }

    public override async Task<List<Lead>> GetAllAsync()
    {
        return await DbSet
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();
    }
}
