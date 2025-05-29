using System.ComponentModel.DataAnnotations;

namespace FurnitureSpace.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string? Phone { get; set; }
        
        public string? Address { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string Avatar { get; set; } = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y&s=150";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsActive { get; set; } = true;
        
        // Навигационные свойства
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
} 