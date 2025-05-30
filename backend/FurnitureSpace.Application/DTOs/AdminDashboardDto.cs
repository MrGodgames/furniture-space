namespace FurnitureSpace.Application.DTOs;

public class AdminDashboardDto
{
    public int TotalProducts { get; set; }
    public int TotalOrders { get; set; }
    public int TotalUsers { get; set; }
    public decimal TotalRevenue { get; set; }
    public int OrdersToday { get; set; }
    public decimal RevenueToday { get; set; }
    public List<ProductSalesDto> TopSellingProducts { get; set; } = new();
    public List<OrderDto> RecentOrders { get; set; } = new();
}

public class ProductSalesDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductImage { get; set; } = string.Empty;
    public int TotalSold { get; set; }
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
} 