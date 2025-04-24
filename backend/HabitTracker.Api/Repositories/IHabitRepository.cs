using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HabitTracker.Api.Models;

namespace HabitTracker.Api.Repositories;

public interface IHabitRepository
{
  Task<IEnumerable<Habit>> GetAllAsync();
  Task<Habit?> GetByIdAsync(Guid id);
  Task AddAsync(Habit habit);
  Task UpdateAsync(Habit habit);
  Task DeleteAsync(Habit habit);
  Task SaveChangesAsync();
}
