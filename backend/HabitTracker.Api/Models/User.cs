using System;
using System.Collections.Generic;

namespace HabitTracker.Api.Models
{
  public class User
  {
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public byte[] PasswordHash { get; set; } = null!;
    public byte[] PasswordSalt { get; set; } = null!;
    public ICollection<Habit> Habits { get; set; } = new List<Habit>();
  }
}