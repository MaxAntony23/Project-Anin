using InfrastructureCore.DTOs;
using InfrastructureCore.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InfrastructureAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InfraestructurasController : ControllerBase
{
    private readonly IInfrastructuraService _service;

    public InfraestructurasController(IInfrastructuraService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<InfrastructuraListResponseDto>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? estado = null,
        [FromQuery] string? region = null,
        [FromQuery] string? search = null)
    {
        var result = await _service.GetAllAsync(page, pageSize, estado, region, search);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<InfrastructuraResponseDto>> Get(Guid id)
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

    [HttpGet("por-region/{region}")]
    public async Task<ActionResult<List<InfrastructuraResponseDto>>> GetByRegion(string region)
    {
        var result = await _service.GetByRegionAsync(region);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Operador")]
    public async Task<ActionResult<InfrastructuraResponseDto>> Create([FromBody] CreateInfrastructuraDto dto)
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

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Operador")]
    public async Task<ActionResult<InfrastructuraResponseDto>> Update(Guid id, [FromBody] UpdateInfrastructuraDto dto)
    {
        try
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }
}
