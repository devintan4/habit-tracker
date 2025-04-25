using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HabitTracker.Api.DTOs;
using HabitTracker.Api.Models;
using HabitTracker.Api.Repositories;

namespace HabitTracker.Api.Services;

public class HabitService : IHabitService
{
  private readonly IHabitRepository _repo;
  public HabitService(IHabitRepository repo) => _repo = repo;

  public async Task<IEnumerable<HabitDto>> GetAllAsync()
  {
    var habits = await _repo.GetAllAsync();
    return habits.Select(MapToDto);
  }

  public async Task<HabitDto?> GetByIdAsync(Guid id)
  {
    var h = await _repo.GetByIdAsync(id);
    return h is null ? null : MapToDto(h);
  }

  public async Task<HabitDto> CreateAsync(CreateHabitDto dto)
  {
    var h = new Habit
    {
      Id = Guid.NewGuid(),
      Name = dto.Name,
      Frequency = dto.Frequency,
      ReminderOn = dto.ReminderOn
    };
    await _repo.AddAsync(h);
    await _repo.SaveChangesAsync();
    return MapToDto(h);
  }

  public async Task<bool> UpdateAsync(Guid id, CreateHabitDto dto)
  {
    var h = await _repo.GetByIdAsync(id);
    if (h is null) return false;
    h.Name = dto.Name;
    h.Frequency = dto.Frequency;
    h.ReminderOn = dto.ReminderOn;
    await _repo.UpdateAsync(h);
    await _repo.SaveChangesAsync();
    return true;
  }

  public async Task<bool> DeleteAsync(Guid id)
  {
    var h = await _repo.GetByIdAsync(id);
    if (h is null) return false;
    await _repo.DeleteAsync(h);
    await _repo.SaveChangesAsync();
    return true;
  }

  private static HabitDto MapToDto(Habit h)
  {
    // hitung streak sederhana
    var dates = h.Logs
        .Where(l => l.Completed)
        .Select(l => l.Date.Date)
        .Distinct()
        .OrderBy(d => d)
        .ToList();

    int longest = 0, current = 0;
    DateTime? prev = null;
    foreach (var d in dates)
    {
      current = (prev.HasValue && (d - prev.Value).Days == 1) ? current + 1 : 1;
      if (current > longest) longest = current;
      prev = d;
    }

    return new HabitDto
    {
      Id = h.Id,
      Name = h.Name,
      Frequency = h.Frequency,
      ReminderOn = h.ReminderOn,
      CurrentStreak = current,
      LongestStreak = longest,
      IsDoneToday = isDoneToday
    };
  }

  public async Task<HabitDto?> AddLogAsync(Guid id)
  {
    var habit = await _repo.GetByIdAsync(id);
    if (habit == null) return null;

    // hanya tambah log jika belum ada untuk hari ini
    var today = DateTime.UtcNow.Date;
    if (!habit.Logs.Any(l => l.Date.Date == today))
    {
      var log = new HabitLog
      {
        Id = Guid.NewGuid(),
        HabitId = id,
        Date = DateTime.UtcNow,
        Completed = true
      };
      await _repo.AddLogAsync(log);
      await _repo.SaveChangesAsync();
    }

    // reload habit & logs untuk hitung streak
    var updated = await _repo.GetByIdAsync(id);
    return updated is null ? null : MapToDto(updated);
  }
}
