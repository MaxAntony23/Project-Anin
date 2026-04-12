using BCrypt.Net;
using InfrastructureCore.Entities;

namespace InfrastructureData;

public static class SeedData
{
    public static void Initialize(AppDbContext context)
    {
        if (context.Usuarios.Any()) return;

        // --- Usuarios ---
        var adminId = Guid.NewGuid();
        var operadorId = Guid.NewGuid();
        var visualizadorId = Guid.NewGuid();

        var usuarios = new List<Usuario>
        {
            new()
            {
                Id = adminId,
                Email = "admin@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                NombreCompleto = "Administrador General",
                Rol = "Admin",
                Activo = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = operadorId,
                Email = "operador@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                NombreCompleto = "Carlos Operador Lima",
                Rol = "Operador",
                Activo = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = visualizadorId,
                Email = "visualizador@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                NombreCompleto = "María Visualizadora",
                Rol = "Visualizador",
                Activo = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Usuarios.AddRange(usuarios);
        context.SaveChanges();

        // --- Infraestructuras (10 distribuidas en Perú) ---
        var inf1Id = Guid.NewGuid();
        var inf2Id = Guid.NewGuid();
        var inf3Id = Guid.NewGuid();
        var inf4Id = Guid.NewGuid();
        var inf5Id = Guid.NewGuid();
        var inf6Id = Guid.NewGuid();
        var inf7Id = Guid.NewGuid();
        var inf8Id = Guid.NewGuid();
        var inf9Id = Guid.NewGuid();
        var inf10Id = Guid.NewGuid();

        var infraestructuras = new List<Infraestructura>
        {
            // Lima (5)
            new()
            {
                Id = inf1Id,
                Nombre = "Carretera Panamericana Norte - Tramo Lima",
                Tipo = "Carretera",
                Estado = "Operativa",
                Region = "Lima",
                Latitud = -11.9892m,
                Longitud = -77.0631m,
                CapacidadMaxima = 5000,
                CapacidadActual = 3200,
                ResponsableId = adminId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = inf2Id,
                Nombre = "Puente Chilina",
                Tipo = "Puente",
                Estado = "Operativa",
                Region = "Lima",
                Latitud = -12.0464m,
                Longitud = -77.0428m,
                CapacidadMaxima = 800,
                CapacidadActual = 420,
                ResponsableId = operadorId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = inf3Id,
                Nombre = "Aeropuerto Internacional Jorge Chávez",
                Tipo = "Aeropuerto",
                Estado = "Operativa",
                Region = "Lima",
                Latitud = -12.0219m,
                Longitud = -77.1143m,
                CapacidadMaxima = 15000,
                CapacidadActual = 11000,
                ResponsableId = adminId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = inf4Id,
                Nombre = "Túnel San Cristóbal",
                Tipo = "Tunel",
                Estado = "Mantenimiento",
                Region = "Lima",
                Latitud = -12.0300m,
                Longitud = -77.0100m,
                CapacidadMaxima = 1200,
                CapacidadActual = 0,
                ResponsableId = operadorId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = inf5Id,
                Nombre = "Puerto del Callao",
                Tipo = "Puerto",
                Estado = "Operativa",
                Region = "Lima",
                Latitud = -12.0565m,
                Longitud = -77.1480m,
                CapacidadMaxima = 50000,
                CapacidadActual = 38000,
                ResponsableId = adminId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Arequipa (2)
            new()
            {
                Id = inf6Id,
                Nombre = "Carretera Panamericana Sur - Tramo Arequipa",
                Tipo = "Carretera",
                Estado = "Operativa",
                Region = "Arequipa",
                Latitud = -16.4090m,
                Longitud = -71.5375m,
                CapacidadMaxima = 3500,
                CapacidadActual = 2100,
                ResponsableId = operadorId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = inf7Id,
                Nombre = "Aeropuerto Alfredo Rodríguez Ballón",
                Tipo = "Aeropuerto",
                Estado = "Operativa",
                Region = "Arequipa",
                Latitud = -16.3411m,
                Longitud = -71.5830m,
                CapacidadMaxima = 4000,
                CapacidadActual = 2200,
                ResponsableId = operadorId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Cusco (2)
            new()
            {
                Id = inf8Id,
                Nombre = "Túnel Piquillacta",
                Tipo = "Tunel",
                Estado = "Danada",
                Region = "Cusco",
                Latitud = -13.6318m,
                Longitud = -71.7150m,
                CapacidadMaxima = 600,
                CapacidadActual = 200,
                ResponsableId = operadorId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = inf9Id,
                Nombre = "Ferrocarril Cusco - Machu Picchu",
                Tipo = "Ferrocarril",
                Estado = "Operativa",
                Region = "Cusco",
                Latitud = -13.5170m,
                Longitud = -71.9785m,
                CapacidadMaxima = 1500,
                CapacidadActual = 1200,
                ResponsableId = adminId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Junín (1)
            new()
            {
                Id = inf10Id,
                Nombre = "Carretera Central - Tramo Junín",
                Tipo = "Carretera",
                Estado = "FueraDeServicio",
                Region = "Junin",
                Latitud = -11.1578m,
                Longitud = -75.9928m,
                CapacidadMaxima = 2000,
                CapacidadActual = 0,
                ResponsableId = operadorId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Infraestructuras.AddRange(infraestructuras);
        context.SaveChanges();

        // --- Incidentes (5 de ejemplo) ---
        var incidentes = new List<Incidente>
        {
            new()
            {
                Id = Guid.NewGuid(),
                InfrastructuraId = inf4Id,
                Titulo = "Grietas detectadas en revestimiento interior",
                Descripcion = "Se detectaron grietas longitudinales en el revestimiento de concreto del túnel en el tramo km 2.3. Requiere inspección estructural urgente.",
                Severidad = "Alta",
                Estado = "EnProgreso",
                FechaReporte = DateTime.UtcNow.AddDays(-5),
                AsignadoAId = operadorId,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new()
            {
                Id = Guid.NewGuid(),
                InfrastructuraId = inf10Id,
                Titulo = "Deslizamiento de tierra bloquea vía principal",
                Descripcion = "Deslizamiento de tierras a causa de lluvias intensas bloquea el carril norte de la Carretera Central. Vía cerrada completamente al tránsito.",
                Severidad = "Critica",
                Estado = "Abierto",
                FechaReporte = DateTime.UtcNow.AddDays(-2),
                AsignadoAId = operadorId,
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new()
            {
                Id = Guid.NewGuid(),
                InfrastructuraId = inf8Id,
                Titulo = "Filtración de agua en bóveda del túnel",
                Descripcion = "Filtración de agua detectada en la bóveda del Túnel Piquillacta, sección km 0.8. Posible afectación estructural.",
                Severidad = "Media",
                Estado = "EnProgreso",
                FechaReporte = DateTime.UtcNow.AddDays(-10),
                AsignadoAId = operadorId,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new()
            {
                Id = Guid.NewGuid(),
                InfrastructuraId = inf2Id,
                Titulo = "Mantenimiento preventivo de juntas de expansión",
                Descripcion = "Reemplazo programado de juntas de expansión en los extremos del puente. Trabajo de mantenimiento de rutina.",
                Severidad = "Baja",
                Estado = "Resuelto",
                FechaReporte = DateTime.UtcNow.AddDays(-20),
                AsignadoAId = operadorId,
                FechaResolucion = DateTime.UtcNow.AddDays(-15),
                NotasResolucion = "Juntas reemplazadas satisfactoriamente. Puente en óptimas condiciones.",
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-15)
            },
            new()
            {
                Id = Guid.NewGuid(),
                InfrastructuraId = inf3Id,
                Titulo = "Falla en sistema de iluminación pista 02",
                Descripcion = "Sistema de iluminación de aproximación de la pista 02 presenta fallas intermitentes. Afecta operaciones nocturnas.",
                Severidad = "Alta",
                Estado = "Abierto",
                FechaReporte = DateTime.UtcNow.AddDays(-1),
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            }
        };

        context.Incidentes.AddRange(incidentes);
        context.SaveChanges();
    }
}
