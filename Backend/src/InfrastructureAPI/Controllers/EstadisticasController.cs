using InfrastructureCore.DTOs;
using InfrastructureCore.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InfrastructureAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EstadisticasController : ControllerBase
{
    private readonly IEstadisticasService _service;

    public EstadisticasController(IEstadisticasService service)
    {
        _service = service;
    }

    [HttpGet("resumen")]
    public async Task<ActionResult<ResumenEstadisticasDto>> GetResumen()
    {
        var result = await _service.GetResumenAsync();
        return Ok(result);
    }

    [HttpGet("por-estado")]
    public async Task<ActionResult<InfraestructurasPorEstadoDto>> GetPorEstado()
    {
        var result = await _service.GetInfraestructurasPorEstadoAsync();
        return Ok(result);
    }

    [HttpGet("por-region")]
    public async Task<ActionResult<List<InfraestructurasPorRegionDto>>> GetPorRegion()
    {
        var result = await _service.GetInfraestructurasPorRegionAsync();
        return Ok(result);
    }
}
