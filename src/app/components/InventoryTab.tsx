import { useState } from 'react';
import { Package, Plus, AlertTriangle, TrendingDown, Search, Edit2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';

interface InventoryItem {
  id: string;
  name: string;
  category: 'Hair Care' | 'Nail Care' | 'Skin Care' | 'Tools' | 'Disposables';
  currentStock: number;
  minStock: number;
  unit: string;
  pricePerUnit: number;
  supplier: string;
  lastRestocked: string;
}

interface InventoryTabProps {
  userRole?: 'owner' | 'admin' | 'master';
}

export function InventoryTab({ userRole = 'owner' }: InventoryTabProps) {
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data
  const [inventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Hair Dye #45 Blonde',
      category: 'Hair Care',
      currentStock: 2,
      minStock: 10,
      unit: 'bottles',
      pricePerUnit: 25,
      supplier: 'Beauty Supply Co.',
      lastRestocked: '2024-12-15'
    },
    {
      id: '2',
      name: 'Professional Shampoo',
      category: 'Hair Care',
      currentStock: 45,
      minStock: 20,
      unit: 'bottles',
      pricePerUnit: 18,
      supplier: 'Hair Masters Inc.',
      lastRestocked: '2024-12-20'
    },
    {
      id: '3',
      name: 'Acrylic Powder - Clear',
      category: 'Nail Care',
      currentStock: 8,
      minStock: 15,
      unit: 'jars',
      pricePerUnit: 32,
      supplier: 'Nail Pro Supply',
      lastRestocked: '2024-12-10'
    },
    {
      id: '4',
      name: 'Disposable Gloves (Box)',
      category: 'Disposables',
      currentStock: 156,
      minStock: 50,
      unit: 'boxes',
      pricePerUnit: 8,
      supplier: 'Medical Supplies Ltd.',
      lastRestocked: '2024-12-22'
    },
    {
      id: '5',
      name: 'Facial Serum - Vitamin C',
      category: 'Skin Care',
      currentStock: 12,
      minStock: 10,
      unit: 'bottles',
      pricePerUnit: 45,
      supplier: 'Skincare Professionals',
      lastRestocked: '2024-12-18'
    },
    {
      id: '6',
      name: 'Aluminum Foil Roll',
      category: 'Hair Care',
      currentStock: 3,
      minStock: 8,
      unit: 'rolls',
      pricePerUnit: 12,
      supplier: 'Beauty Supply Co.',
      lastRestocked: '2024-12-12'
    }
  ]);

  const categories = ['all', 'Hair Care', 'Nail Care', 'Skin Care', 'Tools', 'Disposables'];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => item.currentStock < item.minStock);
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.pricePerUnit), 0);

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.minStock) * 100;
    if (percentage < 50) return { color: 'text-red-600', bg: 'bg-red-50', label: 'Critical' };
    if (percentage < 100) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Low' };
    return { color: 'text-green-600', bg: 'bg-green-50', label: 'Good' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-8 h-8 text-purple-600" />
            Inventory Management
          </h1>
          <p className="text-gray-500 mt-1">Track supplies, stock levels, and reorder alerts</p>
        </div>
        {userRole !== 'master' && (
          <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalValue)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(inventory.map(i => i.supplier)).size}</p>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-1">Low Stock Alert</h3>
                <p className="text-sm text-red-700 mb-2">
                  {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} below minimum stock level
                </p>
                <div className="flex flex-wrap gap-2">
                  {lowStockItems.map(item => (
                    <span key={item.id} className="text-xs bg-white px-2 py-1 rounded text-red-700">
                      {item.name} ({item.currentStock}/{item.minStock})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items or suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Item</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Stock</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Price/Unit</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Supplier</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Last Restocked</th>
                  {userRole !== 'master' && (
                    <th className="text-right p-4 text-sm font-medium text-gray-600">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map(item => {
                  const status = getStockStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.unit}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{item.category}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <span className="font-bold text-gray-900">{item.currentStock}</span>
                          <span className="text-gray-500"> / {item.minStock} min</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-900">{formatPrice(item.pricePerUnit)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{item.supplier}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{item.lastRestocked}</span>
                      </td>
                      {userRole !== 'master' && (
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit2 className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No items found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
