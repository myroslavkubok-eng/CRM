using CRMKatia.Application.Commands.Interfaces;
using CRMKatia.Application.Services;
using CRMKatia.Domain.Entities;
using Microsoft.AspNetCore.Identity;

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

    public LoginUserHandler(UserManager<User> userManager, IJwtTokenService jwtTokenService)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<AuthCommandResult> HandleAsync(LoginUserCommand command)
    {
        var user = await _userManager.FindByEmailAsync(command.Email);

        if (user is null)
            return AuthCommandResult.Fail("Invalid email or password.");

        var isValidPassword = await _userManager.CheckPasswordAsync(user, command.Password);

        if (!isValidPassword)
            return AuthCommandResult.Fail("Invalid email or password.");

        user.LastLogin = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtTokenService.GenerateToken(user, roles);

        return AuthCommandResult.Ok(token, user.Id, "Login successful.");
    }
}
