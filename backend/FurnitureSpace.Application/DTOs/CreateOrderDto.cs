using System.ComponentModel.DataAnnotations;

namespace FurnitureSpace.Application.DTOs
{
    public class CreateOrderDto
    {
        [Required(ErrorMessage = "Адрес доставки обязателен")]
        public string ShippingAddress { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Способ оплаты обязателен")]
        public string PaymentMethod { get; set; } = string.Empty;
        
        public string? Notes { get; set; }
        
        [Required(ErrorMessage = "Товары обязательны")]
        [MinLength(1, ErrorMessage = "Заказ должен содержать хотя бы один товар")]
        public List<CreateOrderItemDto> Items { get; set; } = new List<CreateOrderItemDto>();
    }
    
    public class CreateOrderItemDto
    {
        [Required(ErrorMessage = "ID товара обязателен")]
        [Range(1, int.MaxValue, ErrorMessage = "ID товара должен быть больше 0")]
        public int ProductId { get; set; }
        
        [Required(ErrorMessage = "Количество обязательно")]
        [Range(1, int.MaxValue, ErrorMessage = "Количество должно быть больше 0")]
        public int Quantity { get; set; }
    }
} 