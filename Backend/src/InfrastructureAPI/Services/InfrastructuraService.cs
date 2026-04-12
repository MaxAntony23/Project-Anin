using InfrastructureCore.DTOs;
using InfrastructureCore.Entities;
using InfrastructureCore.Interfaces;
using InfrastructureData;
using Microsoft.EntityFrameworkCore;

namespace InfrastructureAPI.Services;

public class InfrastructuraService : IInfrastructuraService
{
    private readonly AppDbContext _context;

    public InfrastructuraService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<InfrastructuraResponseDto> GetAsync(Guid id)
    {
        var infra = await _context.Infraestructuras
            .Include(i => i.Responsable)
            .FirstOrDefaultAsync(i => i.Id == id)
            ?? throw new KeyNotFoundException("Infraestructura no encontrada");

        return MapToResponseDto(infra);
    }

    public async Task<InfrastructuraListResponseDto> GetAllAsync(int page = 1, int pageSize = 10, string? estado = null, string? region = null, string? search = null)
    {
        var query = _context.Infraestructuras
            .Include(i => i.Responsable)
            .AsQueryable();

        if (!string.IsNullOrEmpty(estado))
            query = query.Where(i => i.Estado == estado);

        if (!string.IsNullOrEmpty(region))
            query = query.Where(i => i.Region == region);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(i => i.Nombre.Contains(search) || i.Tipo.Contains(search) || i.Region.Contains(search));

        var total = await query.CountAsync();
        var rawItems = await query
            .OrderBy(i => i.Nombre)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new InfrastructuraListResponseDto
        {
            Items = rawItems.Select(MapToResponseDto).ToList(),
            Total = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<InfrastructuraResponseDto> CreateAsync(CreateInfrastructuraDto dto)
    {
        var responsable = await _context.Usuarios.FindAsync(dto.ResponsableId)
            ?? throw new KeyNotFoundException("Responsable no encontrado");

        var infra = new Infraestructura
        {
            Id = Guid.NewGuid(),
            Nombre = dto.Nombre,
            Tipo = dto.Tipo,
            Estado = dto.Estado,
            Region = dto.Region,
            Latitud = dto.Latitud,
            Longitud = dto.Longitud,
            CapacidadMaxima = dto.CapacidadMaxima,
            CapacidadActual = dto.CapacidadActual,
            ResponsableId = dto.ResponsableId,
            Responsable = responsable,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Infraestructuras.Add(infra);
        await _context.SaveChangesAsync();

        return MapToResponseDto(infra);
    }

    public async Task<InfrastructuraResponseDto> UpdateAsync(Guid id, UpdateInfrastructuraDto dto)
    {
        var infra = await _context.Infraestructuras
            .Include(i => i.Responsable)
            .FirstOrDefaultAsync(i => i.Id == id)
            ?? throw new KeyNotFoundException("Infraestructura no encontrada");

        if (!string.IsNullOrEmpty(dto.Nombre)) infra.Nombre = dto.Nombre;
        if (!string.IsNullOrEmpty(dto.Tipo)) infra.Tipo = dto.Tipo;
        if (!string.IsNullOrEmpty(dto.Estado)) infra.Estado = dto.Estado;
        if (!string.IsNullOrEmpty(dto.Region)) infra.Region = dto.Region;
        if (dto.Latitud.HasValue) infra.Latitud = dto.Latitud.Value;
        if (dto.Longitud.HasValue) infra.Longitud = dto.Longitud.Value;
        if (dto.CapacidadMaxima.HasValue) infra.CapacidadMaxima = dto.CapacidadMaxima;
        if (dto.CapacidadActual.HasValue) infra.CapacidadActual = dto.CapacidadActual;

        if (dto.ResponsableId.HasValue)
        {
            var responsable = await _context.Usuarios.FindAsync(dto.ResponsableId.Value)
                ?? throw new KeyNotFoundException("Responsable no encontrado");
            infra.ResponsableId = dto.ResponsableId.Value;
            infra.Responsable = responsable;
        }

        infra.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return MapToResponseDto(infra);
    }

    public async Task DeleteAsync(Guid id)
    {
        var infra = await _context.Infraestructuras.FindAsync(id)
            ?? throw new KeyNotFoundException("Infraestructura no encontrada");

        _context.Infraestructuras.Remove(infra);
        await _context.SaveChangesAsync();
    }

    public async Task<List<InfrastructuraResponseDto>> GetByRegionAsync(string region)
    {
        var items = await _context.Infraestructuras
            .Include(i => i.Responsable)
            .Where(i => i.Region == region)
            .ToListAsync();

        return items.Select(MapToResponseDto).ToList();
    }

    private static InfrastructuraResponseDto MapToResponseDto(Infraestructura infra) => new()
    {
        Id = infra.Id,
        Nombre = infra.Nombre,
        Tipo = infra.Tipo,
        Estado = infra.Estado,
        Region = infra.Region,
        Latitud = infra.Latitud,
        Longitud = infra.Longitud,
        CapacidadMaxima = infra.CapacidadMaxima,
        CapacidadActual = infra.CapacidadActual,
        Responsable = infra.Responsable == null ? null : new UsuarioResponseDto
        {
            Id = infra.Responsable.Id,
            Email = infra.Responsable.Email,
            NombreCompleto = infra.Responsable.NombreCompleto,
            Rol = infra.Responsable.Rol,
            Activo = infra.Responsable.Activo
        },
        CreatedAt = infra.CreatedAt,
        UpdatedAt = infra.UpdatedAt
    };
}
