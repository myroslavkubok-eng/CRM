using CRMKatia.Domain.Entities;

namespace CRMKatia.Domain.Interfaces;

public interface INotificationRepository : IRepository<Notification>
{
    Task<List<Notification>> GetByRecipientAsync(Guid recipientId, bool unreadOnly = false);
    Task MarkAsReadAsync(Guid id);
}
