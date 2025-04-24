namespace HabitTracker.Api.DTOs;

public class CreateHabitDto
{
  public string Name { get; set; } = null!;
  public int Frequency { get; set; }
  public bool ReminderOn { get; set; }
}
