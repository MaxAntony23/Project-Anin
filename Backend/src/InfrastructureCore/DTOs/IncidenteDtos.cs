namespace InfrastructureCore.DTOs;

public class CreateIncidenteDto
{
    public Guid InfrastructuraId { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Severidad { get; set; } = string.Empty;
}

public class AsignarIncidenteDto
{
    public Guid UsuarioId { get; set; }
}

public class ResolverIncidenteDto
{
    public string NotasResolucion { get; set; } = string.Empty;
}

public class IncidenteResponseDto
{
    public Guid Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Severidad { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public DateTime FechaReporte { get; set; }
    public DateTime? FechaResolucion { get; set; }
    public string? NotasResolucion { get; set; }
    public Guid InfrastructuraId { get; set; }
    public string? InfrastructuraNombre { get; set; }
    public Guid? AsignadoAId { get; set; }
    public string? AsignadoANombre { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class IncidenteListResponseDto
{
    public List<IncidenteResponseDto> Items { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
