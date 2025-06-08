using System.Threading.Tasks;
using HabitTracker.Api.DTOs;

namespace HabitTracker.Api.Services
{
  public interface IAuthService
  {
    Task<bool> RegisterAsync(RegisterDto dto);
    Task<string?> LoginAsync(LoginDto dto);
  }
}