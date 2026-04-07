using CRMKatia.Domain.Enums;

namespace CRMKatia.Domain.Entities;

public class DepositSettings
{
    public Guid Id { get; set; }
    public bool DepositEnabled { get; set; }
    public DepositType DepositType { get; set; } = DepositType.None;
    public decimal? FixedAmount { get; set; }
    public decimal? PercentageAmount { get; set; }
    public decimal? MinDepositAmount { get; set; }
    public decimal? MaxDepositAmount { get; set; }
    public bool AllowPayInSalon { get; set; } = true;
    public bool AllowFullPayment { get; set; } = true;
    public bool RequireDepositForNewClients { get; set; }
    public bool CancellationPolicyEnabled { get; set; } = true;
    public int FullRefundHours { get; set; } = 24;
    public int PartialRefundHours { get; set; } = 12;
    public decimal PartialRefundPercent { get; set; } = 50;
    public bool NoShowRefund { get; set; }
    public decimal NoShowPenalty { get; set; }
    public bool AllowReschedule { get; set; } = true;
    public int RescheduleHours { get; set; } = 6;
    public int RescheduleLimit { get; set; } = 2;
    public bool StripeConnected { get; set; }
    public string? StripeAccountId { get; set; }
    public decimal PlatformFeePercent { get; set; } = 3;
    public string? CustomMessage { get; set; }
    public bool AutoReminders { get; set; } = true;
    public List<int> ReminderHoursBefore { get; set; } = [24, 6, 1];
    public Guid SalonId { get; set; }
    public Salon Salon { get; set; } = null!;
}
