using FurnitureSpace.Application.DTOs;

namespace FurnitureSpace.Application.Interfaces;

public interface IAdminService
{
    Task<AdminDashboardDto> GetDashboardDataAsync();
    Task<IEnumerable<ProductSalesDto>> GetProductSalesStatsAsync();
    Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
    Task<OrderDto?> UpdateOrderStatusAsync(int orderId, string status);
} 