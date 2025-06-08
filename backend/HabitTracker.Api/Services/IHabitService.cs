using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HabitTracker.Api.DTOs;

namespace HabitTracker.Api.Services;

public interface IHabitService
{
  Task<IEnumerable<HabitDto>> GetAllAsync(Guid userId);
  Task<HabitDto?> GetByIdAsync(Guid userId, Guid id);
  Task<HabitDto> CreateAsync(Guid userId, CreateHabitDto dto);
  Task<bool> UpdateAsync(Guid userId, Guid id, CreateHabitDto dto);
  Task<bool> DeleteAsync(Guid userId, Guid id);
  Task<HabitDto?> AddLogAsync(Guid userId, Guid id);
}