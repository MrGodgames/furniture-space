using System.ComponentModel.DataAnnotations;

namespace FurnitureSpace.Application.DTOs
{
    public class UpdateOrderStatusDto
    {
        [Required(ErrorMessage = "Статус обязателен")]
        public string Status { get; set; } = string.Empty;
    }
} 