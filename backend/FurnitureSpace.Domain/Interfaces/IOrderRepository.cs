using FurnitureSpace.Domain.Entities;

namespace FurnitureSpace.Domain.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order?> GetByIdAsync(int id);
        Task<IEnumerable<Order>> GetAllAsync();
        Task<IEnumerable<Order>> GetAllWithItemsAsync();
        Task<IEnumerable<Order>> GetByUserIdAsync(int userId);
        Task<Order> CreateAsync(Order order);
        Task<Order> UpdateAsync(Order order);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Order>> GetByStatusAsync(string status);
        Task<Order?> GetWithItemsAsync(int id);
        Task<IEnumerable<Order>> GetUserOrdersWithItemsAsync(int userId);
    }
} 