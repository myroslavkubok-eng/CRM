using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("analytics")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IClientRepository _clientRepository;
    private readonly ISalonRepository _salonRepository;
    private readonly IMasterRepository _masterRepository;

    public AnalyticsController(
        IBookingRepository bookingRepository,
        IClientRepository clientRepository,
        ISalonRepository salonRepository,
        IMasterRepository masterRepository)
    {
        _bookingRepository = bookingRepository;
        _clientRepository = clientRepository;
        _salonRepository = salonRepository;
        _masterRepository = masterRepository;
    }

    [HttpGet("salon/{salonId:guid}/overview")]
    public async Task<ActionResult> GetOverview(Guid salonId)
    {
        var today = DateTime.UtcNow.Date;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek);

        var bookings = await _bookingRepository.GetBySalonAsync(salonId);
        var clients = await _clientRepository.GetBySalonAsync(salonId);
        var salon = await _salonRepository.GetByIdAsync(salonId);
        var masters = await _masterRepository.GetBySalonAsync(salonId);

        var todayBookings = bookings.Count(b => b.StartTime.Date == today);
        var weekBookings = bookings.Count(b => b.StartTime.Date >= startOfWeek && b.StartTime.Date <= today);
        var monthBookings = bookings.Count(b => b.StartTime >= startOfMonth);

        var completedBookings = bookings.Where(b => b.Status == BookingStatus.Completed).ToList();
        
        // Calculate revenue from service prices (approximation since Booking doesn't have TotalPrice)
        var monthRevenue = completedBookings
            .Where(b => b.StartTime >= startOfMonth)
            .Sum(b => b.Service?.Price ?? 0);

        var pendingBookings = bookings.Count(b => b.Status == BookingStatus.Pending);
        var confirmedBookings = bookings.Count(b => b.Status == BookingStatus.Confirmed);
        
        // Calculate average rating from masters
        var avgRating = masters.Count > 0 ? masters.Average(m => m.Rating) : 0;

        return Ok(new
        {
            todayBookings,
            weekBookings,
            monthBookings,
            totalClients = clients.Count(),
            totalRevenue = completedBookings.Sum(b => b.Service?.Price ?? 0),
            monthRevenue,
            pendingBookings,
            confirmedBookings,
            totalMasters = masters.Count(),
            salonRating = avgRating,
            completedBookings = completedBookings.Count
        });
    }

    [HttpGet("salon/{salonId:guid}/revenue")]
    public async Task<ActionResult> GetRevenue(Guid salonId, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;

        var bookings = await _bookingRepository.GetBySalonAsync(salonId);
        var filteredBookings = bookings
            .Where(b => b.StartTime >= start && b.StartTime <= end && b.Status == BookingStatus.Completed)
            .ToList();

        var dailyRevenue = filteredBookings
            .GroupBy(b => b.StartTime.Date)
            .Select(g => new { date = g.Key, revenue = g.Sum(b => b.Service?.Price ?? 0), bookings = g.Count() })
            .OrderBy(x => x.date)
            .ToList();

        var serviceRevenue = filteredBookings
            .Where(b => b.ServiceId != Guid.Empty)
            .GroupBy(b => b.ServiceId)
            .Select(g => new { serviceId = g.Key, revenue = g.Sum(b => b.Service?.Price ?? 0), count = g.Count() })
            .OrderByDescending(x => x.revenue)
            .ToList();

        var totalRevenue = filteredBookings.Sum(b => b.Service?.Price ?? 0);

        return Ok(new
        {
            totalRevenue,
            averagePerBooking = filteredBookings.Count > 0 ? totalRevenue / filteredBookings.Count : 0,
            dailyRevenue,
            serviceRevenue,
            startDate = start,
            endDate = end
        });
    }

    [HttpGet("salon/{salonId:guid}/bookings-stats")]
    public async Task<ActionResult> GetBookingStats(Guid salonId, [FromQuery] int days = 30)
    {
        var startDate = DateTime.UtcNow.AddDays(-days);
        var bookings = await _bookingRepository.GetBySalonAsync(salonId);

        var filteredBookings = bookings.Where(b => b.StartTime >= startDate).ToList();

        var statusBreakdown = filteredBookings
            .GroupBy(b => b.Status)
            .Select(g => new { status = g.Key.ToString(), count = g.Count() })
            .ToList();

        var dailyBookings = filteredBookings
            .GroupBy(b => b.StartTime.Date)
            .Select(g => new { date = g.Key, count = g.Count() })
            .OrderBy(x => x.date)
            .ToList();

        var hourlyDistribution = filteredBookings
            .GroupBy(b => b.StartTime.Hour)
            .Select(g => new { hour = g.Key, count = g.Count() })
            .OrderBy(x => x.hour)
            .ToList();

        var totalCancelled = filteredBookings.Count(b => 
            b.Status == BookingStatus.CancelledByClient || b.Status == BookingStatus.CancelledBySalon);
        
        return Ok(new
        {
            totalBookings = filteredBookings.Count,
            statusBreakdown,
            dailyBookings,
            hourlyDistribution,
            cancellationRate = filteredBookings.Count > 0 
                ? (double)totalCancelled / filteredBookings.Count * 100 
                : 0
        });
    }

    [HttpGet("salon/{salonId:guid}/client-stats")]
    public async Task<ActionResult> GetClientStats(Guid salonId)
    {
        var clients = await _clientRepository.GetBySalonAsync(salonId);

        var newClientsThisMonth = clients.Count(c => c.CreatedAt.Month == DateTime.UtcNow.Month && c.CreatedAt.Year == DateTime.UtcNow.Year);
        var activeClients = clients.Count(c => c.TotalBookings > 0);
        var vipClients = clients.Count(c => c.TotalSpent >= 500);

        var topClients = clients
            .OrderByDescending(c => c.TotalSpent)
            .Take(10)
            .Select(c => new
            {
                c.Id,
                c.FirstName,
                c.LastName,
                c.Email,
                c.TotalBookings,
                c.TotalSpent,
                c.LastVisit
            })
            .ToList();

        var clientGrowth = clients
            .GroupBy(c => new { c.CreatedAt.Year, c.CreatedAt.Month })
            .Select(g => new { year = g.Key.Year, month = g.Key.Month, count = g.Count() })
            .OrderBy(x => x.year)
            .ThenBy(x => x.month)
            .ToList();

        return Ok(new
        {
            totalClients = clients.Count(),
            newClientsThisMonth,
            activeClients,
            vipClients,
            topClients,
            clientGrowth,
            averageBookingsPerClient = clients.Count > 0 ? clients.Average(c => c.TotalBookings) : 0,
            averageSpendPerClient = clients.Count > 0 ? clients.Average(c => c.TotalSpent) : 0
        });
    }

    [HttpGet("salon/{salonId:guid}/master-performance")]
    public async Task<ActionResult> GetMasterPerformance(Guid salonId)
    {
        var masters = await _masterRepository.GetBySalonAsync(salonId);
        var bookings = await _bookingRepository.GetBySalonAsync(salonId);

        var masterStats = masters.Select(m => {
            var masterBookings = bookings.Where(b => b.MasterId == m.Id).ToList();
            var completedBookings = masterBookings.Where(b => b.Status == BookingStatus.Completed).ToList();
            var revenue = completedBookings.Sum(b => b.Service?.Price ?? 0);
            var cancelledBookings = masterBookings.Count(b => 
                b.Status == BookingStatus.CancelledByClient || b.Status == BookingStatus.CancelledBySalon);

            return new
            {
                masterId = m.Id,
                masterName = $"{m.FirstName} {m.LastName}",
                totalBookings = masterBookings.Count,
                completedBookings = completedBookings.Count,
                cancelledBookings,
                revenue,
                rating = m.Rating,
                target = m.MonthlyTarget,
                performancePercentage = m.MonthlyTarget > 0 ? (double)revenue / (double)m.MonthlyTarget * 100 : 0
            };
        }).OrderByDescending(m => m.revenue).ToList();

        return Ok(new
        {
            masters = masterStats,
            totalRevenue = masterStats.Sum(m => m.revenue),
            averageRating = masters.Count > 0 ? masters.Average(m => m.Rating) : 0
        });
    }
}