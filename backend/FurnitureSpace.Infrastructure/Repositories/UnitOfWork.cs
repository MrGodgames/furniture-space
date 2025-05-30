using Microsoft.EntityFrameworkCore.Storage;
using FurnitureSpace.Domain.Interfaces;
using FurnitureSpace.Infrastructure.Data;

namespace FurnitureSpace.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly FurnitureDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(FurnitureDbContext context)
    {
        _context = context;
        Categories = new CategoryRepository(_context);
        Products = new ProductRepository(_context);
        Users = new UserRepository(_context);
        Orders = new OrderRepository(_context);
    }

    public ICategoryRepository Categories { get; }
    public IProductRepository Products { get; }
    public IUserRepository Users { get; }
    public IOrderRepository Orders { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
} 