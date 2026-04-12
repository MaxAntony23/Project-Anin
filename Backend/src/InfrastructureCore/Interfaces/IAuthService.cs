using InfrastructureCore.DTOs;

namespace InfrastructureCore.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
    Task<LoginResponseDto> RefreshTokenAsync(string refreshToken);
    Task LogoutAsync(Guid userId);
    Task<UsuarioResponseDto> RegisterAsync(RegisterRequestDto request);
}
