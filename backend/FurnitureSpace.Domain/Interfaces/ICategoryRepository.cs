using FurnitureSpace.Domain.Entities;

namespace FurnitureSpace.Domain.Interfaces;

public interface ICategoryRepository : IRepository<Category>
{
    Task<Category?> GetBySlugAsync(string slug);
    Task<IEnumerable<Category>> GetCategoriesWithProductsAsync();
} 