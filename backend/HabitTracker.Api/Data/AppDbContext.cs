using HabitTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HabitTracker.Api.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options)
      : base(options) { }

  public DbSet<Habit> Habits { get; set; }
  public DbSet<HabitLog> HabitLogs { get; set; }

  protected override void OnModelCreating(ModelBuilder mb)
  {
    mb.Entity<Habit>()
      .HasMany(h => h.Logs)
      .WithOne(l => l.Habit)
      .HasForeignKey(l => l.HabitId);
    base.OnModelCreating(mb);
  }
}
