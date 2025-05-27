using Microsoft.EntityFrameworkCore;
using FurnitureSpace.Domain.Entities;

namespace FurnitureSpace.Infrastructure.Data;

public class FurnitureDbContext : DbContext
{
    public FurnitureDbContext(DbContextOptions<FurnitureDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Category entity
        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("categories");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Slug).HasColumnName("slug").HasMaxLength(100).IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");

            // Configure relationship
            entity.HasMany(c => c.Products)
                  .WithOne(p => p.CategoryNavigation)
                  .HasForeignKey(p => p.CategoryId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure Product entity
        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
            entity.Property(e => e.Price).HasColumnName("price").HasColumnType("decimal(10,2)").IsRequired();
            entity.Property(e => e.Discount).HasColumnName("discount");
            entity.Property(e => e.Image).HasColumnName("image").HasMaxLength(255);
            entity.Property(e => e.Category).HasColumnName("category").HasMaxLength(100);
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.Rating).HasColumnName("rating").HasColumnType("decimal(3,1)");
            entity.Property(e => e.IsNew).HasColumnName("is_new");
            entity.Property(e => e.InStock).HasColumnName("in_stock");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.IsFeatured).HasColumnName("is_featured");
            entity.Property(e => e.Images).HasColumnName("images");
            entity.Property(e => e.Colors).HasColumnName("colors");
        });
    }
} 