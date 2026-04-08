using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("attendance")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IRepository<Attendance> _attendanceRepository;
    private readonly IMasterRepository _masterRepository;

    public AttendanceController(IRepository<Attendance> attendanceRepository, IMasterRepository masterRepository)
    {
        _attendanceRepository = attendanceRepository;
        _masterRepository = masterRepository;
    }

    [HttpGet("salon/{salonId:guid}")]
    public async Task<ActionResult> GetBySalon(Guid salonId, [FromQuery] DateTime? date)
    {
        var allAttendance = await _attendanceRepository.GetAllAsync();
        var attendance = allAttendance
            .Where(a => a.SalonId == salonId)
            .Where(a => !date.HasValue || a.Date.Date == date.Value.Date)
            .ToList();

        var present = attendance.Count(a => a.Status == "present");
        var absent = attendance.Count(a => a.Status == "absent");
        var late = attendance.Count(a => a.Status == "late");
        var leave = attendance.Count(a => a.Status == "leave");

        return Ok(new
        {
            attendance = attendance.Select(MapToDto),
            present,
            absent,
            late,
            leave,
            totalCount = attendance.Count
        });
    }

    [HttpGet("master/{masterId:guid}")]
    public async Task<ActionResult> GetByMaster(Guid masterId, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var allAttendance = await _attendanceRepository.GetAllAsync();
        var attendance = allAttendance
            .Where(a => a.MasterId == masterId)
            .Where(a => !startDate.HasValue || a.Date >= startDate.Value)
            .Where(a => !endDate.HasValue || a.Date <= endDate.Value)
            .OrderByDescending(a => a.Date)
            .ToList();

        return Ok(new { attendance = attendance.Select(MapToDto), totalCount = attendance.Count });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var attendance = await _attendanceRepository.GetByIdAsync(id);
        if (attendance == null)
            return NotFound(new { message = "Attendance record not found" });

        return Ok(MapToDto(attendance));
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateAttendanceRequest request)
    {
        var attendance = new Attendance
        {
            Id = Guid.NewGuid(),
            MasterId = request.MasterId,
            SalonId = request.SalonId,
            Date = request.Date,
            CheckIn = request.CheckIn,
            CheckOut = request.CheckOut,
            Status = request.Status,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow
        };

        if (attendance.CheckIn.HasValue && attendance.CheckOut.HasValue)
        {
            attendance.WorkingHours = attendance.CheckOut.Value - attendance.CheckIn.Value;
        }

        await _attendanceRepository.AddAsync(attendance);
        await _attendanceRepository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = attendance.Id }, MapToDto(attendance));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateAttendanceRequest request)
    {
        var attendance = await _attendanceRepository.GetByIdAsync(id);
        if (attendance == null)
            return NotFound(new { message = "Attendance record not found" });

        if (request.CheckIn.HasValue) attendance.CheckIn = request.CheckIn;
        if (request.CheckOut.HasValue) attendance.CheckOut = request.CheckOut;
        if (request.Status != null) attendance.Status = request.Status;
        if (request.Notes != null) attendance.Notes = request.Notes;
        attendance.UpdatedAt = DateTime.UtcNow;

        if (attendance.CheckIn.HasValue && attendance.CheckOut.HasValue)
        {
            attendance.WorkingHours = attendance.CheckOut.Value - attendance.CheckIn.Value;
        }

        _attendanceRepository.Update(attendance);
        await _attendanceRepository.SaveChangesAsync();

        return Ok(MapToDto(attendance));
    }

    [HttpPost("mark-present/{masterId:guid}")]
    public async Task<ActionResult> MarkPresent(Guid masterId, Guid salonId)
    {
        var today = DateTime.UtcNow.Date;
        var allAttendance = await _attendanceRepository.GetAllAsync();
        var existing = allAttendance
            .FirstOrDefault(a => a.MasterId == masterId && a.Date.Date == today);

        if (existing != null)
        {
            existing.Status = "present";
            existing.CheckIn = DateTime.UtcNow;
            existing.UpdatedAt = DateTime.UtcNow;
            _attendanceRepository.Update(existing);
        }
        else
        {
            var attendance = new Attendance
            {
                Id = Guid.NewGuid(),
                MasterId = masterId,
                SalonId = salonId,
                Date = today,
                Status = "present",
                CheckIn = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };
            await _attendanceRepository.AddAsync(attendance);
        }

        await _attendanceRepository.SaveChangesAsync();
        return Ok(new { message = "Attendance marked as present" });
    }

    [HttpPost("mark-absent/{masterId:guid}")]
    public async Task<ActionResult> MarkAbsent(Guid masterId, Guid salonId)
    {
        var today = DateTime.UtcNow.Date;
        var allAttendance = await _attendanceRepository.GetAllAsync();
        var existing = allAttendance
            .FirstOrDefault(a => a.MasterId == masterId && a.Date.Date == today);

        if (existing != null)
        {
            existing.Status = "absent";
            existing.UpdatedAt = DateTime.UtcNow;
            _attendanceRepository.Update(existing);
        }
        else
        {
            var attendance = new Attendance
            {
                Id = Guid.NewGuid(),
                MasterId = masterId,
                SalonId = salonId,
                Date = today,
                Status = "absent",
                CreatedAt = DateTime.UtcNow
            };
            await _attendanceRepository.AddAsync(attendance);
        }

        await _attendanceRepository.SaveChangesAsync();
        return Ok(new { message = "Attendance marked as absent" });
    }

    private static object MapToDto(Attendance a) => new
    {
        a.Id,
        a.MasterId,
        a.SalonId,
        a.Date,
        a.CheckIn,
        a.CheckOut,
        a.Status,
        a.Notes,
        WorkingHours = a.WorkingHours?.ToString(@"hh\:mm") ?? "0:00",
        a.CreatedAt
    };
}