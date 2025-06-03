using Microsoft.EntityFrameworkCore;
using FurnitureSpace.Domain.Entities;
using FurnitureSpace.Domain.Interfaces;
using FurnitureSpace.Infrastructure.Data;

namespace FurnitureSpace.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly FurnitureDbContext _context;

    public UserRepository(FurnitureDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .Include(u => u.Orders)
            .FirstOrDefaultAsync(u => u.Id == id && u.IsActive == true);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.Orders)
            .FirstOrDefaultAsync(u => u.Email == email && u.IsActive == true);
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users
            .Include(u => u.Orders)
            .Where(u => u.IsActive == true)
            .ToListAsync();
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(User user)
    {
        user.UpdatedAt = DateTime.UtcNow;
        
        if (user.CreatedAt.HasValue && user.CreatedAt.Value.Kind == DateTimeKind.Unspecified)
        {
            user.CreatedAt = DateTime.SpecifyKind(user.CreatedAt.Value, DateTimeKind.Utc);
        }
        
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<bool> DeactivateUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;
        
        if (user.CreatedAt.HasValue && user.CreatedAt.Value.Kind == DateTimeKind.Unspecified)
        {
            user.CreatedAt = DateTime.SpecifyKind(user.CreatedAt.Value, DateTimeKind.Utc);
        }
        
        await _context.SaveChangesAsync();
        return true;
    }
} 