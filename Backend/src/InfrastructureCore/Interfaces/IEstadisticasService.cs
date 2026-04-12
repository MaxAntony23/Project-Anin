using InfrastructureCore.DTOs;

namespace InfrastructureCore.Interfaces;

public interface IEstadisticasService
{
    Task<ResumenEstadisticasDto> GetResumenAsync();
    Task<InfraestructurasPorEstadoDto> GetInfraestructurasPorEstadoAsync();
    Task<List<InfraestructurasPorRegionDto>> GetInfraestructurasPorRegionAsync();
}
