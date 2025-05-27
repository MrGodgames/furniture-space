using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FurnitureSpace.Domain.Entities;

public class Product
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }
    
    public int? Discount { get; set; } = 0;
    
    [MaxLength(255)]
    public string? Image { get; set; }
    
    [MaxLength(100)]
    public string? Category { get; set; }
    
    public int? CategoryId { get; set; }
    
    [Column(TypeName = "decimal(3,1)")]
    public decimal? Rating { get; set; } = 0;
    
    public bool? IsNew { get; set; } = false;
    
    public bool? InStock { get; set; } = true;
    
    public string? Description { get; set; }
    
    public DateTime? CreatedAt { get; set; }
    
    public DateTime? UpdatedAt { get; set; }
    
    public bool? IsFeatured { get; set; } = false;
    
    public string[]? Images { get; set; }
    
    public string? Colors { get; set; } // JSON string for colors
    
    // Navigation property
    public virtual Category? CategoryNavigation { get; set; }
} 