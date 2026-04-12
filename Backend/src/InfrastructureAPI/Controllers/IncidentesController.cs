using InfrastructureCore.DTOs;
using InfrastructureCore.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InfrastructureAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IncidentesController : ControllerBase
{
    private readonly IIncidenteService _service;

    public IncidentesController(IIncidenteService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IncidenteListResponseDto>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? estado = null,
        [FromQuery] string? severidad = null)
    {
        var result = await _service.GetAllAsync(page, pageSize, estado, severidad);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<IncidenteResponseDto>> Get(Guid id)
    {
        try
        {
            var result = await _service.GetAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpGet("infraestructura/{infraId:guid}")]
    public async Task<ActionResult<List<IncidenteResponseDto>>> GetByInfraestructura(Guid infraId)
    {
        var result = await _service.GetByInfrastructuraAsync(infraId);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Operador")]
    public async Task<ActionResult<IncidenteResponseDto>> Create([FromBody] CreateIncidenteDto dto)
    {
        try
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id:guid}/asignar")]
    [Authorize(Roles = "Admin,Operador")]
    public async Task<ActionResult<IncidenteResponseDto>> Asignar(Guid id, [FromBody] AsignarIncidenteDto dto)
    {
        try
        {
            var result = await _service.AsignarAsync(id, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpPatch("{id:guid}/resolver")]
    [Authorize(Roles = "Admin,Operador")]
    public async Task<ActionResult<IncidenteResponseDto>> Resolver(Guid id, [FromBody] ResolverIncidenteDto dto)
    {
        try
        {
            var result = await _service.ResolverAsync(id, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }
}
