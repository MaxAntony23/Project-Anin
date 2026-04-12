using InfrastructureCore.DTOs;
using InfrastructureCore.Entities;
using InfrastructureCore.Interfaces;
using InfrastructureData;
using Microsoft.EntityFrameworkCore;

namespace InfrastructureAPI.Services;

public class AuditoriaService : IAuditoriaService
{
    private readonly AppDbContext _context;

    public AuditoriaService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AuditoriaListResponseDto> GetLogsAsync(int page = 1, int pageSize = 50, Guid? usuarioId = null, string? tipoAccion = null)
    {
        var query = _context.AuditoriaLogs
            .Include(a => a.Usuario)
            .AsQueryable();

        if (usuarioId.HasValue)
            query = query.Where(a => a.UsuarioId == usuarioId.Value);

        if (!string.IsNullOrEmpty(tipoAccion))
            query = query.Where(a => a.TipoAccion == tipoAccion);

        var total = await query.CountAsync();
        var rawItems = await query
            .OrderByDescending(a => a.FechaAccion)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new AuditoriaListResponseDto
        {
            Items = rawItems.Select(MapToResponseDto).ToList(),
            Total = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<AuditoriaLogResponseDto?> GetLogAsync(Guid id)
    {
        var log = await _context.AuditoriaLogs
            .Include(a => a.Usuario)
            .FirstOrDefaultAsync(a => a.Id == id);

        return log != null ? MapToResponseDto(log) : null;
    }

    public async Task LogActionAsync(Guid usuarioId, string tipoAccion, string entidadTipo, Guid entidadId, string? cambiosAnteriores = null, string? cambiosNuevos = null, string? direccionIP = null)
    {
        var log = new AuditoriaLog
        {
            Id = Guid.NewGuid(),
            UsuarioId = usuarioId,
            TipoAccion = tipoAccion,
            EntidadTipo = entidadTipo,
            EntidadId = entidadId,
            CambiosAnteriores = cambiosAnteriores,
            CambiosNuevos = cambiosNuevos,
            FechaAccion = DateTime.UtcNow,
            DireccionIP = direccionIP
        };

        _context.AuditoriaLogs.Add(log);
        await _context.SaveChangesAsync();
    }

    private static AuditoriaLogResponseDto MapToResponseDto(AuditoriaLog log) => new()
    {
        Id = log.Id,
        UsuarioEmail = log.Usuario?.Email ?? "Desconocido",
        UsuarioNombre = log.Usuario?.NombreCompleto ?? "Desconocido",
        TipoAccion = log.TipoAccion,
        EntidadTipo = log.EntidadTipo,
        EntidadId = log.EntidadId,
        CambiosAnteriores = log.CambiosAnteriores,
        CambiosNuevos = log.CambiosNuevos,
        FechaAccion = log.FechaAccion,
        DireccionIP = log.DireccionIP
    };
}
