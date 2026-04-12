using System.Security.Claims;
using InfrastructureCore.Interfaces;

namespace InfrastructureAPI.Middleware;

public class AuditoriaMiddleware
{
    private readonly RequestDelegate _next;
    private static readonly string[] MutationMethods = ["POST", "PUT", "DELETE", "PATCH"];

    public AuditoriaMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    // IAuditoriaService se inyecta por parámetro (scoped en middleware singleton)
    public async Task InvokeAsync(HttpContext context, IAuditoriaService auditoriaService)
    {
        await _next(context);

        // Auditar solo después de una respuesta exitosa (2xx) en mutaciones
        if (!MutationMethods.Contains(context.Request.Method))
            return;

        if (context.Response.StatusCode < 200 || context.Response.StatusCode >= 300)
            return;

        var userIdClaim = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
            return;

        try
        {
            var path = context.Request.Path.Value ?? string.Empty;
            var (tipoAccion, entidadTipo) = ResolveActionAndEntity(context.Request.Method, path);
            var entidadId = ExtractIdFromPath(path);
            var ip = context.Connection.RemoteIpAddress?.ToString();

            await auditoriaService.LogActionAsync(userId, tipoAccion, entidadTipo, entidadId, direccionIP: ip);
        }
        catch
        {
            // Auditoría nunca debe romper la request
        }
    }

    private static (string tipoAccion, string entidadTipo) ResolveActionAndEntity(string method, string path)
    {
        var tipoAccion = method switch
        {
            "POST" => "Create",
            "PUT" => "Update",
            "PATCH" => "Update",
            "DELETE" => "Delete",
            _ => "Unknown"
        };

        var entidadTipo = "Sistema";
        var pathLower = path.ToLowerInvariant();

        if (pathLower.Contains("infraestructura")) entidadTipo = "Infraestructura";
        else if (pathLower.Contains("incidente")) entidadTipo = "Incidente";
        else if (pathLower.Contains("usuario") || pathLower.Contains("auth")) entidadTipo = "Usuario";

        return (tipoAccion, entidadTipo);
    }

    private static Guid ExtractIdFromPath(string path)
    {
        var segments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
        foreach (var segment in segments.Reverse())
        {
            if (Guid.TryParse(segment, out var id))
                return id;
        }
        return Guid.NewGuid(); // ID sintético para operaciones sin ID en path (ej: POST)
    }
}
