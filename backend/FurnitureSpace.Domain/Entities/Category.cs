using System.ComponentModel.DataAnnotations;

namespace FurnitureSpace.Domain.Entities;

public class Category
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;
    
    public DateTime? CreatedAt { get; set; }
    
    // Navigation property
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
} 