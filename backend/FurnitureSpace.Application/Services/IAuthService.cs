using FurnitureSpace.Application.DTOs.Auth;

namespace FurnitureSpace.Application.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
        Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
        Task<bool> ValidateTokenAsync(string token);
        string GenerateJwtToken(int userId, string email);
        string HashPassword(string password);
        bool VerifyPassword(string password, string hash);
    }
} 