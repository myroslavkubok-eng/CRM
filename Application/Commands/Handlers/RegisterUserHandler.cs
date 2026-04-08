using CRMKatia.Application.Commands.Interfaces;
using CRMKatia.Application.Services;
using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CRMKatia.Application.Commands.Handlers;

public class RegisterUserCommand : ICommand<AuthCommandResult>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public UserRole Role { get; set; } = UserRole.Client;
}

public class AuthCommandResult
{
    public bool Success { get; set; }
    public string? Token { get; set; }
    public string Message { get; set; } = string.Empty;
    public Guid? UserId { get; set; }

    public static AuthCommandResult Ok(string token, Guid userId, string message = "Registration successful.")
        => new() { Success = true, Token = token, UserId = userId, Message = message };

    public static AuthCommandResult Fail(string message)
        => new() { Success = false, Message = message };
}

public class RegisterUserHandler : ICommandHandler<RegisterUserCommand, AuthCommandResult>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly ILogger<RegisterUserHandler> _logger;

    public RegisterUserHandler(UserManager<User> userManager, IJwtTokenService jwtTokenService, ILogger<RegisterUserHandler> logger)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _logger = logger;
    }

    public async Task<AuthCommandResult> HandleAsync(RegisterUserCommand command)
    {
        _logger.LogInformation("Registration attempt for email: {Email}, role: {Role}", command.Email, command.Role);

        var existingUser = await _userManager.FindByEmailAsync(command.Email);
        if (existingUser is not null)
        {
            _logger.LogWarning("User already exists with email: {Email}", command.Email);
            return AuthCommandResult.Fail("A user with this email already exists.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = command.Email,
            Email = command.Email,
            FirstName = command.FirstName,
            LastName = command.LastName,
            Phone = command.Phone,
            Role = command.Role,
            CreatedAt = DateTime.UtcNow
        };

        _logger.LogInformation("Creating user with email: {Email}", command.Email);
        var result = await _userManager.CreateAsync(user, command.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            _logger.LogError("User creation failed for {Email}. Errors: {Errors}", command.Email, errors);
            return AuthCommandResult.Fail($"Registration failed: {errors}");
        }

        _logger.LogInformation("User created successfully: {UserId}. Assigning role: {Role}", user.Id, command.Role);
        var roleName = command.Role.ToString();
        var roleResult = await _userManager.AddToRoleAsync(user, roleName);
        
        if (!roleResult.Succeeded)
        {
            var errors = string.Join("; ", roleResult.Errors.Select(e => e.Description));
            _logger.LogError("Role assignment failed for user {UserId}. Errors: {Errors}", user.Id, errors);
            return AuthCommandResult.Fail($"User created but role assignment failed: {errors}");
        }

        _logger.LogInformation("Role assigned successfully for user: {UserId}", user.Id);
        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtTokenService.GenerateToken(user, roles);

        return AuthCommandResult.Ok(token, user.Id);
    }
}
