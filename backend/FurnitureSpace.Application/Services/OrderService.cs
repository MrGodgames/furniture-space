using AutoMapper;
using FurnitureSpace.Application.DTOs;
using FurnitureSpace.Domain.Entities;
using FurnitureSpace.Domain.Interfaces;

namespace FurnitureSpace.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public OrderService(IOrderRepository orderRepository, IProductRepository productRepository, IUserRepository userRepository, IMapper mapper)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto createOrderDto)
    {
        // Получаем пользователя для автозаполнения адреса
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new ArgumentException("Пользователь не найден");
        }

        // Если адрес доставки не указан или пустой, используем адрес из профиля пользователя
        string shippingAddress = createOrderDto.ShippingAddress;
        if (string.IsNullOrWhiteSpace(shippingAddress) && !string.IsNullOrWhiteSpace(user.Address))
        {
            shippingAddress = user.Address;
        }

        // Создаем заказ
        var order = new Order
        {
            UserId = userId,
            ShippingAddress = shippingAddress,
            PaymentMethod = createOrderDto.PaymentMethod,
            PaymentStatus = "pending",
            Status = "pending",
            Notes = createOrderDto.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Добавляем товары и вычисляем общую сумму
        decimal totalAmount = 0;
        foreach (var itemDto in createOrderDto.Items)
        {
            var product = await _productRepository.GetByIdAsync(itemDto.ProductId);
            if (product == null)
            {
                throw new ArgumentException($"Товар с ID {itemDto.ProductId} не найден");
            }

            if (!product.InStock.GetValueOrDefault())
            {
                throw new ArgumentException($"Товар '{product.Name}' недоступен для заказа");
            }

            var orderItem = new OrderItem
            {
                ProductId = itemDto.ProductId,
                Quantity = itemDto.Quantity,
                UnitPrice = product.Price,
                TotalPrice = product.Price * itemDto.Quantity,
                CreatedAt = DateTime.UtcNow
            };

            order.OrderItems.Add(orderItem);
            totalAmount += orderItem.TotalPrice;
        }

        order.TotalAmount = totalAmount;

        // Сохраняем заказ
        var createdOrder = await _orderRepository.CreateAsync(order);
        
        // Возвращаем DTO
        var orderDto = _mapper.Map<OrderDto>(createdOrder);
        orderDto.Date = createdOrder.CreatedAt;
        
        return orderDto;
    }

    public async Task<OrderDto> GetOrderByIdAsync(int orderId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
        {
            throw new ArgumentException("Заказ не найден");
        }

        var orderDto = _mapper.Map<OrderDto>(order);
        orderDto.Date = order.CreatedAt;
        
        return orderDto;
    }

    public async Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId)
    {
        var orders = await _orderRepository.GetByUserIdAsync(userId);
        var orderDtos = _mapper.Map<IEnumerable<OrderDto>>(orders);
        
        // Устанавливаем поле Date для каждого заказа
        foreach (var orderDto in orderDtos)
        {
            var order = orders.FirstOrDefault(o => o.Id == orderDto.Id);
            if (order != null)
            {
                orderDto.Date = order.CreatedAt;
            }
        }
        
        return orderDtos;
    }

    public async Task<OrderDto> UpdateOrderStatusAsync(int orderId, string status)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
        {
            throw new ArgumentException("Заказ не найден");
        }

        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;

        var updatedOrder = await _orderRepository.UpdateAsync(order);
        
        var orderDto = _mapper.Map<OrderDto>(updatedOrder);
        orderDto.Date = updatedOrder.CreatedAt;
        
        return orderDto;
    }

    public async Task<bool> CancelOrderAsync(int orderId, int userId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null || order.UserId != userId)
        {
            return false;
        }

        // Можно отменить только заказы в статусе "pending" или "processing"
        if (order.Status != "pending" && order.Status != "processing")
        {
            throw new ArgumentException("Заказ не может быть отменен в текущем статусе");
        }

        order.Status = "cancelled";
        order.UpdatedAt = DateTime.UtcNow;

        await _orderRepository.UpdateAsync(order);
        return true;
    }
} 