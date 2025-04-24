using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HabitTracker.Api.DTOs;

namespace HabitTracker.Api.Services;

public interface IHabitService
{
  Task<IEnumerable<HabitDto>> GetAllAsync();
  Task<HabitDto?> GetByIdAsync(Guid id);
  Task<HabitDto> CreateAsync(CreateHabitDto dto);
  Task<bool> UpdateAsync(Guid id, CreateHabitDto dto);
  Task<bool> DeleteAsync(Guid id);
}
