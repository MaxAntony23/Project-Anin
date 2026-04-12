using InfrastructureCore.DTOs;
using InfrastructureCore.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InfrastructureAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AuditoriaController : ControllerBase
{
    private readonly IAuditoriaService _service;

    public AuditoriaController(IAuditoriaService service)
    {
        _service = service;
    }

    [HttpGet("logs")]
    public async Task<ActionResult<AuditoriaListResponseDto>> GetLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] Guid? usuarioId = null,
        [FromQuery] string? tipoAccion = null)
    {
        var result = await _service.GetLogsAsync(page, pageSize, usuarioId, tipoAccion);
        return Ok(result);
    }

    [HttpGet("logs/{id:guid}")]
    public async Task<ActionResult<AuditoriaLogResponseDto>> GetLog(Guid id)
    {
        var result = await _service.GetLogAsync(id);
        if (result == null)
            return NotFound(new { error = "Log no encontrado" });
        return Ok(result);
    }
}
