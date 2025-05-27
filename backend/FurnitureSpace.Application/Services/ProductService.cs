using AutoMapper;
using FurnitureSpace.Application.DTOs;
using FurnitureSpace.Application.Interfaces;
using FurnitureSpace.Domain.Entities;
using FurnitureSpace.Domain.Interfaces;
using System.Text.Json;

namespace FurnitureSpace.Application.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ProductService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _unitOfWork.Products.GetAllAsync();
        return MapProductsToDto(products);
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        return product == null ? null : MapProductToDto(product);
    }

    public async Task<IEnumerable<ProductDto>> GetProductsByCategoryIdAsync(int categoryId)
    {
        var products = await _unitOfWork.Products.GetByCategoryIdAsync(categoryId);
        return MapProductsToDto(products);
    }

    public async Task<IEnumerable<ProductDto>> GetFeaturedProductsAsync()
    {
        var products = await _unitOfWork.Products.GetFeaturedProductsAsync();
        return MapProductsToDto(products);
    }

    public async Task<IEnumerable<ProductDto>> GetNewProductsAsync()
    {
        var products = await _unitOfWork.Products.GetNewProductsAsync();
        return MapProductsToDto(products);
    }

    public async Task<IEnumerable<ProductDto>> GetProductsInStockAsync()
    {
        var products = await _unitOfWork.Products.GetProductsInStockAsync();
        return MapProductsToDto(products);
    }

    public async Task<IEnumerable<ProductDto>> SearchProductsAsync(string searchTerm)
    {
        var products = await _unitOfWork.Products.SearchProductsAsync(searchTerm);
        return MapProductsToDto(products);
    }

    public async Task<IEnumerable<ProductDto>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice)
    {
        var products = await _unitOfWork.Products.GetProductsByPriceRangeAsync(minPrice, maxPrice);
        return MapProductsToDto(products);
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
    {
        var product = _mapper.Map<Product>(createProductDto);
        
        // Handle colors JSON serialization
        if (createProductDto.Colors != null)
        {
            product.Colors = JsonSerializer.Serialize(createProductDto.Colors);
        }
        
        var createdProduct = await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveChangesAsync();
        return MapProductToDto(createdProduct);
    }

    public async Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
    {
        var existingProduct = await _unitOfWork.Products.GetByIdAsync(id);
        if (existingProduct == null)
            return null;

        _mapper.Map(updateProductDto, existingProduct);
        
        // Handle colors JSON serialization
        if (updateProductDto.Colors != null)
        {
            existingProduct.Colors = JsonSerializer.Serialize(updateProductDto.Colors);
        }
        
        await _unitOfWork.Products.UpdateAsync(existingProduct);
        await _unitOfWork.SaveChangesAsync();
        return MapProductToDto(existingProduct);
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null)
            return false;

        await _unitOfWork.Products.DeleteAsync(product);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    private ProductDto MapProductToDto(Product product)
    {
        var dto = _mapper.Map<ProductDto>(product);
        
        // Handle colors JSON deserialization
        if (!string.IsNullOrEmpty(product.Colors))
        {
            try
            {
                dto.Colors = JsonSerializer.Deserialize<object>(product.Colors);
            }
            catch
            {
                dto.Colors = null;
            }
        }
        
        return dto;
    }

    private IEnumerable<ProductDto> MapProductsToDto(IEnumerable<Product> products)
    {
        return products.Select(MapProductToDto);
    }
} 