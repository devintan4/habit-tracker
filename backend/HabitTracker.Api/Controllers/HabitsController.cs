using System;
using System.Security.Claims;
using System.Threading.Tasks;
using HabitTracker.Api.DTOs;
using HabitTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace HabitTracker.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HabitsController : ControllerBase
{
  private readonly IHabitService _svc;
  public HabitsController(IHabitService svc) => _svc = svc;

  private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

  [HttpGet]
  public async Task<IActionResult> GetAll()
  {
    var userId = GetUserId();
    return Ok(await _svc.GetAllAsync(userId));
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> Get(Guid id)
  {
    var userId = GetUserId();
    var dto = await _svc.GetByIdAsync(userId, id);
    return dto is null ? NotFound() : Ok(dto);
  }

  [HttpPost]
  public async Task<IActionResult> Create(CreateHabitDto dto)
  {
    var userId = GetUserId();
    var created = await _svc.CreateAsync(userId, dto);
    return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Update(Guid id, CreateHabitDto dto) =>
    await _svc.UpdateAsync(GetUserId(), id, dto)
      ? NoContent() : NotFound();

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(Guid id) =>
    await _svc.DeleteAsync(GetUserId(), id)
      ? NoContent() : NotFound();

  [HttpPost("{id}/logs")]
  public async Task<IActionResult> Log(Guid id)
  {
    var dto = await _svc.AddLogAsync(GetUserId(), id);
    return dto is null ? NotFound() : Ok(dto);
  }
}
