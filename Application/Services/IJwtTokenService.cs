using CRMKatia.Domain.Entities;

namespace CRMKatia.Application.Services;

public interface IJwtTokenService
{
    string GenerateToken(User user, IList<string> roles);
}
