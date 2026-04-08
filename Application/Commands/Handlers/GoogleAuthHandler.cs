using CRMKatia.Application.Commands.Interfaces;
using CRMKatia.Application.Services;
using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CRMKatia.Application.Commands.Handlers;

public class GoogleAuthCommand : ICommand<AuthCommandResult>
{
    public string IdToken { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Client;
}

public class GoogleAuthHandler : ICommandHandler<GoogleAuthCommand, AuthCommandResult>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<GoogleAuthHandler> _logger;

    public GoogleAuthHandler(
        UserManager<User> userManager,
        IJwtTokenService jwtTokenService,
        IConfiguration configuration,
        ILogger<GoogleAuthHandler> logger)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<AuthCommandResult> HandleAsync(GoogleAuthCommand command)
    {
        var clientId = _configuration["Authentication:Google:ClientId"]
            ?? throw new InvalidOperationException("Authentication:Google:ClientId is not configured.");

        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(command.IdToken,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { clientId }
                });
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogWarning("Invalid Google ID token: {Message}", ex.Message);
            return AuthCommandResult.Fail("Invalid Google token.");
        }

        var email = payload.Email;
        if (string.IsNullOrEmpty(email))
            return AuthCommandResult.Fail("Google account does not have an email address.");

        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                UserName = email,
                Email = email,
                FirstName = payload.GivenName ?? string.Empty,
                LastName = payload.FamilyName ?? string.Empty,
                Role = command.Role,
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true
            };

            var createResult = await _userManager.CreateAsync(user);
            if (!createResult.Succeeded)
            {
                var errors = string.Join("; ", createResult.Errors.Select(e => e.Description));
                _logger.LogError("Failed to create user from Google OAuth: {Errors}", errors);
                return AuthCommandResult.Fail($"Account creation failed: {errors}");
            }

            await _userManager.AddToRoleAsync(user, command.Role.ToString());
            _logger.LogInformation("New user created via Google OAuth: {UserId}", user.Id);
        }

        user.LastLogin = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtTokenService.GenerateToken(user, roles);

        _logger.LogInformation("Google OAuth login successful for user: {UserId}", user.Id);
        return AuthCommandResult.Ok(token, user.Id, "Login successful.");
    }
}
