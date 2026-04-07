import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, AlertCircle, Wrench, Users, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';

export interface Resource {
  id: string;
  name: string;
  category: string;
  quantity: number;
  assignedServices: string[];
  status: 'active' | 'maintenance' | 'inactive';
  notes?: string;
}

interface ResourceManagementTabProps {
  userRole?: 'owner' | 'admin' | 'master';
}

export function ResourceManagementTab({ userRole = 'owner' }: ResourceManagementTabProps) {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      name: 'Manicure Tables',
      category: 'Nails',
      quantity: 3,
      assignedServices: ['Manicure', 'Nail Extensions', 'Nail Art'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Pedicure Chairs',
      category: 'Nails',
      quantity: 2,
      assignedServices: ['Pedicure', 'Spa Pedicure'],
      status: 'active'
    },
    {
      id: '3',
      name: 'Massage Tables',
      category: 'Massage',
      quantity: 1,
      assignedServices: ['Full Body Massage', 'Back Massage', 'Relaxation Massage'],
      status: 'active'
    },
    {
      id: '4',
      name: 'Eyelash Extension Beds',
      category: 'Eyelashes',
      quantity: 1,
      assignedServices: ['Classic Lashes', 'Volume Lashes', 'Lash Lift'],
      status: 'active'
    },
    {
      id: '5',
      name: 'Hair Styling Stations',
      category: 'Hair',
      quantity: 4,
      assignedServices: ['Haircut', 'Hair Coloring', 'Highlights', 'Blowdry'],
      status: 'active'
    },
    {
      id: '6',
      name: 'Facial Treatment Rooms',
      category: 'Facial',
      quantity: 2,
      assignedServices: ['Classic Facial', 'Deep Cleansing', 'Anti-aging Treatment'],
      status: 'active'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 1,
    assignedServices: [] as string[],
    status: 'active' as 'active' | 'maintenance' | 'inactive',
    notes: ''
  });

  const categories = [
    'Nails',
    'Hair',
    'Eyelashes',
    'Brow',
    'Facial',
    'Massage',
    'Spa',
    'Makeup',
    'Waxing',
    'Laser',
    'Tattoo',
    'Piercing',
    'Other'
  ];

  const allServices = [
    'Manicure',
    'Pedicure',
    'Nail Extensions',
    'Nail Art',
    'Spa Pedicure',
    'Haircut',
    'Hair Coloring',
    'Highlights',
    'Balayage',
    'Blowdry',
    'Classic Lashes',
    'Volume Lashes',
    'Lash Lift',
    'Eyebrow Tinting',
    'Eyebrow Shaping',
    'Classic Facial',
    'Deep Cleansing',
    'Anti-aging Treatment',
    'Full Body Massage',
    'Back Massage',
    'Relaxation Massage',
    'Makeup Application',
    'Bridal Makeup',
    'Waxing',
    'Laser Hair Removal'
  ];

  const handleAddResource = () => {
    if (!formData.name || !formData.category || formData.quantity < 1) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newResource: Resource = {
      id: (resources.length + 1).toString(),
      name: formData.name,
      category: formData.category,
      quantity: formData.quantity,
      assignedServices: formData.assignedServices,
      status: formData.status,
      notes: formData.notes
    };

    setResources([...resources, newResource]);
    setShowAddModal(false);
    resetForm();
    toast.success(`Resource "${formData.name}" added successfully`);
  };

  const handleUpdateResource = () => {
    if (!editingResource || !formData.name || !formData.category || formData.quantity < 1) {
      toast.error('Please fill in all required fields');
      return;
    }

    setResources(resources.map(r => 
      r.id === editingResource.id 
        ? {
            ...r,
            name: formData.name,
            category: formData.category,
            quantity: formData.quantity,
            assignedServices: formData.assignedServices,
            status: formData.status,
            notes: formData.notes
          }
        : r
    ));

    setEditingResource(null);
    resetForm();
    toast.success('Resource updated successfully');
  };

  const handleDeleteResource = (id: string) => {
    const resource = resources.find(r => r.id === id);
    if (resource) {
      setResources(resources.filter(r => r.id !== id));
      toast.success(`Resource "${resource.name}" deleted`);
    }
  };

  const handleEditClick = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      category: resource.category,
      quantity: resource.quantity,
      assignedServices: resource.assignedServices,
      status: resource.status,
      notes: resource.notes || ''
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      quantity: 1,
      assignedServices: [],
      status: 'active',
      notes: ''
    });
  };

  const toggleServiceAssignment = (service: string) => {
    setFormData({
      ...formData,
      assignedServices: formData.assignedServices.includes(service)
        ? formData.assignedServices.filter(s => s !== service)
        : [...formData.assignedServices, service]
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Active</span>;
      case 'maintenance':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1"><Wrench className="w-3 h-3" />Maintenance</span>;
      case 'inactive':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Inactive</span>;
      default:
        return null;
    }
  };

  const totalResources = resources.reduce((sum, r) => sum + r.quantity, 0);
  const activeResources = resources.filter(r => r.status === 'active').reduce((sum, r) => sum + r.quantity, 0);

  // Only Owner can manage resources
  if (userRole !== 'owner') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Only salon owners can manage resource settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Wrench className="w-8 h-8 text-purple-600" />
            Resource Management
          </h1>
          <p className="text-gray-500 mt-1">Manage workstations, chairs, and equipment to prevent double booking</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Resources</p>
                <p className="text-2xl font-bold text-purple-600">{totalResources}</p>
              </div>
              <Wrench className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Resources</p>
                <p className="text-2xl font-bold text-green-600">{activeResources}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resource Types</p>
                <p className="text-2xl font-bold text-blue-600">{resources.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Resource Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Quantity</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Assigned Services</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resources.map(resource => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <span className="font-medium text-gray-900">{resource.name}</span>
                      {resource.notes && (
                        <p className="text-xs text-gray-500 mt-1">{resource.notes}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700">
                        {resource.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-lg font-bold text-gray-900">{resource.quantity}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {resource.assignedServices.slice(0, 3).map(service => (
                          <span 
                            key={service}
                            className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700"
                          >
                            {service}
                          </span>
                        ))}
                        {resource.assignedServices.length > 3 && (
                          <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                            +{resource.assignedServices.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(resource.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(resource)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteResource(resource.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Resource Modal */}
      {(showAddModal || editingResource) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingResource(null);
                  resetForm();
                }}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Resource Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Manicure Tables, Pedicure Chairs"
                  required
                />
              </div>

              {/* Category and Quantity */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex gap-3">
                  {(['active', 'maintenance', 'inactive'] as const).map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, status })}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                        formData.status === status
                          ? status === 'active'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : status === 'maintenance'
                            ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                            : 'border-gray-500 bg-gray-50 text-gray-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assigned Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Services
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Select which services require this resource
                </p>
                <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="grid md:grid-cols-2 gap-2">
                    {allServices.map(service => (
                      <label 
                        key={service}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.assignedServices.includes(service)}
                          onChange={() => toggleServiceAssignment(service)}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Additional notes about this resource..."
                  rows={3}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingResource(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingResource ? handleUpdateResource : handleAddResource}
                disabled={!formData.name || !formData.category || formData.quantity < 1}
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingResource ? 'Update Resource' : 'Add Resource'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            How Resource Management Works
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• <strong>Prevents Double Booking:</strong> System checks resource availability before accepting bookings</p>
            <p>• <strong>Service Assignment:</strong> Each resource can be assigned to specific services</p>
            <p>• <strong>Real-time Availability:</strong> Calendar shows only available slots based on resource capacity</p>
            <p>• <strong>Maintenance Mode:</strong> Mark resources as unavailable temporarily for repairs</p>
            <p>• <strong>Multi-salon Support:</strong> Each salon can have its own resource configuration</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
