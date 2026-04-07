using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using CRMKatia.Infrastructure.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace CRMKatia.Infrastructure.Persistence.Repositories;

public class NotificationRepository : RepositoryBase<Notification>, INotificationRepository
{
    public NotificationRepository(ApplicationDbContext context) : base(context) { }

    public async Task<List<Notification>> GetByRecipientAsync(Guid recipientId, bool unreadOnly = false)
    {
        var query = DbSet
            .Where(n => n.RecipientId == recipientId);

        if (unreadOnly)
            query = query.Where(n => !n.Read);

        return await query
            .OrderByDescending(n => n.SentAt)
            .ToListAsync();
    }

    public async Task MarkAsReadAsync(Guid id)
    {
        var notification = await DbSet.FindAsync(id);
        if (notification is not null)
        {
            notification.Read = true;
            notification.ReadAt = DateTime.UtcNow;
        }
    }
}
