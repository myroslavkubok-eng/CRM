using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

/// <summary>
/// Handles file uploads replacing Supabase Storage.
/// Files are stored in wwwroot/uploads.
/// </summary>
[ApiController]
[Route("api/storage")]
public class StorageController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<StorageController> _logger;

    private static readonly HashSet<string> AllowedTypes =
    [
        "image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"
    ];

    public StorageController(IWebHostEnvironment env, ILogger<StorageController> logger)
    {
        _env = env;
        _logger = logger;
    }

    [HttpPost("upload")]
    [AllowAnonymous]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB
    public async Task<ActionResult> Upload(IFormFile file, [FromForm] string? folder = null)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { error = "No file provided." });

        if (!AllowedTypes.Contains(file.ContentType))
            return BadRequest(new { error = $"Invalid file type: {file.ContentType}. Allowed: PNG, JPEG, WebP, SVG." });

        if (file.Length > 10 * 1024 * 1024)
            return BadRequest(new { error = "File too large. Maximum size is 10 MB." });

        var subFolder = string.IsNullOrWhiteSpace(folder) ? "general" : folder.Trim('/');
        var uploadDir = Path.Combine(_env.WebRootPath, "uploads", subFolder);
        Directory.CreateDirectory(uploadDir);

        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadDir, fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var relativePath = $"/uploads/{subFolder}/{fileName}";
        _logger.LogInformation("File uploaded: {Path}", relativePath);

        return Ok(new
        {
            filePath = relativePath,
            publicUrl = relativePath,
            uploadUrl = relativePath,
            token = (string?)null,
        });
    }

    [HttpDelete("delete")]
    [Authorize]
    public ActionResult Delete([FromBody] DeleteFileRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FilePath))
            return BadRequest(new { error = "No file path provided." });

        // Prevent path traversal
        var safePath = request.FilePath.TrimStart('/').Replace("..", string.Empty);
        var fullPath = Path.Combine(_env.WebRootPath, safePath.Replace('/', Path.DirectorySeparatorChar));

        if (!System.IO.File.Exists(fullPath))
            return NotFound(new { error = "File not found." });

        System.IO.File.Delete(fullPath);
        return Ok(new { success = true });
    }

    [HttpGet("images/{folder?}")]
    [AllowAnonymous]
    public ActionResult ListImages(string? folder = null)
    {
        var dir = string.IsNullOrWhiteSpace(folder)
            ? Path.Combine(_env.WebRootPath, "uploads")
            : Path.Combine(_env.WebRootPath, "uploads", folder);

        if (!Directory.Exists(dir))
            return Ok(new { files = Array.Empty<object>(), count = 0, folder = folder ?? "root" });

        var files = Directory.GetFiles(dir)
            .Select(f => new
            {
                name = Path.GetFileName(f),
                path = $"/uploads/{(string.IsNullOrWhiteSpace(folder) ? "" : folder + "/")}{Path.GetFileName(f)}",
                publicUrl = $"/uploads/{(string.IsNullOrWhiteSpace(folder) ? "" : folder + "/")}{Path.GetFileName(f)}",
                created_at = System.IO.File.GetCreationTimeUtc(f).ToString("o"),
                updated_at = System.IO.File.GetLastWriteTimeUtc(f).ToString("o"),
                size = new FileInfo(f).Length,
            })
            .ToList();

        return Ok(new { files, count = files.Count, folder = folder ?? "root" });
    }

    [HttpGet("status")]
    [AllowAnonymous]
    public ActionResult GetStatus()
    {
        var uploadsDir = Path.Combine(_env.WebRootPath, "uploads");
        Directory.CreateDirectory(uploadsDir);

        return Ok(new
        {
            status = "ok",
            uploadsPath = uploadsDir,
            exists = Directory.Exists(uploadsDir),
        });
    }

    [HttpPost("init")]
    [AllowAnonymous]
    public ActionResult Init()
    {
        var folders = new[] { "logos", "products", "certificates", "masters", "gallery", "avatars", "general" };
        foreach (var f in folders)
        {
            Directory.CreateDirectory(Path.Combine(_env.WebRootPath, "uploads", f));
        }
        return Ok(new { success = true, message = "Storage initialized." });
    }
}

public class DeleteFileRequest
{
    public string FilePath { get; set; } = string.Empty;
}
