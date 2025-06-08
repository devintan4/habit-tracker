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

  public async Task<IEnumerable<HabitDto>> GetAllAsync(Guid userId)
  {
    var habits = await _repo.GetAllAsync(userId);
    return habits.Select(MapToDto);
  }

  public async Task<HabitDto?> GetByIdAsync(Guid userId, Guid id)
  {
    var h = await _repo.GetByIdAsync(userId, id);
    return h is null ? null : MapToDto(h);
  }

  public async Task<HabitDto> CreateAsync(Guid userId, CreateHabitDto dto)
  {
    var h = new Habit
    {
      Id = Guid.NewGuid(),
      Name = dto.Name,
      Frequency = dto.Frequency,
      ReminderOn = dto.ReminderOn,
      UserId = userId         // ← penting
    };
    await _repo.AddAsync(h);
    await _repo.SaveChangesAsync();
    return MapToDto(h);
  }

  public async Task<bool> UpdateAsync(Guid userId, Guid id, CreateHabitDto dto)
  {
    var h = await _repo.GetByIdAsync(userId, id);
    if (h is null) return false;
    h.Name = dto.Name;
    h.Frequency = dto.Frequency;
    h.ReminderOn = dto.ReminderOn;
    await _repo.UpdateAsync(h);
    await _repo.SaveChangesAsync();
    return true;
  }

  public async Task<bool> DeleteAsync(Guid userId, Guid id)
  {
    var h = await _repo.GetByIdAsync(userId, id);
    if (h is null) return false;
    await _repo.DeleteAsync(h);
    await _repo.SaveChangesAsync();
    return true;
  }

  public async Task<HabitDto?> AddLogAsync(Guid userId, Guid id)
  {
    var habit = await _repo.GetByIdAsync(userId, id);
    if (habit == null) return null;

    var today = DateTime.UtcNow.Date;
    var todayCount = habit.Logs.Count(l => l.Date.Date == today && l.Completed);
    if (todayCount < habit.Frequency)
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

    var updated = await _repo.GetByIdAsync(userId, id);
    return updated is null ? null : MapToDto(updated);
  }

  private static HabitDto MapToDto(Habit h)
  {
    var byDay = h.Logs
      .Where(l => l.Completed)
      .GroupBy(l => l.Date.Date)
      .Select(g => new { Date = g.Key, Count = g.Count() })
      .OrderBy(x => x.Date)
      .ToList();

    int longest = 0, current = 0;
    DateTime? prev = null;
    foreach (var x in byDay)
    {
      if (x.Count >= h.Frequency &&
          (prev.HasValue && (x.Date - prev.Value).Days == 1))
      {
        current++;
      }
      else if (x.Count >= h.Frequency)
      {
        current = 1;
      }
      else
      {
        current = 0;
      }
      longest = Math.Max(longest, current);
      prev = x.Date;
    }

    var today = DateTime.UtcNow.Date;
    var todayCount = byDay.FirstOrDefault(x => x.Date == today)?.Count ?? 0;
    bool done = todayCount >= h.Frequency;

    return new HabitDto
    {
      Id = h.Id,
      Name = h.Name,
      Frequency = h.Frequency,
      ReminderOn = h.ReminderOn,
      CurrentStreak = current,
      LongestStreak = longest,
      CompletedCountToday = todayCount,
      IsDoneToday = done
    };
  }
}