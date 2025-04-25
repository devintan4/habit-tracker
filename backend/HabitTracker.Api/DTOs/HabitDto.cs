using System;

namespace HabitTracker.Api.DTOs;

public class HabitDto
{
  public Guid Id { get; set; }
  public string Name { get; set; } = null!;
  public int Frequency { get; set; }
  public bool ReminderOn { get; set; }
  public int CurrentStreak { get; set; }
  public int LongestStreak { get; set; }
  public bool IsDoneToday { get; set; }
}
