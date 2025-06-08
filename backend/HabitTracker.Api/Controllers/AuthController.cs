using System.Threading.Tasks;
using HabitTracker.Api.DTOs;
using HabitTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HabitTracker.Api.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly IAuthService _auth;
    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
      var ok = await _auth.RegisterAsync(dto);
      return ok ? StatusCode(201) : BadRequest("Username sudah dipakai");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
      var token = await _auth.LoginAsync(dto);
      return token is null ? Unauthorized() : Ok(new AuthResponseDto { Token = token });
    }
  }
}