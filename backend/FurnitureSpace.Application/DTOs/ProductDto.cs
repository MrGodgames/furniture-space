namespace FurnitureSpace.Application.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int? Discount { get; set; }
    public string? Image { get; set; }
    public string? Category { get; set; }
    public int? CategoryId { get; set; }
    public decimal? Rating { get; set; }
    public bool? IsNew { get; set; }
    public bool? InStock { get; set; }
    public string? Description { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool? IsFeatured { get; set; }
    public string[]? Images { get; set; }
    public object? Colors { get; set; }
    public CategoryDto? CategoryNavigation { get; set; }
}

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int? Discount { get; set; } = 0;
    public string? Image { get; set; }
    public string? Category { get; set; }
    public int? CategoryId { get; set; }
    public decimal? Rating { get; set; } = 0;
    public bool? IsNew { get; set; } = false;
    public bool? InStock { get; set; } = true;
    public string? Description { get; set; }
    public bool? IsFeatured { get; set; } = false;
    public string[]? Images { get; set; }
    public object? Colors { get; set; }
}

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int? Discount { get; set; }
    public string? Image { get; set; }
    public string? Category { get; set; }
    public int? CategoryId { get; set; }
    public decimal? Rating { get; set; }
    public bool? IsNew { get; set; }
    public bool? InStock { get; set; }
    public string? Description { get; set; }
    public bool? IsFeatured { get; set; }
    public string[]? Images { get; set; }
    public object? Colors { get; set; }
} 