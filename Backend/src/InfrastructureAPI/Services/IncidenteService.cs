using InfrastructureCore.DTOs;
using InfrastructureCore.Entities;
using InfrastructureCore.Interfaces;
using InfrastructureData;
using Microsoft.EntityFrameworkCore;

namespace InfrastructureAPI.Services;

public class IncidenteService : IIncidenteService
{
    private readonly AppDbContext _context;

    public IncidenteService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IncidenteResponseDto> GetAsync(Guid id)
    {
        var incidente = await _context.Incidentes
            .Include(i => i.Infraestructura)
            .Include(i => i.AsignadoA)
            .FirstOrDefaultAsync(i => i.Id == id)
            ?? throw new KeyNotFoundException("Incidente no encontrado");

        return MapToResponseDto(incidente);
    }

    public async Task<IncidenteListResponseDto> GetAllAsync(int page = 1, int pageSize = 10, string? estado = null, string? severidad = null)
    {
        var query = _context.Incidentes
            .Include(i => i.Infraestructura)
            .Include(i => i.AsignadoA)
            .AsQueryable();

        if (!string.IsNullOrEmpty(estado))
            query = query.Where(i => i.Estado == estado);

        if (!string.IsNullOrEmpty(severidad))
            query = query.Where(i => i.Severidad == severidad);

        var total = await query.CountAsync();
        var rawItems = await query
            .OrderByDescending(i => i.FechaReporte)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new IncidenteListResponseDto
        {
            Items = rawItems.Select(MapToResponseDto).ToList(),
            Total = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<IncidenteResponseDto> CreateAsync(CreateIncidenteDto dto)
    {
        var infraestructura = await _context.Infraestructuras.FindAsync(dto.InfrastructuraId)
            ?? throw new KeyNotFoundException("Infraestructura no encontrada");

        var incidente = new Incidente
        {
            Id = Guid.NewGuid(),
            InfrastructuraId = dto.InfrastructuraId,
            Infraestructura = infraestructura,
            Titulo = dto.Titulo,
            Descripcion = dto.Descripcion,
            Severidad = dto.Severidad,
            Estado = "Abierto",
            FechaReporte = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Incidentes.Add(incidente);
        await _context.SaveChangesAsync();

        return MapToResponseDto(incidente);
    }

    public async Task<IncidenteResponseDto> AsignarAsync(Guid id, AsignarIncidenteDto dto)
    {
        var incidente = await _context.Incidentes
            .Include(i => i.Infraestructura)
            .Include(i => i.AsignadoA)
            .FirstOrDefaultAsync(i => i.Id == id)
            ?? throw new KeyNotFoundException("Incidente no encontrado");

        var usuario = await _context.Usuarios.FindAsync(dto.UsuarioId)
            ?? throw new KeyNotFoundException("Usuario no encontrado");

        incidente.AsignadoAId = dto.UsuarioId;
        incidente.AsignadoA = usuario;
        incidente.Estado = "EnProgreso";
        incidente.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToResponseDto(incidente);
    }

    public async Task<IncidenteResponseDto> ResolverAsync(Guid id, ResolverIncidenteDto dto)
    {
        var incidente = await _context.Incidentes
            .Include(i => i.Infraestructura)
            .Include(i => i.AsignadoA)
            .FirstOrDefaultAsync(i => i.Id == id)
            ?? throw new KeyNotFoundException("Incidente no encontrado");

        incidente.Estado = "Resuelto";
        incidente.FechaResolucion = DateTime.UtcNow;
        incidente.NotasResolucion = dto.NotasResolucion;
        incidente.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToResponseDto(incidente);
    }

    public async Task<List<IncidenteResponseDto>> GetByInfrastructuraAsync(Guid infraId)
    {
        var items = await _context.Incidentes
            .Include(i => i.Infraestructura)
            .Include(i => i.AsignadoA)
            .Where(i => i.InfrastructuraId == infraId)
            .OrderByDescending(i => i.FechaReporte)
            .ToListAsync();

        return items.Select(MapToResponseDto).ToList();
    }

    private static IncidenteResponseDto MapToResponseDto(Incidente incidente) => new()
    {
        Id = incidente.Id,
        Titulo = incidente.Titulo,
        Descripcion = incidente.Descripcion,
        Severidad = incidente.Severidad,
        Estado = incidente.Estado,
        FechaReporte = incidente.FechaReporte,
        FechaResolucion = incidente.FechaResolucion,
        NotasResolucion = incidente.NotasResolucion,
        InfrastructuraId = incidente.InfrastructuraId,
        InfrastructuraNombre = incidente.Infraestructura?.Nombre,
        AsignadoAId = incidente.AsignadoAId,
        AsignadoANombre = incidente.AsignadoA?.NombreCompleto,
        CreatedAt = incidente.CreatedAt,
        UpdatedAt = incidente.UpdatedAt
    };
}
