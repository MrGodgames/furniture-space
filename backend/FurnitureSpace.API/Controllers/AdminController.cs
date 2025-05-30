using Microsoft.AspNetCore.Mvc;
using FurnitureSpace.Application.Interfaces;

namespace FurnitureSpace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardData()
    {
        try
        {
            var dashboardData = await _adminService.GetDashboardDataAsync();
            return Ok(dashboardData);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ошибка получения данных панели", error = ex.Message });
        }
    }

    [HttpGet("products/sales")]
    public async Task<IActionResult> GetProductSalesStats()
    {
        try
        {
            var salesStats = await _adminService.GetProductSalesStatsAsync();
            return Ok(salesStats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ошибка получения статистики продаж", error = ex.Message });
        }
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        try
        {
            var orders = await _adminService.GetAllOrdersAsync();
            return Ok(orders);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ошибка получения заказов", error = ex.Message });
        }
    }

    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        try
        {
            var updatedOrder = await _adminService.UpdateOrderStatusAsync(id, request.Status);
            if (updatedOrder == null)
            {
                return NotFound(new { message = "Заказ не найден" });
            }
            return Ok(updatedOrder);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ошибка обновления статуса заказа", error = ex.Message });
        }
    }
}

public class UpdateOrderStatusRequest
{
    public string Status { get; set; } = string.Empty;
} 