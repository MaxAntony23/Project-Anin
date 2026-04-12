using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using InfrastructureCore.DTOs;
using InfrastructureCore.Entities;
using InfrastructureCore.Interfaces;
using InfrastructureData;
using Microsoft.IdentityModel.Tokens;

namespace InfrastructureAPI.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
    {
        var usuario = _context.Usuarios.FirstOrDefault(u => u.Email == request.Email);
        if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash))
            throw new UnauthorizedAccessException("Email o contraseña inválidos");

        if (!usuario.Activo)
            throw new UnauthorizedAccessException("Usuario inactivo");

        var token = GenerateJwtToken(usuario);
        var refreshToken = GenerateRefreshToken();

        _context.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UsuarioId = usuario.Id,
            Token = refreshToken,
            ExpiryDate = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();

        return new LoginResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            User = MapToUsuarioResponse(usuario)
        };
    }

    public async Task<LoginResponseDto> RefreshTokenAsync(string refreshToken)
    {
        var tokenEntity = _context.RefreshTokens
            .FirstOrDefault(rt => rt.Token == refreshToken && rt.ExpiryDate > DateTime.UtcNow);

        if (tokenEntity == null)
            throw new UnauthorizedAccessException("Refresh token inválido o expirado");

        var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == tokenEntity.UsuarioId);
        if (usuario == null || !usuario.Activo)
            throw new UnauthorizedAccessException("Usuario inválido");

        var newToken = GenerateJwtToken(usuario);
        var newRefreshToken = GenerateRefreshToken();

        _context.RefreshTokens.Remove(tokenEntity);
        _context.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UsuarioId = usuario.Id,
            Token = newRefreshToken,
            ExpiryDate = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();

        return new LoginResponseDto
        {
            Token = newToken,
            RefreshToken = newRefreshToken,
            User = MapToUsuarioResponse(usuario)
        };
    }

    public async Task LogoutAsync(Guid userId)
    {
        var tokens = _context.RefreshTokens.Where(rt => rt.UsuarioId == userId);
        _context.RefreshTokens.RemoveRange(tokens);
        await _context.SaveChangesAsync();
    }

    public async Task<UsuarioResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        if (_context.Usuarios.Any(u => u.Email == request.Email))
            throw new InvalidOperationException("Email ya existe");

        var usuario = new Usuario
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            NombreCompleto = request.NombreCompleto,
            Rol = request.Rol,
            Activo = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return MapToUsuarioResponse(usuario);
    }

    private string GenerateJwtToken(Usuario usuario)
    {
        var secretKey = _configuration["Jwt:SecretKey"] ?? "InfrastructureManagementSystem_SecretKey_2024_ANIN_Peru_Secure";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new(ClaimTypes.Email, usuario.Email),
            new(ClaimTypes.Name, usuario.NombreCompleto),
            new(ClaimTypes.Role, usuario.Rol)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "InfrastructureAPI",
            audience: _configuration["Jwt:Audience"] ?? "InfrastructureFrontend",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private static UsuarioResponseDto MapToUsuarioResponse(Usuario usuario) => new()
    {
        Id = usuario.Id,
        Email = usuario.Email,
        NombreCompleto = usuario.NombreCompleto,
        Rol = usuario.Rol,
        Activo = usuario.Activo
    };
}
