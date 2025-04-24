using System;

namespace HabitTracker.Api.Models;

public class HabitLog
{
  public Guid Id { get; set; }
  public Guid HabitId { get; set; }
  public DateTime Date { get; set; }
  public bool Completed { get; set; }
  public Habit Habit { get; set; } = null!;
}
