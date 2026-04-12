namespace InfrastructureCore.DTOs;

public class CreateInfrastructuraDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public decimal Latitud { get; set; }
    public decimal Longitud { get; set; }
    public int? CapacidadMaxima { get; set; }
    public int? CapacidadActual { get; set; }
    public Guid ResponsableId { get; set; }
}

public class UpdateInfrastructuraDto
{
    public string? Nombre { get; set; }
    public string? Tipo { get; set; }
    public string? Estado { get; set; }
    public string? Region { get; set; }
    public decimal? Latitud { get; set; }
    public decimal? Longitud { get; set; }
    public int? CapacidadMaxima { get; set; }
    public int? CapacidadActual { get; set; }
    public Guid? ResponsableId { get; set; }
}

public class InfrastructuraResponseDto
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public decimal Latitud { get; set; }
    public decimal Longitud { get; set; }
    public int? CapacidadMaxima { get; set; }
    public int? CapacidadActual { get; set; }
    public UsuarioResponseDto? Responsable { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class InfrastructuraListResponseDto
{
    public List<InfrastructuraResponseDto> Items { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
