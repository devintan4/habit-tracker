using System.Threading.Tasks;
using HabitTracker.Api.Data;
using HabitTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HabitTracker.Api.Repositories
{
  public class UserRepository : IUserRepository
  {
    private readonly AppDbContext _ctx;
    public UserRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<User?> GetByUsernameAsync(string username) =>
      await _ctx.Users.SingleOrDefaultAsync(u => u.Username == username);

    public async Task AddAsync(User user) =>
      await _ctx.Users.AddAsync(user);

    public async Task SaveChangesAsync() =>
      await _ctx.SaveChangesAsync();
  }
}