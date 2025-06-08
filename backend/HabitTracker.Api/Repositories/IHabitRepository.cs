using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HabitTracker.Api.Models;

namespace HabitTracker.Api.Repositories;

public interface IHabitRepository
{
  Task<IEnumerable<Habit>> GetAllAsync(Guid userId);
  Task<Habit?> GetByIdAsync(Guid userId, Guid id);
  Task AddAsync(Habit habit);
  Task UpdateAsync(Habit habit);
  Task DeleteAsync(Habit habit);
  Task AddLogAsync(HabitLog log);
  Task SaveChangesAsync();
}