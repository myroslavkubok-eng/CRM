namespace CRMKatia.Domain.Entities;

public class MasterService
{
    public Guid MasterId { get; set; }
    public Guid ServiceId { get; set; }
    public Master Master { get; set; } = null!;
    public Service Service { get; set; } = null!;
}
