using Microsoft.EntityFrameworkCore;
using FurnitureSpace.Domain.Entities;
using FurnitureSpace.Domain.Interfaces;
using FurnitureSpace.Infrastructure.Data;

namespace FurnitureSpace.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly FurnitureDbContext _context;

    public OrderRepository(FurnitureDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<IEnumerable<Order>> GetAllAsync()
    {
        return await _context.Orders
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetAllWithItemsAsync()
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByUserIdAsync(int userId)
    {
        return await _context.Orders
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order> CreateAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task<Order> UpdateAsync(Order order)
    {
        // Получаем существующую запись из контекста
        var existingOrder = await _context.Orders.FindAsync(order.Id);
        if (existingOrder == null)
        {
            throw new ArgumentException("Заказ не найден");
        }

        // Обновляем только нужные поля, НЕ ТРОГАЯ CreatedAt
        existingOrder.Status = order.Status;
        existingOrder.ShippingAddress = order.ShippingAddress;
        existingOrder.PaymentMethod = order.PaymentMethod;
        existingOrder.PaymentStatus = order.PaymentStatus;
        existingOrder.Notes = order.Notes;
        existingOrder.TotalAmount = order.TotalAmount;
        existingOrder.UpdatedAt = DateTime.UtcNow;
        
        // CreatedAt остается неизменным!
        
        await _context.SaveChangesAsync();
        return existingOrder;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return false;

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Order>> GetByStatusAsync(string status)
    {
        return await _context.Orders
            .Include(o => o.User)
            .Where(o => o.Status == status)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetWithItemsAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<IEnumerable<Order>> GetUserOrdersWithItemsAsync(int userId)
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }
} 