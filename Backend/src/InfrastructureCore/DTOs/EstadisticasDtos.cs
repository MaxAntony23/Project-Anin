namespace InfrastructureCore.DTOs;

public class ResumenEstadisticasDto
{
    public int TotalInfraestructuras { get; set; }
    public int InfraestructurasOperativas { get; set; }
    public int InfraestructurasMantenimiento { get; set; }
    public int InfraestructurasFueraDeServicio { get; set; }
    public int InfraestructurasDanadas { get; set; }
    public int IncidentesAbiertos { get; set; }
    public int IncidentesCriticos { get; set; }
    public int IncidentesEnProgreso { get; set; }
    public int IncidentesResueltos { get; set; }
    public int TotalIncidentes { get; set; }
}

public class InfraestructurasPorEstadoDto
{
    public int Operativa { get; set; }
    public int Mantenimiento { get; set; }
    public int FueraDeServicio { get; set; }
    public int Danada { get; set; }
}

public class InfraestructurasPorRegionDto
{
    public string Region { get; set; } = string.Empty;
    public int Total { get; set; }
}

public class AuditoriaLogResponseDto
{
    public Guid Id { get; set; }
    public string UsuarioEmail { get; set; } = string.Empty;
    public string UsuarioNombre { get; set; } = string.Empty;
    public string TipoAccion { get; set; } = string.Empty;
    public string EntidadTipo { get; set; } = string.Empty;
    public Guid EntidadId { get; set; }
    public string? CambiosAnteriores { get; set; }
    public string? CambiosNuevos { get; set; }
    public DateTime FechaAccion { get; set; }
    public string? DireccionIP { get; set; }
}

public class AuditoriaListResponseDto
{
    public List<AuditoriaLogResponseDto> Items { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
