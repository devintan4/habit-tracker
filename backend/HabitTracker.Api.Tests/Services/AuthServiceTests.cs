using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using HabitTracker.Api.DTOs;
using HabitTracker.Api.Models;
using HabitTracker.Api.Repositories;
using HabitTracker.Api.Services;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace HabitTracker.Api.Tests.Services;

public class AuthServiceTests
{
  private readonly AuthService _sut;
  private readonly Mock<IUserRepository> _userRepoMock = new();
  private readonly Mock<IConfiguration> _configMock = new();

  public AuthServiceTests()
  {
    // Mocking IConfiguration adalah hal penting untuk JWT
    // Kita harus menyediakan nilai-nilai yang dibutuhkan oleh AuthService
    var inMemorySettings = new Dictionary<string, string> {
        {"Jwt:Key", "f/x6049o/YwMPvsIST0A45CRrmrp2+rytUBeGJXaIm9cxaeihItth3v1ebY3LJXztFIA1wUPwWwb5GvQSOwwHKAxAL0mTAb6heQLQvgrSNa0FxOG4/cELxGEoF08qIoLHMzA2AbtjhaRH6Atu7LTk10A2l7I6RNdb+RWOI5vZds="},
        {"Jwt:Issuer", "Test.Api"},
        {"Jwt:Audience", "Test.Client"},
        {"Jwt:ExpiresInMinutes", "1"}
    };

    IConfiguration configuration = new ConfigurationBuilder()
        .AddInMemoryCollection(inMemorySettings!)
        .Build();

    _sut = new AuthService(_userRepoMock.Object, configuration);
  }

  [Fact]
  public async Task LoginAsync_ShouldReturnToken_WhenCredentialsAreValid()
  {
    // Arrange
    var password = "password123";
    var loginDto = new LoginDto { Username = "testuser", Password = password };

    // Buat hash & salt secara manual untuk user mock kita
    using var hmac = new HMACSHA512();
    var user = new User
    {
      Id = Guid.NewGuid(),
      Username = "testuser",
      PasswordSalt = hmac.Key,
      PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password))
    };

    _userRepoMock.Setup(x => x.GetByUsernameAsync("testuser")).ReturnsAsync(user);

    // Act
    var result = await _sut.LoginAsync(loginDto);

    // Assert
    result.Should().NotBeNullOrEmpty();
    // Token JWT selalu memiliki 2 titik
    result.Should().Contain(".");
  }

  [Fact]
  public async Task LoginAsync_ShouldReturnNull_WhenPasswordIsIncorrect()
  {
    // Arrange
    var password = "password123";
    var wrongPasswordDto = new LoginDto { Username = "testuser", Password = "wrong_password" };

    using var hmac = new HMACSHA512();
    var user = new User
    {
      Id = Guid.NewGuid(),
      Username = "testuser",
      PasswordSalt = hmac.Key,
      PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password))
    };

    _userRepoMock.Setup(x => x.GetByUsernameAsync("testuser")).ReturnsAsync(user);

    // Act
    var result = await _sut.LoginAsync(wrongPasswordDto);

    // Assert
    result.Should().BeNull();
  }

  [Fact]
  public async Task RegisterAsync_ShouldReturnTrue_WhenUsernameIsUnique()
  {
    // Arrange
    var registerDto = new RegisterDto { Username = "newuser", Password = "password123" };
    // Setup repo untuk mengindikasikan username belum ada
    _userRepoMock.Setup(x => x.GetByUsernameAsync("newuser")).ReturnsAsync((User?)null);

    // Act
    var result = await _sut.RegisterAsync(registerDto);

    // Assert
    result.Should().BeTrue();
    // Verifikasi bahwa user baru benar-benar disimpan ke database
    _userRepoMock.Verify(x => x.AddAsync(It.IsAny<User>()), Times.Once);
    _userRepoMock.Verify(x => x.SaveChangesAsync(), Times.Once);
  }

  [Fact]
  public async Task RegisterAsync_ShouldReturnFalse_WhenUsernameExists()
  {
    // Arrange
    var registerDto = new RegisterDto { Username = "existinguser", Password = "password123" };
    // Setup repo untuk mengindikasikan username sudah ada
    _userRepoMock.Setup(x => x.GetByUsernameAsync("existinguser")).ReturnsAsync(new User());

    // Act
    var result = await _sut.RegisterAsync(registerDto);

    // Assert
    result.Should().BeFalse();
    // Verifikasi bahwa tidak ada user baru yang disimpan
    _userRepoMock.Verify(x => x.AddAsync(It.IsAny<User>()), Times.Never);
  }
}