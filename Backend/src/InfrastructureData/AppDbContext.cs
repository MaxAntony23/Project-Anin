using InfrastructureCore.Entities;
using Microsoft.EntityFrameworkCore;

namespace InfrastructureData;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Infraestructura> Infraestructuras { get; set; }
    public DbSet<Incidente> Incidentes { get; set; }
    public DbSet<AuditoriaLog> AuditoriaLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Usuario
        modelBuilder.Entity<Usuario>()
            .HasKey(u => u.Id);
        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Infraestructura
        modelBuilder.Entity<Infraestructura>()
            .HasKey(i => i.Id);
        modelBuilder.Entity<Infraestructura>()
            .HasOne(i => i.Responsable)
            .WithMany()
            .HasForeignKey(i => i.ResponsableId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Infraestructura>()
            .HasIndex(i => new { i.Region, i.Estado });
        modelBuilder.Entity<Infraestructura>()
            .Property(i => i.Latitud)
            .HasPrecision(10, 7);
        modelBuilder.Entity<Infraestructura>()
            .Property(i => i.Longitud)
            .HasPrecision(10, 7);

        // Incidente
        modelBuilder.Entity<Incidente>()
            .HasKey(i => i.Id);
        modelBuilder.Entity<Incidente>()
            .HasOne(i => i.Infraestructura)
            .WithMany(inf => inf.Incidentes)
            .HasForeignKey(i => i.InfrastructuraId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Incidente>()
            .HasOne(i => i.AsignadoA)
            .WithMany()
            .HasForeignKey(i => i.AsignadoAId)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<Incidente>()
            .HasIndex(i => new { i.Estado, i.Severidad });

        // AuditoriaLog
        modelBuilder.Entity<AuditoriaLog>()
            .HasKey(a => a.Id);
        modelBuilder.Entity<AuditoriaLog>()
            .HasOne(a => a.Usuario)
            .WithMany()
            .HasForeignKey(a => a.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<AuditoriaLog>()
            .HasIndex(a => new { a.UsuarioId, a.TipoAccion });
    }
}
