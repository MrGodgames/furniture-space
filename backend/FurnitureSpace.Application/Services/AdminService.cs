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
        var orders = await _unitOfWork.Orders.GetAllAsync();
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
        var orders = await _unitOfWork.Orders.GetAllAsync();
        var products = await _unitOfWork.Products.GetAllAsync();

        // Считаем статистику продаж только по доставленным заказам
        var deliveredOrders = orders.Where(o => o.Status == "delivered");

        var salesStats = deliveredOrders
            .SelectMany(o => o.OrderItems)
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

        return salesStats;
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _unitOfWork.Orders.GetAllAsync();
        return _mapper.Map<IEnumerable<OrderDto>>(orders.OrderByDescending(o => o.CreatedAt));
    }

    public async Task<OrderDto?> UpdateOrderStatusAsync(int orderId, string status)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
        if (order == null)
            return null;

        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Orders.UpdateAsync(order);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<OrderDto>(order);
    }
} 