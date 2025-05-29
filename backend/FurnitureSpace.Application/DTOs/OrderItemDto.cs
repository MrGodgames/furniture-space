namespace FurnitureSpace.Application.DTOs
{
    public class OrderItemDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Дополнительная информация о продукте
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
} 