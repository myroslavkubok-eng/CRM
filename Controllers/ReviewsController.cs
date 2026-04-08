using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("reviews")]
[Authorize]
public class ReviewsController : ControllerBase
{
    private readonly IRepository<Review> _reviewRepository;
    private readonly ISalonRepository _salonRepository;

    public ReviewsController(IRepository<Review> reviewRepository, ISalonRepository salonRepository)
    {
        _reviewRepository = reviewRepository;
        _salonRepository = salonRepository;
    }

    [HttpGet("salon/{salonId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult> GetBySalon(Guid salonId)
    {
        var allReviews = await _reviewRepository.GetAllAsync();
        var reviews = allReviews.Where(r => r.SalonId == salonId).ToList();
        return Ok(new { reviews = reviews.Select(MapToDto), totalCount = reviews.Count });
    }

    [HttpGet("master/{masterId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult> GetByMaster(Guid masterId)
    {
        var allReviews = await _reviewRepository.GetAllAsync();
        var reviews = allReviews.Where(r => r.MasterId == masterId).ToList();
        return Ok(new { reviews = reviews.Select(MapToDto), totalCount = reviews.Count });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var review = await _reviewRepository.GetByIdAsync(id);
        if (review == null)
            return NotFound(new { message = "Review not found" });

        return Ok(MapToDto(review));
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateReviewRequest request)
    {
        var review = new Review
        {
            Id = Guid.NewGuid(),
            SalonId = request.SalonId,
            ClientId = request.ClientId,
            MasterId = request.MasterId,
            BookingId = request.BookingId,
            ClientName = request.ClientName,
            Title = request.Title,
            Comment = request.Comment,
            Rating = request.Rating,
            ServiceRating = request.ServiceRating,
            CleanlinessRating = request.CleanlinessRating,
            ValueRating = request.ValueRating,
            IsPublic = request.IsPublic,
            CreatedAt = DateTime.UtcNow
        };

        await _reviewRepository.AddAsync(review);
        await _reviewRepository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = review.Id }, MapToDto(review));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateReviewRequest request)
    {
        var review = await _reviewRepository.GetByIdAsync(id);
        if (review == null)
            return NotFound(new { message = "Review not found" });

        if (request.Title != null) review.Title = request.Title;
        if (request.Comment != null) review.Comment = request.Comment;
        if (request.Rating.HasValue) review.Rating = request.Rating.Value;
        if (request.ServiceRating.HasValue) review.ServiceRating = request.ServiceRating;
        if (request.CleanlinessRating.HasValue) review.CleanlinessRating = request.CleanlinessRating;
        if (request.ValueRating.HasValue) review.ValueRating = request.ValueRating;
        if (request.IsPublic.HasValue) review.IsPublic = request.IsPublic.Value;
        review.UpdatedAt = DateTime.UtcNow;

        _reviewRepository.Update(review);
        await _reviewRepository.SaveChangesAsync();

        return Ok(MapToDto(review));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var review = await _reviewRepository.GetByIdAsync(id);
        if (review == null)
            return NotFound(new { message = "Review not found" });

        _reviewRepository.Remove(review);
        await _reviewRepository.SaveChangesAsync();

        return NoContent();
    }

    private static object MapToDto(Review r) => new
    {
        r.Id,
        r.SalonId,
        r.ClientId,
        r.MasterId,
        r.BookingId,
        r.ClientName,
        r.Title,
        r.Comment,
        r.Rating,
        r.ServiceRating,
        r.CleanlinessRating,
        r.ValueRating,
        r.IsPublic,
        r.CreatedAt
    };
}