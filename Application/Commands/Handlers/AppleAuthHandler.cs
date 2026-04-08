using System.IdentityModel.Tokens.Jwt;
using CRMKatia.Application.Commands.Interfaces;
using CRMKatia.Application.Services;
using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace CRMKatia.Application.Commands.Handlers;

public class AppleAuthCommand : ICommand<AuthCommandResult>
{
    public string IdToken { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public UserRole Role { get; set; } = UserRole.Client;
}

public class AppleAuthHandler : ICommandHandler<AppleAuthCommand, AuthCommandResult>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<AppleAuthHandler> _logger;

    public AppleAuthHandler(
        UserManager<User> userManager,
        IJwtTokenService jwtTokenService,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        ILogger<AppleAuthHandler> logger)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<AuthCommandResult> HandleAsync(AppleAuthCommand command)
    {
        var clientId = _configuration["Authentication:Apple:ClientId"]
            ?? throw new InvalidOperationException("Authentication:Apple:ClientId is not configured.");

        // Fetch Apple's public JWKS
        var httpClient = _httpClientFactory.CreateClient();
        string jwksJson;
        try
        {
            jwksJson = await httpClient.GetStringAsync("https://appleid.apple.com/auth/keys");
        }
        catch (Exception ex)
        {
            _logger.LogError("Failed to fetch Apple JWKS: {Message}", ex.Message);
            return AuthCommandResult.Fail("Unable to verify Apple token. Please try again.");
        }

        var jwks = new JsonWebKeySet(jwksJson);

        var tokenHandler = new JwtSecurityTokenHandler();
        JwtSecurityToken jwtToken;
        try
        {
            tokenHandler.ValidateToken(command.IdToken, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKeys = jwks.GetSigningKeys(),
                ValidateIssuer = true,
                ValidIssuer = "https://appleid.apple.com",
                ValidateAudience = true,
                ValidAudience = clientId,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(5)
            }, out var validatedToken);

            jwtToken = (JwtSecurityToken)validatedToken;
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Apple token validation failed: {Message}", ex.Message);
            return AuthCommandResult.Fail("Invalid Apple token.");
        }

        var subject = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
        var email = jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

        if (string.IsNullOrEmpty(subject))
            return AuthCommandResult.Fail("Invalid Apple token: missing subject claim.");

        // Apple only provides the email on the first sign-in; on subsequent sign-ins,
        // email may be a private relay address or absent — fall back to sub-based identifier.
        var userEmail = !string.IsNullOrEmpty(email)
            ? email
            : $"{subject}@privaterelay.appleid.com";

        var user = await _userManager.FindByEmailAsync(userEmail);
        if (user is null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                UserName = userEmail,
                Email = userEmail,
                FirstName = command.FirstName ?? string.Empty,
                LastName = command.LastName ?? string.Empty,
                Role = command.Role,
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true
            };

            var createResult = await _userManager.CreateAsync(user);
            if (!createResult.Succeeded)
            {
                var errors = string.Join("; ", createResult.Errors.Select(e => e.Description));
                _logger.LogError("Failed to create user from Apple OAuth: {Errors}", errors);
                return AuthCommandResult.Fail($"Account creation failed: {errors}");
            }

            await _userManager.AddToRoleAsync(user, command.Role.ToString());
            _logger.LogInformation("New user created via Apple OAuth: {UserId}", user.Id);
        }

        user.LastLogin = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtTokenService.GenerateToken(user, roles);

        _logger.LogInformation("Apple OAuth login successful for user: {UserId}", user.Id);
        return AuthCommandResult.Ok(token, user.Id, "Login successful.");
    }
}
