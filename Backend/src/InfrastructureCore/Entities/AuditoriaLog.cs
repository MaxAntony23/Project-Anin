namespace InfrastructureCore.Entities;

public class AuditoriaLog
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }
    public string TipoAccion { get; set; } = string.Empty; // Create, Update, Delete, Login
    public string EntidadTipo { get; set; } = string.Empty; // Infraestructura, Incidente, Usuario
    public Guid EntidadId { get; set; }
    public string? CambiosAnteriores { get; set; } // JSON
    public string? CambiosNuevos { get; set; } // JSON
    public DateTime FechaAccion { get; set; } = DateTime.UtcNow;
    public string? DireccionIP { get; set; }
}
