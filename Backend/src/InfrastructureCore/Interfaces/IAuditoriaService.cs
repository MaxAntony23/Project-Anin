using InfrastructureCore.DTOs;

namespace InfrastructureCore.Interfaces;

public interface IAuditoriaService
{
    Task<AuditoriaListResponseDto> GetLogsAsync(int page = 1, int pageSize = 50, Guid? usuarioId = null, string? tipoAccion = null);
    Task<AuditoriaLogResponseDto?> GetLogAsync(Guid id);
    Task LogActionAsync(Guid usuarioId, string tipoAccion, string entidadTipo, Guid entidadId, string? cambiosAnteriores = null, string? cambiosNuevos = null, string? direccionIP = null);
}
