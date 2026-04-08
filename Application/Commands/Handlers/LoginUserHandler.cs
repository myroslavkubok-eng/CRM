using CRMKatia.Application.Commands.Interfaces;
using CRMKatia.Application.Services;
using CRMKatia.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CRMKatia.Application.Commands.Handlers;

public class LoginUserCommand : ICommand<AuthCommandResult>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginUserHandler : ICommandHandler<LoginUserCommand, AuthCommandResult>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly ILogger<LoginUserHandler> _logger;

    public LoginUserHandler(UserManager<User> userManager, IJwtTokenService jwtTokenService, ILogger<LoginUserHandler> logger)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _logger = logger;
    }

    public async Task<AuthCommandResult> HandleAsync(LoginUserCommand command)
    {
        _logger.LogInformation("Login attempt for email: {Email}", command.Email);
        
        var user = await _userManager.FindByEmailAsync(command.Email);

        if (user is null)
        {
            _logger.LogWarning("User not found for email: {Email}", command.Email);
            return AuthCommandResult.Fail("Invalid email or password.");
        }

        _logger.LogInformation("User found: {UserId}, checking password", user.Id);

        var isValidPassword = await _userManager.CheckPasswordAsync(user, command.Password);

        if (!isValidPassword)
        {
            _logger.LogWarning("Invalid password for user: {UserId}", user.Id);
            return AuthCommandResult.Fail("Invalid email or password.");
        }

        _logger.LogInformation("Password valid for user: {UserId}, updating last login", user.Id);

        user.LastLogin = DateTime.UtcNow;
        var updateResult = await _userManager.UpdateAsync(user);
        
        if (!updateResult.Succeeded)
        {
            _logger.LogWarning("Failed to update last login for user: {UserId}. Errors: {Errors}", 
                user.Id, string.Join(", ", updateResult.Errors.Select(e => e.Description)));
        }

        var roles = await _userManager.GetRolesAsync(user);
        _logger.LogInformation("User {UserId} has roles: {Roles}", user.Id, string.Join(", ", roles));
        
        var token = _jwtTokenService.GenerateToken(user, roles);
        _logger.LogInformation("Login successful for user: {UserId}", user.Id);

        return AuthCommandResult.Ok(token, user.Id, "Login successful.");
    }
}
