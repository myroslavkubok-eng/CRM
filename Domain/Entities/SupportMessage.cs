namespace CRMKatia.Domain.Entities;

public class SupportMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = "open";       // open | in_progress | resolved | closed
    public string Priority { get; set; } = "normal";   // low | normal | high | urgent
    public string? InternalNotes { get; set; }
    public Guid? UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
