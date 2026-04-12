using InfrastructureCore.DTOs;

namespace InfrastructureCore.Interfaces;

public interface IIncidenteService
{
    Task<IncidenteResponseDto> GetAsync(Guid id);
    Task<IncidenteListResponseDto> GetAllAsync(int page = 1, int pageSize = 10, string? estado = null, string? severidad = null);
    Task<IncidenteResponseDto> CreateAsync(CreateIncidenteDto dto);
    Task<IncidenteResponseDto> AsignarAsync(Guid id, AsignarIncidenteDto dto);
    Task<IncidenteResponseDto> ResolverAsync(Guid id, ResolverIncidenteDto dto);
    Task<List<IncidenteResponseDto>> GetByInfrastructuraAsync(Guid infraId);
}
