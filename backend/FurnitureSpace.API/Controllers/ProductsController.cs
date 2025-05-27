using Microsoft.AspNetCore.Mvc;
using FurnitureSpace.Application.DTOs;
using FurnitureSpace.Application.Interfaces;

namespace FurnitureSpace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        var products = await _productService.GetAllProductsAsync();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(product);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByCategory(int categoryId)
    {
        var products = await _productService.GetProductsByCategoryIdAsync(categoryId);
        return Ok(products);
    }

    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetFeaturedProducts()
    {
        var products = await _productService.GetFeaturedProductsAsync();
        return Ok(products);
    }

    [HttpGet("new")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetNewProducts()
    {
        var products = await _productService.GetNewProductsAsync();
        return Ok(products);
    }

    [HttpGet("in-stock")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsInStock()
    {
        var products = await _productService.GetProductsInStockAsync();
        return Ok(products);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> SearchProducts([FromQuery] string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            return BadRequest("Search term is required");
        }
        
        var products = await _productService.SearchProductsAsync(searchTerm);
        return Ok(products);
    }

    [HttpGet("price-range")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByPriceRange(
        [FromQuery] decimal minPrice, 
        [FromQuery] decimal maxPrice)
    {
        if (minPrice < 0 || maxPrice < 0 || minPrice > maxPrice)
        {
            return BadRequest("Invalid price range");
        }
        
        var products = await _productService.GetProductsByPriceRangeAsync(minPrice, maxPrice);
        return Ok(products);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto createProductDto)
    {
        var product = await _productService.CreateProductAsync(createProductDto);
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, UpdateProductDto updateProductDto)
    {
        var product = await _productService.UpdateProductAsync(id, updateProductDto);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var result = await _productService.DeleteProductAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
} 