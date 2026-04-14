# Setup Guide

## Opción A: Con Docker (Recomendado)

### Requisitos

- Docker 20.10+
- Docker Compose 2.0+
- Git

### Pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/MaxAntony23/infrastructure-system.git
cd infrastructure-system

# 2. Copiar variables de entorno (los defaults funcionan para Docker)
cp .env.example .env

# 3. Levantar toda la stack
docker-compose up -d

# 4. Verificar que todos los servicios estén Up
docker-compose ps
```

Esperar ~30 segundos mientras el backend aplica migraciones y puebla la BD.

### URLs de Acceso

| Servicio | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Swagger | http://localhost:5000/swagger |
| PostgreSQL | localhost:5432 |

### Credenciales Iniciales

| Rol | Email | Password |
|---|---|---|
| Admin | admin@test.com | 123456 |
| Operador | operador@test.com | 123456 |
| Visualizador | visualizador@test.com | 123456 |

---

## Opción B: Desarrollo Local (Sin Docker)

### Requisitos

- .NET 10 SDK
- Node.js 22+
- PostgreSQL 17
- Git

### Backend

```bash
# 1. Crear la base de datos
createdb infrastructure_db
# o en psql: CREATE DATABASE infrastructure_db;

# 2. Verificar connection string en Backend/src/InfrastructureAPI/appsettings.json
# Por defecto: Host=localhost;Database=infrastructure_db;Username=postgres;Password=Max14252;Port=5432

# 3. Restaurar paquetes y aplicar migraciones
cd Backend
dotnet restore
dotnet ef database update \
  --project src/InfrastructureData \
  --startup-project src/InfrastructureAPI

# 4. Ejecutar
dotnet run --project src/InfrastructureAPI
# Disponible en: http://localhost:5000
```

### Frontend

```bash
# En otra terminal
cd Frontend
npm install
npm run dev
# Disponible en: http://localhost:5173
```

---

## Variables de Entorno

### Backend (via docker-compose o appsettings)

| Variable | Descripción | Default (Docker) |
|---|---|---|
| `ConnectionStrings__DefaultConnection` | Cadena de conexión PostgreSQL | Host=postgres;... |
| `ASPNETCORE_ENVIRONMENT` | Entorno de ejecución | Production |
| `Jwt__SecretKey` | Clave de firma JWT | (ver .env.example) |
| `Jwt__ExpirationHours` | TTL del access token | 8 |

### Frontend (via .env)

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_URL` | URL base del backend | http://localhost:5000/api |

---

## Troubleshooting

### Puerto 5432 ya en uso

```bash
# Opción 1: Cambiar puerto en docker-compose.yml
# "5433:5432"  ← puerto del host : puerto del contenedor

# Opción 2: Detener PostgreSQL local (Linux/Mac)
sudo systemctl stop postgresql

# Windows (PowerShell como admin)
Stop-Service postgresql-x64-17
```

### Puerto 5000 o 3000 ya en uso

```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :5000   # Windows
lsof -ti:5000                   # Linux/Mac

# Cambiar el puerto en docker-compose.yml:
# "5001:5000"  ← nuevo puerto del host
```

### Base de datos no inicializa correctamente

```bash
# Limpiar completamente y reiniciar
docker-compose down -v
docker-compose up -d
```

### Frontend no conecta con el backend

1. Verificar que el backend esté corriendo: `docker-compose ps`
2. Revisar `VITE_API_URL` apunte al host correcto
3. En producción (Docker), el frontend hace peticiones desde el **navegador del usuario**, no desde el contenedor. La URL debe ser accesible desde el navegador.
4. Revisar logs del backend: `docker-compose logs backend`

### Errores de migración en el backend

```bash
# Eliminar y recrear la BD (borra todos los datos)
docker-compose down -v
docker-compose up -d

# O desde el contenedor:
docker-compose exec backend dotnet ef database drop --force
docker-compose exec backend dotnet ef database update
```

---

## Comandos de Mantenimiento

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Rebuild de un servicio específico
docker-compose up --build backend -d

# Ejecutar comando en el contenedor del backend
docker-compose exec backend bash

# Acceder a PostgreSQL
docker-compose exec postgres psql -U postgres -d infrastructure_db

# Backup de la BD
docker-compose exec postgres pg_dump -U postgres infrastructure_db > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U postgres infrastructure_db < backup.sql
```

---

## Build para Producción

### Backend

```bash
cd Backend
dotnet publish src/InfrastructureAPI/InfrastructureAPI.csproj \
  -c Release \
  -o ./publish
```

### Frontend

```bash
cd Frontend
npm run build
# Build en: Frontend/dist/
```

### Docker (recomendado para producción)

```bash
# Construir imágenes optimizadas
docker-compose build

# Subir a registry (ejemplo Docker Hub)
docker tag infrastructure_api tu-usuario/infrastructure-api:latest
docker tag infrastructure_web tu-usuario/infrastructure-web:latest
docker push tu-usuario/infrastructure-api:latest
docker push tu-usuario/infrastructure-web:latest
```

---

## Checklist Pre-Producción

- [ ] Cambiar `Jwt__SecretKey` por un valor seguro (mínimo 32 caracteres)
- [ ] Cambiar password de PostgreSQL
- [ ] Configurar HTTPS / TLS (nginx reverse proxy o certificado en ASP.NET)
- [ ] Actualizar orígenes CORS en `Program.cs` con el dominio real
- [ ] Configurar backups automáticos de la BD
- [ ] Revisar niveles de logging para producción
