using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HabitTracker.Api.Data;
using HabitTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HabitTracker.Api.Repositories;

public class HabitRepository : IHabitRepository
{
  private readonly AppDbContext _ctx;
  public HabitRepository(AppDbContext ctx) => _ctx = ctx;

  public async Task<IEnumerable<Habit>> GetAllAsync(Guid userId) =>
    await _ctx.Habits.Where(h => h.UserId == userId)
      .Include(h => h.Logs)
      .ToListAsync();

  public async Task<Habit?> GetByIdAsync(Guid userId, Guid id) =>
    await _ctx.Habits
      .Where(h => h.UserId == userId && h.Id == id)
      .Include(h => h.Logs)
      .FirstOrDefaultAsync();

  public async Task AddAsync(Habit habit) =>
    await _ctx.Habits.AddAsync(habit);

  public Task UpdateAsync(Habit habit)
  {
    _ctx.Habits.Update(habit);
    return Task.CompletedTask;
  }

  public Task DeleteAsync(Habit habit)
  {
    _ctx.Habits.Remove(habit);
    return Task.CompletedTask;
  }

  public async Task AddLogAsync(HabitLog log) =>
    await _ctx.HabitLogs.AddAsync(log);

  public async Task SaveChangesAsync() =>
    await _ctx.SaveChangesAsync();
}