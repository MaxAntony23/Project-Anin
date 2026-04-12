using InfrastructureCore.DTOs;

namespace InfrastructureCore.Interfaces;

public interface IInfrastructuraService
{
    Task<InfrastructuraResponseDto> GetAsync(Guid id);
    Task<InfrastructuraListResponseDto> GetAllAsync(int page = 1, int pageSize = 10, string? estado = null, string? region = null, string? search = null);
    Task<InfrastructuraResponseDto> CreateAsync(CreateInfrastructuraDto dto);
    Task<InfrastructuraResponseDto> UpdateAsync(Guid id, UpdateInfrastructuraDto dto);
    Task DeleteAsync(Guid id);
    Task<List<InfrastructuraResponseDto>> GetByRegionAsync(string region);
}
