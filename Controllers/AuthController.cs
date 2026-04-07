using CRMKatia.Application.Commands.Handlers;
using CRMKatia.Application.Commands.Interfaces;
using CRMKatia.Domain.DTOs;
using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ICommandDispatcher _commandDispatcher;
    private readonly UserManager<User> _userManager;

    public AuthController(ICommandDispatcher commandDispatcher, UserManager<User> userManager)
    {
        _commandDispatcher = commandDispatcher;
        _userManager = userManager;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (!Enum.TryParse<UserRole>(request.Role, true, out var role))
            return BadRequest(new AuthResponse { Success = false, Message = "Invalid role specified." });

        var command = new RegisterUserCommand
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Password = request.Password,
            Phone = request.Phone,
            Role = role
        };

        var result = await _commandDispatcher.DispatchAsync(command);

        if (!result.Success)
            return BadRequest(new AuthResponse { Success = false, Message = result.Message });

        var user = await _userManager.FindByIdAsync(result.UserId.ToString()!);

        return Ok(new AuthResponse
        {
            Success = true,
            Token = result.Token,
            Message = result.Message,
            User = user is not null ? MapToUserDto(user) : null
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var command = new LoginUserCommand
        {
            Email = request.Email,
            Password = request.Password
        };

        var result = await _commandDispatcher.DispatchAsync(command);

        if (!result.Success)
            return Unauthorized(new AuthResponse { Success = false, Message = result.Message });

        var user = await _userManager.FindByIdAsync(result.UserId.ToString()!);

        return Ok(new AuthResponse
        {
            Success = true,
            Token = result.Token,
            Message = result.Message,
            User = user is not null ? MapToUserDto(user) : null
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // JWT is stateless; logout is handled client-side by discarding the token.
        return Ok(new { Message = "Logged out successfully." });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim is null)
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userIdClaim);
        if (user is null)
            return NotFound();

        return Ok(MapToUserDto(user));
    }

    private static UserDto MapToUserDto(User user) => new()
    {
        Id = user.Id,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Email = user.Email ?? string.Empty,
        Phone = user.Phone,
        Role = user.Role.ToString(),
        CreatedAt = user.CreatedAt
    };
}
