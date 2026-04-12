namespace InfrastructureCore.Entities;

public class Incidente
{
    public Guid Id { get; set; }
    public Guid InfrastructuraId { get; set; }
    public Infraestructura? Infraestructura { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Severidad { get; set; } = string.Empty; // Baja, Media, Alta, Critica
    public string Estado { get; set; } = string.Empty; // Abierto, EnProgreso, Resuelto, Cancelado
    public DateTime FechaReporte { get; set; }
    public Guid? AsignadoAId { get; set; }
    public Usuario? AsignadoA { get; set; }
    public DateTime? FechaResolucion { get; set; }
    public string? NotasResolucion { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
