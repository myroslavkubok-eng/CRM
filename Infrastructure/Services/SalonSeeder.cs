using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Enums;
using CRMKatia.Infrastructure.Persistence.DbContext;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CRMKatia.Infrastructure.Services;

public static class SalonSeeder
{
    private const string TestOwnerEmail = "test@salon.com";
    private const string TestOwnerPassword = "TestOwner@123";
    private const string TestSalonName = "Beauty Haven Test Salon";

    public static async Task SeedSalonAsync(
        UserManager<User> userManager,
        RoleManager<IdentityRole<Guid>> roleManager,
        ApplicationDbContext context,
        ILogger? logger = null)
    {
        var existingSalon = await context.Salons
            .FirstOrDefaultAsync(s => s.Name == TestSalonName);

        if (existingSalon != null)
        {
            logger?.LogInformation("Test salon already exists. Skipping seeding.");
            return;
        }

        var ownerUser = await userManager.FindByEmailAsync(TestOwnerEmail);

        if (ownerUser == null)
        {
            logger?.LogInformation("Creating test owner user: {Email}", TestOwnerEmail);
            
            ownerUser = new User
            {
                UserName = TestOwnerEmail,
                Email = TestOwnerEmail,
                FirstName = "Test",
                LastName = "Owner",
                Role = UserRole.Owner,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow
            };

            var createResult = await userManager.CreateAsync(ownerUser, TestOwnerPassword);

            if (!createResult.Succeeded)
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                logger?.LogError("Failed to create test owner user: {Errors}", errors);
                throw new Exception($"Failed to create test owner user: {errors}");
            }

            logger?.LogInformation("Test owner user created successfully: {UserId}", ownerUser.Id);

            var roleExists = await roleManager.RoleExistsAsync("Owner");
            if (roleExists)
            {
                var roleResult = await userManager.AddToRoleAsync(ownerUser, "Owner");
                if (roleResult.Succeeded)
                {
                    logger?.LogInformation("Added Owner role to test user");
                }
                else
                {
                    logger?.LogWarning("Failed to add Owner role: {Errors}", string.Join(", ", roleResult.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                logger?.LogWarning("Owner role does not exist. Make sure RoleSeeder runs first.");
            }
        }
        else
        {
            logger?.LogInformation("Test owner user already exists: {UserId}", ownerUser.Id);
            
            var roles = await userManager.GetRolesAsync(ownerUser);
            if (!roles.Contains("Owner"))
            {
                var roleResult = await userManager.AddToRoleAsync(ownerUser, "Owner");
                if (roleResult.Succeeded)
                {
                    logger?.LogInformation("Added Owner role to existing test user");
                }
            }
        }

        var salon = new Salon
        {
            Id = Guid.NewGuid(),
            Name = TestSalonName,
            Description = "A premium test salon with the Business Pro plan. Perfect for testing all features.",
            Address = "Downtown Dubai, United Arab Emirates",
            Phone = "+97141234567",
            Email = TestOwnerEmail,
            City = "Dubai",
            Country = "UAE",
            Plan = SubscriptionPlan.BusinessPro,
            BillingPeriod = BillingPeriod.Monthly,
            SubscriptionStatus = SubscriptionStatus.Active,
            IsPublished = true,
            PublishedAt = DateTime.UtcNow,
            OwnerId = ownerUser.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Salons.Add(salon);
        await context.SaveChangesAsync();

        logger?.LogInformation("Test salon created successfully: {SalonId}, Owner: {OwnerId}", salon.Id, ownerUser.Id);
    }
}