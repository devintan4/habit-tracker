using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using HabitTracker.Api.DTOs;
using HabitTracker.Api.Models;
using HabitTracker.Api.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HabitTracker.Api.Services
{
  public class AuthService : IAuthService
  {
    private readonly IUserRepository _userRepo;
    private readonly IConfiguration _config;
    public AuthService(IUserRepository userRepo, IConfiguration config)
    {
      _userRepo = userRepo;
      _config = config;
    }

    public async Task<bool> RegisterAsync(RegisterDto dto)
    {
      if (await _userRepo.GetByUsernameAsync(dto.Username) != null)
        return false;

      using var hmac = new HMACSHA512();
      var user = new User
      {
        Id = Guid.NewGuid(),
        Username = dto.Username,
        PasswordHash =
          hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password)),
        PasswordSalt = hmac.Key
      };
      await _userRepo.AddAsync(user);
      await _userRepo.SaveChangesAsync();
      return true;
    }

    public async Task<string?> LoginAsync(LoginDto dto)
    {
      var user = await _userRepo.GetByUsernameAsync(dto.Username);
      if (user == null) return null;

      using var hmac = new HMACSHA512(user.PasswordSalt);
      var computed =
        hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));
      if (!computed.AsSpan().SequenceEqual(user.PasswordHash))
        return null;

      // generate JWT
      var claims = new List<Claim>
      {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username)
      };
      var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
      var creds = new SigningCredentials(
        key, SecurityAlgorithms.HmacSha512Signature);
      var expires = DateTime.UtcNow.AddMinutes(
        double.Parse(_config["Jwt:ExpiresInMinutes"]!));
      var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: expires,
        signingCredentials: creds
      );
      return new JwtSecurityTokenHandler().WriteToken(token);
    }
  }
}