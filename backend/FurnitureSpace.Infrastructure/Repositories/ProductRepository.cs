using Microsoft.EntityFrameworkCore;
using FurnitureSpace.Domain.Entities;
using FurnitureSpace.Domain.Interfaces;
using FurnitureSpace.Infrastructure.Data;

namespace FurnitureSpace.Infrastructure.Repositories;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(FurnitureDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Product>> GetByCategoryIdAsync(int categoryId)
    {
        return await _dbSet
            .Include(p => p.CategoryNavigation)
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetFeaturedProductsAsync()
    {
        return await _dbSet
            .Include(p => p.CategoryNavigation)
            .Where(p => p.IsFeatured == true)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetNewProductsAsync()
    {
        return await _dbSet
            .Include(p => p.CategoryNavigation)
            .Where(p => p.IsNew == true)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetProductsInStockAsync()
    {
        return await _dbSet
            .Include(p => p.CategoryNavigation)
            .Where(p => p.InStock == true)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm)
    {
        return await _dbSet
            .Include(p => p.CategoryNavigation)
            .Where(p => p.Name.ToLower().Contains(searchTerm.ToLower()) ||
                       (p.Description != null && p.Description.ToLower().Contains(searchTerm.ToLower())) ||
                       (p.Category != null && p.Category.ToLower().Contains(searchTerm.ToLower())))
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice)
    {
        return await _dbSet
            .Include(p => p.CategoryNavigation)
            .Where(p => p.Price >= minPrice && p.Price <= maxPrice)
            .ToListAsync();
    }

    public override async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _dbSet
            .Include(p => p.CategoryNavigation)
            .ToListAsync();
    }

    public override async Task<Product?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(p => p.CategoryNavigation)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
} 