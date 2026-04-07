using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using CRMKatia.Domain.Interfaces;
using CRMKatia.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CRMKatia.Infrastructure.Persistence.Repositories;

public class BookingRepository : RepositoryBase<Booking>, IBookingRepository
{
    public BookingRepository(ApplicationDbContext context) : base(context) { }

    public async Task<List<Booking>> GetBySalonAsync(Guid salonId, BookingStatus? status = null)
    {
        var query = DbSet
            .Where(b => b.SalonId == salonId)
            .Include(b => b.Master)
            .Include(b => b.Service)
            .Include(b => b.Client)
            .Include(b => b.Payment)
            .Include(b => b.StatusHistory)
            .AsQueryable();

        if (status.HasValue)
            query = query.Where(b => b.Status == status.Value);

        return await query
            .OrderByDescending(b => b.StartTime)
            .ToListAsync();
    }

    public async Task<List<Booking>> GetByMasterAsync(Guid masterId, DateTime? from = null, DateTime? to = null)
    {
        var query = DbSet
            .Where(b => b.MasterId == masterId)
            .Include(b => b.Service)
            .Include(b => b.Client)
            .Include(b => b.Payment)
            .AsQueryable();

        if (from.HasValue)
            query = query.Where(b => b.StartTime >= from.Value);

        if (to.HasValue)
            query = query.Where(b => b.EndTime <= to.Value);

        return await query
            .OrderBy(b => b.StartTime)
            .ToListAsync();
    }

    public async Task<bool> HasConflictAsync(Guid masterId, DateTime start, DateTime end, Guid? excludeId = null)
    {
        var query = DbSet
            .Where(b => b.MasterId == masterId)
            .Where(b => b.Status != BookingStatus.CancelledByClient
                     && b.Status != BookingStatus.CancelledBySalon
                     && b.Status != BookingStatus.DeclinedBySalon
                     && b.Status != BookingStatus.Expired
                     && b.Status != BookingStatus.NoShow)
            .Where(b => b.StartTime < end && b.EndTime > start);

        if (excludeId.HasValue)
            query = query.Where(b => b.Id != excludeId.Value);

        return await query.AnyAsync();
    }

    public async Task<List<Booking>> GetExpiredPendingAsync()
    {
        var now = DateTime.UtcNow;

        return await DbSet
            .Where(b => b.Status == BookingStatus.Pending)
            .Where(b => b.ConfirmationDeadline.HasValue && b.ConfirmationDeadline.Value < now)
            .Include(b => b.Master)
            .Include(b => b.Service)
            .Include(b => b.Payment)
            .ToListAsync();
    }
}
