namespace CRMKatia.Domain.Enums;

public enum BookingStatus
{
    Pending,
    Confirmed,
    RescheduledPending,
    DeclinedBySalon,
    CancelledByClient,
    CancelledBySalon,
    Completed,
    NoShow,
    Expired
}
