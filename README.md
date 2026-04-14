# Infrastructure Management System

Sistema de gestión de infraestructuras para la Autoridad Nacional de Infraestructuras de Perú.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/MaxAntony23/infrastructure-system)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![.NET 10](https://img.shields.io/badge/.NET-10.0-purple)](https://dotnet.microsoft.com/download/dotnet/10.0)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB)](https://react.dev)
[![PostgreSQL 17](https://img.shields.io/badge/PostgreSQL-17-336791)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED)](https://www.docker.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6)](https://www.typescriptlang.org)

## Características

- **Gestión Centralizada**: Infraestructuras distribuidas geográficamente con mapa interactivo
- **Reportaje de Incidentes**: Seguimiento en tiempo real con estados y asignación
- **Notificaciones en Vivo**: SignalR para actualizaciones inmediatas sin polling
- **Estadísticas y Dashboards**: Gráficos de incidentes por estado y región
- **Autenticación JWT**: Sistema de roles (Admin / Operador / Visualizador)
- **Auditoría**: Log completo de todas las operaciones del sistema
- **Docker**: Stack completa containerizada, lista para producción

## Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Backend | ASP.NET Core 10 |
| Frontend | React 19 + TypeScript 6 |
| Base de Datos | PostgreSQL 17 |
| Autenticación | JWT + Refresh Tokens |
| Tiempo Real | SignalR |
| ORM | Entity Framework Core 9 |
| UI | Tailwind CSS 4 |
| Mapas | Leaflet + React-Leaflet |
| Gráficos | Chart.js + React-Chartjs-2 |
| Estado | Zustand |
| DevOps | Docker + Docker Compose |

## Quick Start

### Requisitos

- Docker 20.10+
- Docker Compose 2.0+

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/MaxAntony23/infrastructure-system.git
cd infrastructure-system

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Levantar toda la stack
docker-compose up -d

# 4. Verificar que todos los servicios estén corriendo
docker-compose ps
```

### Acceso

| Servicio | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Swagger Docs | http://localhost:5000/swagger |

### Credenciales de Prueba

| Rol | Email | Password |
|---|---|---|
| Admin | admin@test.com | 123456 |
| Operador | operador@test.com | 123456 |
| Visualizador | visualizador@test.com | 123456 |

## Estructura del Proyecto

```
infrastructure-system/
├── Backend/
│   ├── src/
│   │   ├── InfrastructureAPI/      # Controllers, Hubs, Middleware
│   │   ├── InfrastructureCore/     # Entidades, DTOs, Interfaces, Servicios
│   │   └── InfrastructureData/     # EF Core, Migraciones, Seed Data
│   ├── Dockerfile
│   └── Infrastructure.slnx
├── Frontend/
│   ├── src/
│   │   ├── components/             # Componentes reutilizables
│   │   ├── pages/                  # Páginas (Login, Dashboard, etc.)
│   │   ├── services/               # Servicios API (axios)
│   │   ├── store/                  # Estado global (Zustand)
│   │   └── types/                  # Tipos TypeScript
│   ├── Dockerfile
│   └── package.json
├── docs/
│   ├── ARCHITECTURE.md
│   └── SETUP.md
├── docker-compose.yml
├── .env.example
└── README.md
```

## Desarrollo Local (Sin Docker)

### Backend

```bash
cd Backend
dotnet restore
dotnet ef database update --project src/InfrastructureData --startup-project src/InfrastructureAPI
dotnet run --project src/InfrastructureAPI
# Disponible en: http://localhost:5000
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
# Disponible en: http://localhost:5173
```

## Comandos Docker Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild desde cero
docker-compose up --build -d

# Detener servicios
docker-compose down

# Limpiar volúmenes (borra datos de BD)
docker-compose down -v

# Acceder al contenedor del backend
docker-compose exec backend bash

# Acceder a PostgreSQL
docker-compose exec postgres psql -U postgres -d infrastructure_db
```

## API Endpoints

### Autenticación

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | /api/auth/login | Iniciar sesión | No |
| POST | /api/auth/refresh | Refrescar token | No |
| POST | /api/auth/register | Registrar usuario | Admin |

### Infraestructuras

| Método | Ruta | Descripción | Rol mínimo |
|---|---|---|---|
| GET | /api/infraestructuras | Listar | Visualizador |
| GET | /api/infraestructuras/{id} | Detalle | Visualizador |
| POST | /api/infraestructuras | Crear | Operador |
| PUT | /api/infraestructuras/{id} | Actualizar | Operador |
| DELETE | /api/infraestructuras/{id} | Eliminar | Admin |

### Incidentes

| Método | Ruta | Descripción | Rol mínimo |
|---|---|---|---|
| GET | /api/incidentes | Listar | Visualizador |
| GET | /api/incidentes/{id} | Detalle | Visualizador |
| POST | /api/incidentes | Reportar | Operador |
| PUT | /api/incidentes/{id}/asignar | Asignar | Operador |
| PATCH | /api/incidentes/{id}/resolver | Resolver | Operador |

### Estadísticas

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/estadisticas/resumen | Resumen general |
| GET | /api/estadisticas/por-estado | Por estado |
| GET | /api/estadisticas/por-region | Por región |

## Autenticación

```bash
# 1. Obtener token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'

# 2. Usar token en requests
curl http://localhost:5000/api/infraestructuras \
  -H "Authorization: Bearer {token}"
```

## Notificaciones en Tiempo Real

```javascript
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/notifications", {
    accessTokenFactory: () => localStorage.getItem("token")
  })
  .withAutomaticReconnect()
  .build();

connection.on("ReceiveNotification", (notification) => {
  console.log("Nueva notificación:", notification);
});

await connection.start();
```

## Documentación

- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Guía de Instalación Detallada](docs/SETUP.md)

## Licencia

MIT License

---

Desarrollado para la Autoridad Nacional de Infraestructuras de Perú — Proyecto de portafolio 2026
