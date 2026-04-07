using CRMKatia.Domain.Entities;

namespace CRMKatia.Domain.Interfaces;

public interface IFeedRepository : IRepository<FeedPost>
{
    Task<List<FeedPost>> GetPublishedAsync(string? type = null);
    Task<List<FeedPost>> GetBySalonAsync(Guid salonId);
}
