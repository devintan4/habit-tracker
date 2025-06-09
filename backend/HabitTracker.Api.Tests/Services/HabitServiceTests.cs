using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using HabitTracker.Api.DTOs;
using HabitTracker.Api.Models;
using HabitTracker.Api.Repositories;
using HabitTracker.Api.Services;
using Moq;
using Xunit;

namespace HabitTracker.Api.Tests.Services;

public class HabitServiceTests
{
  // SUT: System Under Test (Sistem yang sedang diuji)
  private readonly IHabitService _sut;
  // Mock object untuk dependensi IHabitRepository
  private readonly Mock<IHabitRepository> _habitRepoMock = new();

  public HabitServiceTests()
  {
    // Inisialisasi SUT dengan mock repository
    _sut = new HabitService(_habitRepoMock.Object);
  }

  // Penamaan method test yang baik: MethodYangDiuji_Skenario_HasilYangDiharapkan

  [Fact]
  public async Task GetAllAsync_ShouldReturnHabitDtos_WhenHabitsExist()
  {
    // Arrange (Persiapan)
    var userId = Guid.NewGuid();
    var habits = new List<Habit>
    {
      new Habit { Id = Guid.NewGuid(), Name = "Membaca Buku", UserId = userId },
      new Habit { Id = Guid.NewGuid(), Name = "Olahraga", UserId = userId }
    };

    // Konfigurasi mock: Jika GetAllAsync dipanggil dengan userId ini,
    // kembalikan daftar 'habits' yang sudah kita siapkan.
    _habitRepoMock.Setup(x => x.GetAllAsync(userId)).ReturnsAsync(habits);

    // Act (Eksekusi)
    // Panggil method yang ingin kita uji
    var result = await _sut.GetAllAsync(userId);

    // Assert (Pengecekan)
    // Gunakan FluentAssertions untuk verifikasi hasil
    result.Should().NotBeNull();
    result.Should().HaveCount(2);
    result.Should().BeAssignableTo<IEnumerable<HabitDto>>();
  }

  [Fact]
  public async Task GetByIdAsync_ShouldReturnHabitDto_WhenHabitExists()
  {
    // Arrange
    var userId = Guid.NewGuid();
    var habitId = Guid.NewGuid();
    var habit = new Habit { Id = habitId, Name = "Test Habit", UserId = userId };

    _habitRepoMock.Setup(x => x.GetByIdAsync(userId, habitId)).ReturnsAsync(habit);

    // Act
    var result = await _sut.GetByIdAsync(userId, habitId);

    // Assert
    result.Should().NotBeNull();
    result.Should().BeOfType<HabitDto>();
    result!.Id.Should().Be(habitId);
  }

  [Fact]
  public async Task GetByIdAsync_ShouldReturnNull_WhenHabitDoesNotExist()
  {
    // Arrange
    var userId = Guid.NewGuid();
    var habitId = Guid.NewGuid();

    // Konfigurasi mock untuk mengembalikan null
    _habitRepoMock.Setup(x => x.GetByIdAsync(userId, habitId))
      .ReturnsAsync((Habit?)null);

    // Act
    var result = await _sut.GetByIdAsync(userId, habitId);

    // Assert
    result.Should().BeNull();
  }

  [Fact]
  public async Task CreateAsync_ShouldCreateAndReturnHabitDto()
  {
    // Arrange
    var userId = Guid.NewGuid();
    var createDto = new CreateHabitDto { Name = "New Habit", Frequency = 1 };

    // Act
    var result = await _sut.CreateAsync(userId, createDto);

    // Assert
    result.Should().NotBeNull();
    result.Name.Should().Be(createDto.Name);

    // Verifikasi bahwa method AddAsync dan SaveChangesAsync di repository
    // benar-benar dipanggil TEPAT SATU KALI.
    _habitRepoMock.Verify(x => x.AddAsync(It.IsAny<Habit>()), Times.Once);
    _habitRepoMock.Verify(x => x.SaveChangesAsync(), Times.Once);
  }

  [Fact]
  public async Task UpdateAsync_ShouldReturnTrue_WhenHabitExists()
  {
    // Arrange
    var userId = Guid.NewGuid();
    var habitId = Guid.NewGuid();
    var habit = new Habit { Id = habitId, UserId = userId, Name = "Old Name" };
    var updateDto = new CreateHabitDto { Name = "New Name" };

    _habitRepoMock.Setup(x => x.GetByIdAsync(userId, habitId)).ReturnsAsync(habit);

    // Act
    var result = await _sut.UpdateAsync(userId, habitId, updateDto);

    // Assert
    result.Should().BeTrue();
    // Verifikasi bahwa perubahan disimpan
    _habitRepoMock.Verify(x => x.UpdateAsync(It.IsAny<Habit>()), Times.Once);
    _habitRepoMock.Verify(x => x.SaveChangesAsync(), Times.Once);
  }

  [Fact]
  public async Task UpdateAsync_ShouldReturnFalse_WhenHabitDoesNotExist()
  {
    // Arrange
    var userId = Guid.NewGuid();
    var habitId = Guid.NewGuid();
    var updateDto = new CreateHabitDto { Name = "New Name" };

    _habitRepoMock.Setup(x => x.GetByIdAsync(userId, habitId)).ReturnsAsync((Habit?)null);

    // Act
    var result = await _sut.UpdateAsync(userId, habitId, updateDto);

    // Assert
    result.Should().BeFalse();
    _habitRepoMock.Verify(x => x.UpdateAsync(It.IsAny<Habit>()), Times.Never);
  }

  [Fact]
  public async Task AddLogAsync_ShouldAddLog_WhenFrequencyNotMet()
  {
    // Arrange
    var userId = Guid.NewGuid();
    var habitId = Guid.NewGuid();
    var habit = new Habit
    {
      Id = habitId,
      UserId = userId,
      Frequency = 2, // Target 2 kali sehari
      Logs = new List<HabitLog>
        {
            // Baru selesai 1 kali hari ini
            new HabitLog { Date = DateTime.UtcNow, Completed = true }
        }
    };
    _habitRepoMock.Setup(x => x.GetByIdAsync(userId, habitId)).ReturnsAsync(habit);
    // Setup untuk refresh data setelah save
    _habitRepoMock.Setup(x => x.GetByIdAsync(userId, habitId)).ReturnsAsync(habit);


    // Act
    var result = await _sut.AddLogAsync(userId, habitId);

    // Assert
    result.Should().NotBeNull();
    _habitRepoMock.Verify(x => x.AddLogAsync(It.IsAny<HabitLog>()), Times.Once);
    _habitRepoMock.Verify(x => x.SaveChangesAsync(), Times.Once);
  }

  [Fact]
  public async Task AddLogAsync_ShouldNotAddLog_WhenFrequencyIsMet()
  {
    // Arrange
    var userId = Guid.NewGuid();
    var habitId = Guid.NewGuid();
    var habit = new Habit
    {
      Id = habitId,
      UserId = userId,
      Frequency = 2, // Target 2 kali sehari
      Logs = new List<HabitLog>
        {
            // Sudah selesai 2 kali hari ini
            new HabitLog { Date = DateTime.UtcNow, Completed = true },
            new HabitLog { Date = DateTime.UtcNow, Completed = true }
        }
    };
    _habitRepoMock.Setup(x => x.GetByIdAsync(userId, habitId)).ReturnsAsync(habit);

    // Act
    var result = await _sut.AddLogAsync(userId, habitId);

    // Assert
    result.Should().NotBeNull();
    // Verifikasi bahwa TIDAK ADA log baru yang ditambahkan
    _habitRepoMock.Verify(x => x.AddLogAsync(It.IsAny<HabitLog>()), Times.Never);
  }
}