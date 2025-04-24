using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HabitTracker.Api.Data;
using HabitTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HabitTracker.Api.Repositories;

public class HabitRepository : IHabitRepository
{
  private readonly AppDbContext _ctx;
  public HabitRepository(AppDbContext ctx) => _ctx = ctx;

  public async Task<IEnumerable<Habit>> GetAllAsync() =>
    await _ctx.Habits.Include(h => h.Logs).ToListAsync();

  public async Task<Habit?> GetByIdAsync(Guid id) =>
    await _ctx.Habits.Include(h => h.Logs)
      .FirstOrDefaultAsync(h => h.Id == id);

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

  public async Task SaveChangesAsync() =>
    await _ctx.SaveChangesAsync();
}
