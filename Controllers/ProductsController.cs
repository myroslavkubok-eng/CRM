using CRMKatia.Domain.Entities;
using CRMKatia.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMKatia.Controllers;

[ApiController]
[Route("products")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IRepository<Product> _productRepository;
    private readonly ISalonRepository _salonRepository;

    public ProductsController(IRepository<Product> productRepository, ISalonRepository salonRepository)
    {
        _productRepository = productRepository;
        _salonRepository = salonRepository;
    }

    [HttpGet("salon/{salonId:guid}")]
    public async Task<ActionResult> GetBySalon(Guid salonId)
    {
        var allProducts = await _productRepository.GetAllAsync();
        var products = allProducts.Where(p => p.SalonId == salonId).ToList();
        return Ok(new { products = products.Select(MapToDto), totalCount = products.Count });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
            return NotFound(new { message = "Product not found" });

        return Ok(MapToDto(product));
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateProductRequest request)
    {
        var salon = await _salonRepository.GetByIdAsync(request.SalonId);
        if (salon == null)
            return BadRequest(new { message = "Salon not found" });

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            Brand = request.Brand,
            Price = request.Price,
            Cost = request.Cost,
            Stock = request.Stock,
            Sku = request.Sku,
            Image = request.Image,
            SalonId = request.SalonId,
            CreatedAt = DateTime.UtcNow
        };

        await _productRepository.AddAsync(product);
        await _productRepository.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, MapToDto(product));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateProductRequest request)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
            return NotFound(new { message = "Product not found" });

        if (request.Name != null) product.Name = request.Name;
        if (request.Description != null) product.Description = request.Description;
        if (request.Category != null) product.Category = request.Category;
        if (request.Brand != null) product.Brand = request.Brand;
        if (request.Price.HasValue) product.Price = request.Price.Value;
        if (request.Cost.HasValue) product.Cost = request.Cost.Value;
        if (request.Stock.HasValue) product.Stock = request.Stock.Value;
        if (request.Sku != null) product.Sku = request.Sku;
        if (request.Image != null) product.Image = request.Image;
        product.UpdatedAt = DateTime.UtcNow;

        _productRepository.Update(product);
        await _productRepository.SaveChangesAsync();

        return Ok(MapToDto(product));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
            return NotFound(new { message = "Product not found" });

        _productRepository.Remove(product);
        await _productRepository.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id:guid}/stock")]
    public async Task<ActionResult> UpdateStock(Guid id, [FromBody] UpdateStockRequest request)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
            return NotFound(new { message = "Product not found" });

        product.Stock = request.Stock;
        product.UpdatedAt = DateTime.UtcNow;

        _productRepository.Update(product);
        await _productRepository.SaveChangesAsync();

        return Ok(new { message = "Stock updated successfully", stock = product.Stock });
    }

private static object MapToDto(Product p) => new
    {
        p.Id,
        p.Name,
        p.Description,
        p.Category,
        p.Brand,
        p.Price,
        p.Cost,
        p.Stock,
        p.Sku,
        p.Image,
        p.SalonId,
        p.CreatedAt,
        p.UpdatedAt
    };
}