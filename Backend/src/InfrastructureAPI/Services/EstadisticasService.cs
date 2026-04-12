using InfrastructureCore.DTOs;
using InfrastructureCore.Interfaces;
using InfrastructureData;
using Microsoft.EntityFrameworkCore;

namespace InfrastructureAPI.Services;

public class EstadisticasService : IEstadisticasService
{
    private readonly AppDbContext _context;

    public EstadisticasService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ResumenEstadisticasDto> GetResumenAsync()
    {
        var infraestructuras = await _context.Infraestructuras.ToListAsync();
        var incidentes = await _context.Incidentes.ToListAsync();

        return new ResumenEstadisticasDto
        {
            TotalInfraestructuras = infraestructuras.Count,
            InfraestructurasOperativas = infraestructuras.Count(i => i.Estado == "Operativa"),
            InfraestructurasMantenimiento = infraestructuras.Count(i => i.Estado == "Mantenimiento"),
            InfraestructurasFueraDeServicio = infraestructuras.Count(i => i.Estado == "FueraDeServicio"),
            InfraestructurasDanadas = infraestructuras.Count(i => i.Estado == "Danada"),
            TotalIncidentes = incidentes.Count,
            IncidentesAbiertos = incidentes.Count(i => i.Estado == "Abierto"),
            IncidentesCriticos = incidentes.Count(i => i.Severidad == "Critica"),
            IncidentesEnProgreso = incidentes.Count(i => i.Estado == "EnProgreso"),
            IncidentesResueltos = incidentes.Count(i => i.Estado == "Resuelto")
        };
    }

    public async Task<InfraestructurasPorEstadoDto> GetInfraestructurasPorEstadoAsync()
    {
        var infraestructuras = await _context.Infraestructuras.ToListAsync();

        return new InfraestructurasPorEstadoDto
        {
            Operativa = infraestructuras.Count(i => i.Estado == "Operativa"),
            Mantenimiento = infraestructuras.Count(i => i.Estado == "Mantenimiento"),
            FueraDeServicio = infraestructuras.Count(i => i.Estado == "FueraDeServicio"),
            Danada = infraestructuras.Count(i => i.Estado == "Danada")
        };
    }

    public async Task<List<InfraestructurasPorRegionDto>> GetInfraestructurasPorRegionAsync()
    {
        return await _context.Infraestructuras
            .GroupBy(i => i.Region)
            .Select(g => new InfraestructurasPorRegionDto
            {
                Region = g.Key,
                Total = g.Count()
            })
            .OrderByDescending(r => r.Total)
            .ToListAsync();
    }
}
