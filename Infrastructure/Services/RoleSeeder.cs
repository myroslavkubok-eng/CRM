using CRMKatia.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace CRMKatia.Infrastructure.Services;

public static class RoleSeeder
{
    public static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
    {
        foreach (var roleName in Enum.GetNames(typeof(UserRole)))
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
            }
        }
    }
}