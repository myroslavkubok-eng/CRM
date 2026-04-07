import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';
import { AddProductModal, type NewProduct } from './AddProductModal';
import { RestockModal } from './RestockModal';
import { EditProductModal, type EditableProduct } from './EditProductModal';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  stock: number;
  image: string;
  description: string;
}

export interface ProductSaleResult {
  success: boolean;
  message: string;
}

export function ProductsTab() {
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([
    {
      id: '1',
      name: 'Premium Argan Oil',
      category: 'Hair Care',
      price: 45,
      discount: 20,
      stock: 24,
      image: 'https://images.unsplash.com/photo-1760541193202-43ac06d34411?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmdhbiUyMG9pbCUyMG5hdHVyYWx8ZW58MXx8fHwxNzY2MzMyMjMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Pure organic argan oil for hair and skin. Restores shine and softness.'
    },
    {
      id: '2',
      name: 'Luxury Face Cream',
      category: 'Skin Care',
      price: 85,
      discount: 0,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1591375462077-800a22f5fba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNlJTIwY3JlYW0lMjBsdXh1cnl8ZW58MXx8fHwxNzY2MzMyMjMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Anti-aging face cream with hyaluronic acid and vitamin E.'
    },
    {
      id: '3',
      name: 'Professional Shampoo',
      category: 'Hair Care',
      price: 30,
      discount: 0,
      stock: 0,
      image: 'https://images.unsplash.com/photo-1721274503142-63af7aa9c1ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzaGFtcG9vfGVufDF8fHx8MTc2NjMzMjIzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Sulfate-free shampoo for color-treated hair.'
    }
  ]);

  const handleAddProduct = (newProduct: NewProduct) => {
    const productToAdd: Product = {
      id: (productsList.length + 1).toString(),
      name: newProduct.name,
      category: 'General', // Default category
      price: newProduct.price,
      discount: 0,
      stock: newProduct.stock, // Use stock from form
      image: newProduct.image || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400',
      description: newProduct.description
    };
    setProductsList([...productsList, productToAdd]);
  };

  const handleRestock = (productId: string, quantityChange: number) => {
    setProductsList(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, stock: product.stock + quantityChange }
          : product
      )
    );
  };

  // Function to sell product (decrease stock)
  // Usage: Call this function when a product is purchased through checkout
  // Example: const result = sellProduct(productId, quantity);
  // if (!result.success) { toast.error(result.message); return; }
  // This prevents selling products that are out of stock
  const sellProduct = (productId: string, quantity: number): ProductSaleResult => {
    const product = productsList.find(p => p.id === productId);
    
    if (!product) {
      return { success: false, message: 'Product not found' };
    }

    if (product.stock < quantity) {
      return { 
        success: false, 
        message: `Not enough stock! Only ${product.stock} available.` 
      };
    }

    setProductsList(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? { ...p, stock: p.stock - quantity }
          : p
      )
    );

    return { success: true, message: 'Product sold successfully' };
  };

  const handleEditProduct = (editedProduct: EditableProduct) => {
    setProductsList(prevProducts =>
      prevProducts.map(product =>
        product.id === editedProduct.id
          ? { 
              ...product, 
              name: editedProduct.name, 
              category: editedProduct.category,
              price: editedProduct.price, 
              discount: editedProduct.discount, 
              description: editedProduct.description,
              image: editedProduct.image || product.image
            }
          : product
      )
    );
  };

  const filteredProducts = productsList.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">products</h2>
          <p className="text-sm text-gray-500">manage/marketplace</p>
        </div>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white gap-2" onClick={() => setIsAddProductModalOpen(true)}>
          <Plus className="w-4 h-4" />
          add▪︎Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="search▪︎Products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const isLowStock = product.stock < 10;
          const isOutOfStock = product.stock === 0;
          
          return (
          <Card key={product.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${
            isOutOfStock ? 'border-red-300 border-2' : isLowStock ? 'border-orange-300 border-2' : ''
          }`}>
            {/* Product Image */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
              />
              {isOutOfStock ? (
                <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  OUT OF STOCK
                </div>
              ) : isLowStock ? (
                <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {product.stock} LEFT
                </div>
              ) : (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                  {product.stock} in▪︎Stock
                </div>
              )}
            </div>

            {/* Product Info */}
            <CardContent className="p-6">
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>

              <div className="mb-4">
                {product.discount > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                        -{product.discount}%
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(product.price * (1 - product.discount / 100))}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                )}
              </div>

              {/* Low Stock Alert */}
              {isLowStock && !isOutOfStock && (
                <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-orange-700 font-medium">Low stock - restock soon!</span>
                </div>
              )}
              
              {isOutOfStock && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-700 font-medium">Out of stock - restock required!</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => {
                  setSelectedProduct(product);
                  setIsEditProductModalOpen(true);
                }}>
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${
                    isOutOfStock 
                      ? 'text-red-600 hover:bg-red-50 border-red-300' 
                      : isLowStock 
                        ? 'text-orange-600 hover:bg-orange-50 border-orange-300'
                        : 'text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsRestockModalOpen(true);
                  }}
                  title="Manage Stock"
                >
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )})}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSubmit={handleAddProduct}
      />

      {/* Restock Modal */}
      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        product={selectedProduct}
        onRestock={handleRestock}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditProductModalOpen}
        onClose={() => setIsEditProductModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleEditProduct}
      />
    </div>
  );
}