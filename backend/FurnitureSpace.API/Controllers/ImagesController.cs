using Microsoft.AspNetCore.Mvc;

namespace FurnitureSpace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImagesController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly string _imageServerUrl;

    public ImagesController(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        // Замените на URL вашего сервера с изображениями
        _imageServerUrl = configuration["ImageServer:BaseUrl"] ?? "https://your-server.com";
    }

    [HttpGet("uploads/{*fileName}")]
    public async Task<IActionResult> GetImage(string fileName)
    {
        try
        {
            var imageUrl = $"{_imageServerUrl}/uploads/{fileName}";
            var response = await _httpClient.GetAsync(imageUrl);

            if (!response.IsSuccessStatusCode)
            {
                return NotFound("Изображение не найдено");
            }

            var contentType = response.Content.Headers.ContentType?.ToString() ?? "image/jpeg";
            var imageBytes = await response.Content.ReadAsByteArrayAsync();

            return File(imageBytes, contentType);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Ошибка при загрузке изображения");
        }
    }
} 