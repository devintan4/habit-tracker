using System;
using System.Threading.Tasks;
using HabitTracker.Api.DTOs;
using HabitTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HabitTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HabitsController : ControllerBase
{
  private readonly IHabitService _svc;
  public HabitsController(IHabitService svc) => _svc = svc;

  [HttpGet]
  public async Task<IActionResult> GetAll() =>
    Ok(await _svc.GetAllAsync());

  [HttpGet("{id}")]
  public async Task<IActionResult> Get(Guid id)
  {
    var dto = await _svc.GetByIdAsync(id);
    return dto is null ? NotFound() : Ok(dto);
  }

  [HttpPost]
  public async Task<IActionResult> Create(CreateHabitDto dto)
  {
    var created = await _svc.CreateAsync(dto);
    return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Update(Guid id, CreateHabitDto dto) =>
    await _svc.UpdateAsync(id, dto) ? NoContent() : NotFound();

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(Guid id) =>
    await _svc.DeleteAsync(id) ? NoContent() : NotFound();
}
