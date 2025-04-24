using System;
using System.Collections.Generic;

namespace HabitTracker.Api.Models;

public class Habit
{
  public Guid Id { get; set; }
  public string Name { get; set; } = null!;
  public int Frequency { get; set; }
  public bool ReminderOn { get; set; }
  public ICollection<HabitLog> Logs { get; set; } = new List<HabitLog>();
}
