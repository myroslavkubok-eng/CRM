namespace CRMKatia.Domain.Entities;

public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? Brand { get; set; }
    public decimal Price { get; set; }
    public decimal? Cost { get; set; }
    public int Stock { get; set; }
    public string? Sku { get; set; }
    public string? Image { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid SalonId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    public Salon Salon { get; set; } = null!;
}

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? Brand { get; set; }
    public decimal Price { get; set; }
    public decimal? Cost { get; set; }
    public int Stock { get; set; } = 0;
    public string? Sku { get; set; }
    public string? Image { get; set; }
    public Guid SalonId { get; set; }
}

public class UpdateProductRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? Brand { get; set; }
    public decimal? Price { get; set; }
    public decimal? Cost { get; set; }
    public int? Stock { get; set; }
    public string? Sku { get; set; }
    public string? Image { get; set; }
}

public class UpdateStockRequest
{
    public int Stock { get; set; }
}