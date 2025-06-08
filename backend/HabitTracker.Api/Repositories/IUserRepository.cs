using System.Threading.Tasks;
using HabitTracker.Api.Models;

namespace HabitTracker.Api.Repositories
{
  public interface IUserRepository
  {
    Task<User?> GetByUsernameAsync(string username);
    Task AddAsync(User user);
    Task SaveChangesAsync();
  }
}