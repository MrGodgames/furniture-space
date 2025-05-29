using System.ComponentModel.DataAnnotations;

namespace FurnitureSpace.Application.DTOs.Auth
{
    public class RegisterRequestDto
    {
        [Required(ErrorMessage = "Имя обязательно")]
        [MaxLength(255, ErrorMessage = "Имя не должно превышать 255 символов")]
        public string Name { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Email обязателен")]
        [EmailAddress(ErrorMessage = "Некорректный формат email")]
        [MaxLength(255, ErrorMessage = "Email не должен превышать 255 символов")]
        public string Email { get; set; } = string.Empty;
        
        [MaxLength(20, ErrorMessage = "Номер телефона не должен превышать 20 символов")]
        public string? Phone { get; set; }
        
        public string? Address { get; set; }
        
        [Required(ErrorMessage = "Пароль обязателен")]
        [MinLength(6, ErrorMessage = "Пароль должен содержать минимум 6 символов")]
        public string Password { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Подтверждение пароля обязательно")]
        [Compare("Password", ErrorMessage = "Пароли не совпадают")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
} 