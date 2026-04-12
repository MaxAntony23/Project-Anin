namespace InfrastructureCore.Entities;

public class Infraestructura
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty; // Carretera, Puente, Tunel, Aeropuerto, Puerto, Ferrocarril
    public string Estado { get; set; } = string.Empty; // Operativa, Mantenimiento, FueraDeServicio, Danada
    public string Region { get; set; } = string.Empty;
    public decimal Latitud { get; set; }
    public decimal Longitud { get; set; }
    public int? CapacidadMaxima { get; set; }
    public int? CapacidadActual { get; set; }
    public Guid ResponsableId { get; set; }
    public Usuario? Responsable { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Incidente> Incidentes { get; set; } = new List<Incidente>();
}
