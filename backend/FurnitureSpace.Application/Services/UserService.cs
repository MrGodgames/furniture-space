using AutoMapper;
using FurnitureSpace.Application.DTOs;
using FurnitureSpace.Domain.Interfaces;

namespace FurnitureSpace.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IMapper _mapper;

    public UserService(IUserRepository userRepository, IOrderRepository orderRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _orderRepository = orderRepository;
        _mapper = mapper;
    }

    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user != null ? _mapper.Map<UserDto>(user) : null;
    }

    public async Task<UserDto?> GetUserByEmailAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        return user != null ? _mapper.Map<UserDto>(user) : null;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<UserDto>>(users);
    }

    public async Task<UserDto> UpdateUserAsync(int id, UserDto userDto)
    {
        var existingUser = await _userRepository.GetByIdAsync(id);
        if (existingUser == null)
            throw new ArgumentException("Пользователь не найден");

        // Обновляем только разрешенные поля
        existingUser.Name = userDto.Name;
        existingUser.Phone = userDto.Phone;
        existingUser.Address = userDto.Address;
        existingUser.Avatar = userDto.Avatar;

        var updatedUser = await _userRepository.UpdateAsync(existingUser);
        return _mapper.Map<UserDto>(updatedUser);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        return await _userRepository.DeleteAsync(id);
    }

    public async Task<bool> DeactivateUserAsync(int id)
    {
        return await _userRepository.DeactivateUserAsync(id);
    }

    public async Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId)
    {
        var orders = await _orderRepository.GetUserOrdersWithItemsAsync(userId);
        return _mapper.Map<IEnumerable<OrderDto>>(orders);
    }
} 