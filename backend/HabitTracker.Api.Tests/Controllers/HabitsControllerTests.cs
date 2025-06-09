using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using HabitTracker.Api.Controllers;
using HabitTracker.Api.DTOs;
using HabitTracker.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace HabitTracker.Api.Tests.Controllers;

public class HabitsControllerTests
{
  private readonly HabitsController _sut;
  private readonly Mock<IHabitService> _habitServiceMock = new();
  private readonly Guid _testUserId = Guid.NewGuid();

  public HabitsControllerTests()
  {
    _sut = new HabitsController(_habitServiceMock.Object);

    // Controller membutuhkan HttpContext untuk mengakses User Claims.
    // Kita harus membuat mock untuk ini agar GetUserId() berfungsi.
    var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
    {
      new Claim(ClaimTypes.NameIdentifier, _testUserId.ToString()),
    }, "mock"));

    _sut.ControllerContext = new ControllerContext()
    {
      HttpContext = new DefaultHttpContext() { User = user }
    };
  }

  [Fact]
  public async Task GetAll_ShouldReturnOkObjectResult_WithHabitDtos()
  {
    // Arrange
    var habitDtos = new List<HabitDto> { new HabitDto(), new HabitDto() };
    _habitServiceMock.Setup(x => x.GetAllAsync(_testUserId))
      .ReturnsAsync(habitDtos);

    // Act
    var result = await _sut.GetAll();

    // Assert
    var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
    okResult.Value.Should().BeAssignableTo<IEnumerable<HabitDto>>();
    (okResult.Value as IEnumerable<HabitDto>)!.Should().HaveCount(2);
  }

  [Fact]
  public async Task Get_ShouldReturnNotFound_WhenHabitDoesNotExist()
  {
    // Arrange
    var habitId = Guid.NewGuid();
    _habitServiceMock.Setup(x => x.GetByIdAsync(_testUserId, habitId))
      .ReturnsAsync((HabitDto?)null);

    // Act
    var result = await _sut.Get(habitId);

    // Assert
    result.Should().BeOfType<NotFoundResult>();
  }

  [Fact]
  public async Task Create_ShouldReturnCreatedAtAction_WhenSuccessful()
  {
    // Arrange
    var createDto = new CreateHabitDto { Name = "New Habit" };
    var returnedDto = new HabitDto { Id = Guid.NewGuid(), Name = "New Habit" };

    _habitServiceMock.Setup(x => x.CreateAsync(_testUserId, createDto))
      .ReturnsAsync(returnedDto);

    // Act
    var result = await _sut.Create(createDto);

    // Assert
    var createdResult = result.Should().BeOfType<CreatedAtActionResult>().Subject;
    createdResult.ActionName.Should().Be(nameof(HabitsController.Get));
    // PERBAIKAN: Tambahkan '!' untuk mengatasi warning CS8602
    createdResult.RouteValues!["id"].Should().Be(returnedDto.Id);
    createdResult.Value.Should().Be(returnedDto);
  }

  [Fact]
  public async Task Get_ShouldReturnOk_WhenHabitExists()
  {
    // Arrange
    var habitId = Guid.NewGuid();
    var habitDto = new HabitDto { Id = habitId, Name = "Test Habit" };
    _habitServiceMock.Setup(x => x.GetByIdAsync(_testUserId, habitId)).ReturnsAsync(habitDto);

    // Act
    var result = await _sut.Get(habitId);

    // Assert
    var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
    okResult.Value.Should().Be(habitDto);
  }

  [Fact]
  public async Task Update_ShouldReturnNoContent_WhenSuccessful()
  {
    // Arrange
    var habitId = Guid.NewGuid();
    var createDto = new CreateHabitDto();
    _habitServiceMock.Setup(x => x.UpdateAsync(_testUserId, habitId, createDto)).ReturnsAsync(true);

    // Act
    var result = await _sut.Update(habitId, createDto);

    // Assert
    result.Should().BeOfType<NoContentResult>();
  }

  [Fact]
  public async Task Update_ShouldReturnNotFound_WhenHabitDoesNotExist()
  {
    // Arrange
    var habitId = Guid.NewGuid();
    var createDto = new CreateHabitDto();
    _habitServiceMock.Setup(x => x.UpdateAsync(_testUserId, habitId, createDto)).ReturnsAsync(false);

    // Act
    var result = await _sut.Update(habitId, createDto);

    // Assert
    result.Should().BeOfType<NotFoundResult>();
  }

  [Fact]
  public async Task Delete_ShouldReturnNoContent_WhenSuccessful()
  {
    // Arrange
    var habitId = Guid.NewGuid();
    _habitServiceMock.Setup(x => x.DeleteAsync(_testUserId, habitId)).ReturnsAsync(true);

    // Act
    var result = await _sut.Delete(habitId);

    // Assert
    result.Should().BeOfType<NoContentResult>();
  }
}