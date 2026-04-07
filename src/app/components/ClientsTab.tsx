import { useState } from 'react';
import { Search, Plus, Star, Edit, Trash2, Phone, Mail, ChevronDown, ChevronUp, X, Download, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'blacklisted';
  totalVisits: number;
  lastVisit: string;
  totalSpent: number;
  rating: number;
  notes?: string;
  formula?: string;
}

interface ClientsTabProps {
  userRole?: 'owner' | 'admin' | 'master';
}

export function ClientsTab({ userRole = 'admin' }: ClientsTabProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'blacklisted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [isImporting, setIsImporting] = useState(false);

  const clients: Client[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+971 50 123 4567',
      status: 'active',
      totalVisits: 12,
      lastVisit: '2024-11-10',
      totalSpent: 1240,
      rating: 5,
      notes: 'Prefers Alice as stylist',
      formula: 'Color: 7.1 + 20vol'
    },
    {
      id: '2',
      name: 'Mike Thompson',
      email: 'mike.t@email.com',
      phone: '+971 50 234 5678',
      status: 'active',
      totalVisits: 8,
      lastVisit: '2024-11-12',
      totalSpent: 680,
      rating: 4,
      notes: 'Regular beard trim every 2 weeks'
    },
    {
      id: '3',
      name: 'Jessica Williams',
      email: 'jessica.w@email.com',
      phone: '+971 50 345 6789',
      status: 'active',
      totalVisits: 15,
      lastVisit: '2024-11-14',
      totalSpent: 2100,
      rating: 5,
      notes: 'VIP client, loves nail art',
      formula: 'Gel: Pink #123'
    },
    {
      id: '4',
      name: 'David Brown',
      email: 'david.b@email.com',
      phone: '+971 50 456 7890',
      status: 'blacklisted',
      totalVisits: 2,
      lastVisit: '2024-10-05',
      totalSpent: 80,
      rating: 1,
      notes: 'No-show twice, payment issues'
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesFilter = filter === 'all' || client.status === filter;
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    all: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    blacklisted: clients.filter(c => c.status === 'blacklisted').length
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData(client);
  };

  const handleSave = () => {
    // TODO: Implement save logic (update client in state/database)
    console.log('Saving client:', formData);
    setEditingClient(null);
    setFormData({});
  };

  const handleCancel = () => {
    setEditingClient(null);
    setFormData({});
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Total Visits', 'Last Visit', 'Total Spent', 'Rating', 'Notes', 'Formula'];
    const csvData = clients.map(client => [
      client.name,
      client.email,
      client.phone,
      client.status,
      client.totalVisits,
      client.lastVisit,
      client.totalSpent,
      client.rating,
      client.notes || '',
      client.formula || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    // Create Excel-compatible CSV with UTF-8 BOM
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Total Visits', 'Last Visit', 'Total Spent', 'Rating', 'Notes', 'Formula'];
    const csvData = clients.map(client => [
      client.name,
      client.email,
      client.phone,
      client.status,
      client.totalVisits,
      client.lastVisit,
      client.totalSpent,
      client.rating,
      client.notes || '',
      client.formula || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Add UTF-8 BOM for Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_export_${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const importedClients = lines.slice(1)
        .filter(line => line.trim())
        .map((line, index) => {
          const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || [];
          
          return {
            id: `imported-${Date.now()}-${index}`,
            name: values[0] || '',
            email: values[1] || '',
            phone: values[2] || '',
            status: (values[3] === 'blacklisted' ? 'blacklisted' : 'active') as 'active' | 'blacklisted',
            totalVisits: parseInt(values[4]) || 0,
            lastVisit: values[5] || new Date().toISOString().split('T')[0],
            totalSpent: parseFloat(values[6]) || 0,
            rating: parseInt(values[7]) || 0,
            notes: values[8] || '',
            formula: values[9] || ''
          };
        });

      console.log('Imported clients:', importedClients);
      // TODO: Implement actual import logic (merge with existing clients)
      alert(`Successfully imported ${importedClients.length} clients!`);
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Database</h2>
          <p className="text-sm text-gray-500">History & Favorites</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Import/Export buttons - Only for Owner */}
          {userRole === 'owner' && (
            <>
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleExportCSV}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleExportExcel}
              >
                <Download className="w-4 h-4" />
                Export Excel
              </Button>
              <label htmlFor="import-file" className="relative">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleImportFile}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="import-file"
                />
                <Button
                  variant="outline"
                  className="gap-2 pointer-events-none"
                >
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
              </label>
            </>
          )}
          <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({stats.all})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilter('blacklisted')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              filter === 'blacklisted'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Blacklisted ({stats.blacklisted})
          </button>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Client Cards */}
      <div className="grid gap-4">
        {filteredClients.map(client => (
          <Card key={client.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div 
                className="flex items-start gap-4 flex-1 cursor-pointer"
                onClick={() => setExpandedClientId(expandedClientId === client.id ? null : client.id)}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-xl font-bold text-purple-600">
                  {client.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900">{client.name}</h3>
                    {client.status === 'blacklisted' && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                        Blacklisted
                      </span>
                    )}
                    {expandedClientId === client.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 ml-auto" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                    )}
                  </div>

                  {/* Compact view - always visible */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{client.totalVisits} visits</span>
                    <span>${client.totalSpent} spent</span>
                  </div>

                  {/* Expanded view - shown on click */}
                  {expandedClientId === client.id && (
                    <div className="mt-4 space-y-4">
                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {client.phone}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Total Visits</div>
                          <div className="text-lg font-bold text-gray-900">{client.totalVisits}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Last Visit</div>
                          <div className="text-sm font-medium text-gray-900">{client.lastVisit}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Total Spent</div>
                          <div className="text-lg font-bold text-green-600">${client.totalSpent}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Rating</div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < client.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Notes & Formula */}
                      {(client.notes || client.formula) && (
                        <div className="space-y-2">
                          {client.notes && (
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="text-xs font-medium text-blue-600 mb-1">Notes</div>
                              <div className="text-sm text-gray-700">{client.notes}</div>
                            </div>
                          )}
                          {client.formula && (
                            <div className="bg-purple-50 rounded-lg p-3">
                              <div className="text-xs font-medium text-purple-600 mb-1">Formula</div>
                              <div className="text-sm text-gray-700">{client.formula}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(client);
                  }}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:bg-red-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No clients found</p>
        </div>
      )}

      {/* Edit Client Dialog */}
      <Dialog open={!!editingClient} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client Information</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Client name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'blacklisted' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="active">Active</option>
                    <option value="blacklisted">Blacklisted</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+971 50 123 4567"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add notes about client preferences, allergies, special requests..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Formula */}
            <div className="space-y-2">
              <Label htmlFor="formula">Color Formula / Treatment Details</Label>
              <Textarea
                id="formula"
                value={formData.formula || ''}
                onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                placeholder="E.g., Hair Color: 7.1 + 20vol, Gel Polish: Pink #123..."
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">Add hair color formulas, gel polish codes, or any treatment details</p>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label>Client Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating <= (formData.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}