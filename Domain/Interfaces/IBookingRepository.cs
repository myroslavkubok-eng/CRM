using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;

namespace CRMKatia.Domain.Interfaces;

public interface IBookingRepository : IRepository<Booking>
{
    Task<List<Booking>> GetBySalonAsync(Guid salonId, BookingStatus? status = null);
    Task<List<Booking>> GetByMasterAsync(Guid masterId, DateTime? from = null, DateTime? to = null);
    Task<bool> HasConflictAsync(Guid masterId, DateTime start, DateTime end, Guid? excludeId = null);
    Task<List<Booking>> GetExpiredPendingAsync();
}
