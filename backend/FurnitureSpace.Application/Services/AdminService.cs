using AutoMapper;
using FurnitureSpace.Application.DTOs;
using FurnitureSpace.Application.Interfaces;
using FurnitureSpace.Domain.Interfaces;

namespace FurnitureSpace.Application.Services;

public class AdminService : IAdminService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AdminService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<AdminDashboardDto> GetDashboardDataAsync()
    {
        var products = await _unitOfWork.Products.GetAllAsync();
        var orders = await _unitOfWork.Orders.GetAllWithItemsAsync();
        var users = await _unitOfWork.Users.GetAllAsync();

        var today = DateTime.UtcNow.Date;
        var ordersToday = orders.Where(o => o.CreatedAt.Date == today);
        
        // Считаем доход только с доставленных заказов
        var deliveredOrders = orders.Where(o => o.Status == "delivered");
        var deliveredOrdersToday = ordersToday.Where(o => o.Status == "delivered");

        var topProducts = await GetProductSalesStatsAsync();
        var recentOrders = orders
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .ToList();

        return new AdminDashboardDto
        {
            TotalProducts = products.Count(),
            TotalOrders = orders.Count(),
            TotalUsers = users.Count(),
            TotalRevenue = deliveredOrders.Sum(o => o.TotalAmount),
            OrdersToday = ordersToday.Count(),
            RevenueToday = deliveredOrdersToday.Sum(o => o.TotalAmount),
            TopSellingProducts = topProducts.Take(5).ToList(),
            RecentOrders = _mapper.Map<List<OrderDto>>(recentOrders)
        };
    }

    public async Task<IEnumerable<ProductSalesDto>> GetProductSalesStatsAsync()
    {
        // Используем новый метод для загрузки заказов с OrderItems
        var orders = await _unitOfWork.Orders.GetAllWithItemsAsync();
        var products = await _unitOfWork.Products.GetAllAsync();

        Console.WriteLine($"[AdminService] Total orders loaded: {orders.Count()}");
        Console.WriteLine($"[AdminService] Orders with OrderItems: {orders.Count(o => o.OrderItems.Any())}");

        // Считаем статистику продаж только по доставленным заказам
        var deliveredOrders = orders.Where(o => o.Status == "delivered");
        Console.WriteLine($"[AdminService] Delivered orders: {deliveredOrders.Count()}");

        var orderItems = deliveredOrders.SelectMany(o => o.OrderItems).ToList();
        Console.WriteLine($"[AdminService] Total order items in delivered orders: {orderItems.Count}");

        var salesStats = orderItems
            .GroupBy(oi => oi.ProductId)
            .Select(g => new ProductSalesDto
            {
                ProductId = g.Key,
                ProductName = products.FirstOrDefault(p => p.Id == g.Key)?.Name ?? "Unknown",
                ProductImage = products.FirstOrDefault(p => p.Id == g.Key)?.Image ?? "",
                TotalSold = g.Sum(oi => oi.Quantity),
                TotalRevenue = g.Sum(oi => oi.TotalPrice),
                TotalOrders = g.Select(oi => oi.OrderId).Distinct().Count()
            })
            .OrderByDescending(p => p.TotalSold)
            .ToList();

        Console.WriteLine($"[AdminService] Sales stats generated: {salesStats.Count} products");
        foreach (var stat in salesStats.Take(3))
        {
            Console.WriteLine($"[AdminService] Product: {stat.ProductName}, Sold: {stat.TotalSold}, Revenue: {stat.TotalRevenue}");
        }

        return salesStats;
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
    {
        // Используем метод с включением OrderItems и пользователей
        var orders = await _unitOfWork.Orders.GetAllWithItemsAsync();
        var orderDtos = _mapper.Map<IEnumerable<OrderDto>>(orders.OrderByDescending(o => o.CreatedAt));
        
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

    public async Task<OrderDto?> UpdateOrderStatusAsync(int orderId, string status)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
        if (order == null)
            return null;

        // Логируем исходные даты
        Console.WriteLine($"[AdminService] Before update - OrderId: {orderId}, CreatedAt: {order.CreatedAt:yyyy-MM-dd HH:mm:ss}, UpdatedAt: {order.UpdatedAt:yyyy-MM-dd HH:mm:ss}");

        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;

        var updatedOrder = await _unitOfWork.Orders.UpdateAsync(order);
        await _unitOfWork.SaveChangesAsync();

        // Логируем итоговые даты
        Console.WriteLine($"[AdminService] After update - OrderId: {orderId}, CreatedAt: {updatedOrder.CreatedAt:yyyy-MM-dd HH:mm:ss}, UpdatedAt: {updatedOrder.UpdatedAt:yyyy-MM-dd HH:mm:ss}");

        var orderDto = _mapper.Map<OrderDto>(updatedOrder);
        orderDto.Date = updatedOrder.CreatedAt;
        
        return orderDto;
    }
} 