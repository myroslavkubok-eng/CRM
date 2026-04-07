using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using CRMKatia.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CRMKatia.Infrastructure.Persistence.Repositories;

public class ClientRepository : RepositoryBase<Client>, IClientRepository
{
    public ClientRepository(ApplicationDbContext context) : base(context) { }

    public async Task<List<Client>> GetBySalonAsync(Guid salonId)
    {
        return await DbSet
            .Where(c => c.SalonId == salonId)
            .Include(c => c.Bookings)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<Client?> GetByEmailAndSalonAsync(string email, Guid salonId)
    {
        return await DbSet
            .Include(c => c.Bookings)
            .FirstOrDefaultAsync(c => c.Email == email && c.SalonId == salonId);
    }
}
