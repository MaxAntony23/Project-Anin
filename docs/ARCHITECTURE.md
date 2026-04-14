# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React 19)                          │
│  ┌────────────┐  ┌─────────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Login    │  │  Dashboard  │  │   Mapa   │  │  Tablas  │   │
│  └────────────┘  └─────────────┘  └──────────┘  └──────────┘   │
│         │ Axios (HTTP/JSON)              │ SignalR (WebSocket)   │
└─────────────────────────────────────────────────────────────────┘
                         │                          │
┌─────────────────────────────────────────────────────────────────┐
│                  Backend (ASP.NET Core 10)                       │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────────┐   │
│  │   Auth     │  │Infraestructu.│  │       Incidentes       │   │
│  │ Controller │  │  Controller  │  │      Controller        │   │
│  └────────────┘  └──────────────┘  └────────────────────────┘   │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────────┐   │
│  │Estadísticas│  │  Auditoría   │  │  NotificacionesHub     │   │
│  │ Controller │  │  Middleware  │  │      (SignalR)          │   │
│  └────────────┘  └──────────────┘  └────────────────────────┘   │
│                         │ EF Core 9                              │
└─────────────────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────────────┐
│                  Database (PostgreSQL 17)                        │
│  ┌──────────┐  ┌───────────────┐  ┌───────────┐                 │
│  │ Usuarios │  │Infraestructu. │  │Incidentes │                 │
│  └──────────┘  └───────────────┘  └───────────┘                 │
│  ┌──────────┐  ┌───────────────┐                                 │
│  │ Auditoría│  │ RefreshTokens │                                 │
│  └──────────┘  └───────────────┘                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Capas del Backend

### InfrastructureAPI (Capa de Presentación)

```
InfrastructureAPI/
├── Controllers/
│   ├── AuthController.cs          # Login, register, refresh token
│   ├── InfrastructurasController  # CRUD infraestructuras
│   ├── IncidentesController       # CRUD incidentes
│   └── EstadisticasController     # Agregados y reportes
├── Hubs/
│   └── NotificacionesHub.cs       # SignalR hub
├── Middleware/
│   └── AuditoriaMiddleware.cs     # Intercepta y registra operaciones
├── Services/                      # Implementaciones concretas
└── Program.cs                     # Configuración DI, middleware pipeline
```

### InfrastructureCore (Capa de Dominio)

```
InfrastructureCore/
├── Entities/
│   ├── Usuario.cs
│   ├── Infraestructura.cs
│   ├── Incidente.cs
│   ├── AuditoriaLog.cs
│   └── RefreshToken.cs
├── DTOs/                          # Request/Response objects tipificados
├── Interfaces/                    # Contratos de servicios
└── Enums/                         # EstadoInfraestructura, TipoIncidente, etc.
```

### InfrastructureData (Capa de Acceso a Datos)

```
InfrastructureData/
├── AppDbContext.cs                 # EF Core DbContext con fluent config
├── Migrations/                    # Historial de migraciones
└── SeedData.cs                    # Datos iniciales (usuarios, infra, incidentes)
```

## Flujos Principales

### 1. Autenticación

```
Usuario → POST /api/auth/login
        → Backend valida password con BCrypt
        → Genera JWT (8h) + Refresh Token (7d)
        → Frontend guarda tokens en localStorage
        → Requests posteriores: Authorization: Bearer {jwt}
```

### 2. CRUD con Auditoría

```
Frontend → PUT /api/infraestructuras/{id}
         → AuditoriaMiddleware intercepta (antes)
         → Controller procesa la request
         → Service actualiza en BD (EF Core)
         → AuditoriaMiddleware registra en auditoria_logs (después)
         → Response al Frontend
```

### 3. Notificación en Tiempo Real

```
Operador → POST /api/incidentes (nuevo incidente)
         → Controller crea incidente en BD
         → IHubContext.SendAll("ReceiveNotification", payload)
         → SignalR propaga a todos los clientes conectados
         → Frontend actualiza estado (Zustand) sin recargar
```

## Modelo de Datos

### Relaciones

```
Usuario (1) ──< Infraestructura (N)   [responsable]
Usuario (1) ──< Incidente (N)          [asignado]
Infraestructura (1) ──< Incidente (N)
Usuario (1) ──< AuditoriaLog (N)
Usuario (1) ──< RefreshToken (N)
```

### Tabla: usuarios

| Campo | Tipo | Descripción |
|---|---|---|
| Id | int | PK |
| Nombre | string | Nombre completo |
| Email | string | Único, usado para login |
| PasswordHash | string | BCrypt hash |
| Rol | enum | Admin / Operador / Visualizador |
| FechaCreacion | datetime | |

### Tabla: infraestructuras

| Campo | Tipo | Descripción |
|---|---|---|
| Id | int | PK |
| Nombre | string | |
| Tipo | enum | Carretera, Puente, Puerto, etc. |
| Estado | enum | Operativo, EnMantenimiento, Critico |
| Region | string | Región del Perú |
| Latitud / Longitud | decimal | Coordenadas para el mapa |
| ResponsableId | int | FK → usuarios |

### Tabla: incidentes

| Campo | Tipo | Descripción |
|---|---|---|
| Id | int | PK |
| Titulo | string | |
| Descripcion | string | |
| Severidad | enum | Baja / Media / Alta / Critica |
| Estado | enum | Abierto / EnProceso / Resuelto |
| InfraestructuraId | int | FK → infraestructuras |
| AsignadoId | int | FK → usuarios (nullable) |
| FechaReporte | datetime | |
| FechaResolucion | datetime | nullable |

## Patrones de Diseño

### Backend

| Patrón | Aplicación |
|---|---|
| Repository (vía EF Core) | Acceso a datos abstracto |
| Service Pattern | Lógica de negocio desacoplada de controllers |
| DTO Pattern | Contratos explícitos de entrada/salida |
| Middleware Pipeline | Auditoría transversal sin contaminar controllers |
| Dependency Injection | Todo el service layer registrado en DI container |

### Frontend

| Patrón | Aplicación |
|---|---|
| Component Pattern | UI modular y reutilizable |
| Service Layer | Abstracción de llamadas HTTP con axios |
| Global State (Zustand) | Estado de auth y datos compartidos |
| Protected Routes | Redirección según autenticación y rol |

## Seguridad

| Mecanismo | Detalle |
|---|---|
| BCrypt | Hash de passwords con salt (cost factor 11) |
| JWT | Access token de 8h firmado con HMAC-SHA256 |
| Refresh Tokens | Rotación en cada uso, TTL 7 días |
| CORS | Whitelist explícita de orígenes permitidos |
| Role-based Auth | `[Authorize(Roles = "Admin")]` en controllers |
| EF Core | Queries parametrizados, sin SQL injection |

## Containerización

```
docker-compose up
       │
       ├── postgres (healthcheck: pg_isready)
       │
       ├── backend (depends_on: postgres healthy)
       │     └── Auto-ejecuta migrations + seed al arrancar
       │
       └── frontend (depends_on: backend)
             └── serve -s dist (SPA con client-side routing)
```

Los tres servicios comparten la red `infrastructure_network`.  
Los datos de PostgreSQL persisten en el volumen `postgres_data`.
