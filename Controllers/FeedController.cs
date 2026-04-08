using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("feed")]
public class FeedController : ControllerBase
{
    private readonly IFeedRepository _feedRepository;
    private readonly ISalonRepository _salonRepository;

    public FeedController(IFeedRepository feedRepository, ISalonRepository salonRepository)
    {
        _feedRepository = feedRepository;
        _salonRepository = salonRepository;
    }

    [HttpGet("posts")]
    [AllowAnonymous]
    public async Task<ActionResult> GetPosts([FromQuery] string? type = null)
    {
        var posts = await _feedRepository.GetPublishedAsync(type);
        return Ok(new { posts = posts.Select(MapToDto).ToList(), count = posts.Count });
    }

    [HttpGet("posts/{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult> GetPost(Guid id)
    {
        var post = await _feedRepository.GetByIdAsync(id);
        if (post is null) return NotFound();
        return Ok(MapToDto(post));
    }

    [HttpGet("salon/{salonId:guid}/posts")]
    [Authorize]
    public async Task<ActionResult> GetBySalon(Guid salonId)
    {
        var posts = await _feedRepository.GetBySalonAsync(salonId);
        return Ok(new { posts = posts.Select(MapToDto).ToList(), count = posts.Count });
    }

    [HttpPost("posts")]
    [Authorize]
    public async Task<ActionResult> CreatePost([FromBody] CreateFeedPostRequest request)
    {
        var salon = await _salonRepository.GetByIdAsync(request.SalonId);
        if (salon is null) return BadRequest(new { error = "Salon not found." });

        var post = new FeedPost
        {
            Id = Guid.NewGuid(),
            ImageUrl = request.ImageUrl,
            Caption = request.Caption,
            IsService = request.IsService,
            ServiceName = request.ServiceName,
            ServiceCategory = request.ServiceCategory,
            OriginalPrice = request.OriginalPrice,
            Discount = request.Discount,
            Currency = request.Currency ?? "AED",
            IsLastMinute = request.IsLastMinute,
            IsPromoted = request.IsPromoted,
            Duration = request.Duration,
            ServiceDescription = request.ServiceDescription,
            PublishedToMainFeed = request.PublishedToMainFeed,
            SalonId = request.SalonId,
            ServiceId = request.ServiceId,
        };

        await _feedRepository.AddAsync(post);
        await _feedRepository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPost), new { id = post.Id }, MapToDto(post));
    }

    [HttpDelete("posts/{id:guid}")]
    [Authorize]
    public async Task<ActionResult> DeletePost(Guid id)
    {
        var post = await _feedRepository.GetByIdAsync(id);
        if (post is null) return NotFound();

        _feedRepository.Remove(post);
        await _feedRepository.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("posts/{id:guid}/like")]
    [AllowAnonymous]
    public async Task<ActionResult> LikePost(Guid id)
    {
        var post = await _feedRepository.GetByIdAsync(id);
        if (post is null) return NotFound();

        post.Likes++;
        _feedRepository.Update(post);
        await _feedRepository.SaveChangesAsync();

        return Ok(new { likes = post.Likes });
    }

    private static object MapToDto(FeedPost fp) => new
    {
        fp.Id,
        fp.ImageUrl,
        fp.Caption,
        fp.Likes,
        fp.Comments,
        fp.Shares,
        fp.IsService,
        fp.ServiceName,
        fp.ServiceCategory,
        fp.OriginalPrice,
        fp.Discount,
        fp.Currency,
        fp.IsLastMinute,
        fp.IsPromoted,
        fp.Duration,
        fp.ServiceDescription,
        fp.PublishedToMainFeed,
        fp.SalonId,
        fp.ServiceId,
        fp.CreatedAt,
        salon = fp.Salon is null ? null : new
        {
            fp.Salon.Id,
            fp.Salon.Name,
            fp.Salon.Logo,
        }
    };
}

public class CreateFeedPostRequest
{
    public string ImageUrl { get; set; } = string.Empty;
    public string? Caption { get; set; }
    public bool IsService { get; set; }
    public string? ServiceName { get; set; }
    public string? ServiceCategory { get; set; }
    public decimal? OriginalPrice { get; set; }
    public decimal? Discount { get; set; }
    public string? Currency { get; set; }
    public bool IsLastMinute { get; set; }
    public bool IsPromoted { get; set; }
    public int? Duration { get; set; }
    public string? ServiceDescription { get; set; }
    public bool PublishedToMainFeed { get; set; }
    public Guid SalonId { get; set; }
    public Guid? ServiceId { get; set; }
}
