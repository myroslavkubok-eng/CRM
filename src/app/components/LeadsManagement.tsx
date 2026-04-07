import { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Trash2,
  AlertTriangle,
  Copy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface Lead {
  id: string;
  fullName: string;
  businessName: string;
  phoneNumber: string;
  email: string;
  city: string;
  businessType: string;
  status: 'new' | 'contacted' | 'demo-scheduled' | 'converted' | 'rejected';
  source: string;
  createdAt: string;
  lastContactedAt?: string;
  notes?: string;
}

export function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/leads`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setLeads(result.leads || []);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: Lead['status']) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/leads/${leadId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        toast.success('Lead status updated');
        loadLeads();
      } else {
        toast.error('Failed to update lead status');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead status');
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/leads/${leadId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Lead deleted');
        loadLeads();
      } else {
        toast.error('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  // NEW: Find duplicates by email or phone
  const findDuplicates = () => {
    const emailMap = new Map<string, Lead[]>();
    const phoneMap = new Map<string, Lead[]>();
    
    // Group by email and phone
    leads.forEach(lead => {
      const email = lead.email.toLowerCase().trim();
      const phone = lead.phoneNumber.replace(/\s/g, '');
      
      if (!emailMap.has(email)) emailMap.set(email, []);
      emailMap.get(email)!.push(lead);
      
      if (!phoneMap.has(phone)) phoneMap.set(phone, []);
      phoneMap.get(phone)!.push(lead);
    });
    
    const duplicates: Lead[] = [];
    const seen = new Set<string>();
    
    // Find email duplicates (keep newest, mark older ones as duplicates)
    emailMap.forEach((group) => {
      if (group.length > 1) {
        // Sort by date (newest first)
        const sorted = [...group].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Mark all except the first (newest) as duplicates
        sorted.slice(1).forEach(lead => {
          if (!seen.has(lead.id)) {
            duplicates.push(lead);
            seen.add(lead.id);
          }
        });
      }
    });
    
    // Find phone duplicates (keep newest, mark older ones as duplicates)
    phoneMap.forEach((group) => {
      if (group.length > 1) {
        const sorted = [...group].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        sorted.slice(1).forEach(lead => {
          if (!seen.has(lead.id)) {
            duplicates.push(lead);
            seen.add(lead.id);
          }
        });
      }
    });
    
    return duplicates;
  };

  const removeDuplicates = async () => {
    const duplicates = findDuplicates();
    
    if (duplicates.length === 0) {
      toast.success('No duplicates found! 🎉');
      return;
    }
    
    const confirmed = confirm(
      `Found ${duplicates.length} duplicate lead(s).\n\n` +
      `This will keep the newest entry for each email/phone and remove older duplicates.\n\n` +
      `Do you want to continue?`
    );
    
    if (!confirmed) return;
    
    try {
      let deleted = 0;
      for (const lead of duplicates) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/leads/${lead.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (response.ok) {
          deleted++;
        }
      }
      
      toast.success(`✅ Removed ${deleted} duplicate lead(s)`);
      loadLeads();
    } catch (error) {
      console.error('Error removing duplicates:', error);
      toast.error('Failed to remove duplicates');
    }
  };

  const exportLeads = () => {
    const csv = [
      ['Name', 'Business', 'Email', 'Phone', 'City', 'Type', 'Status', 'Created At'].join(','),
      ...filteredLeads.map(lead => 
        [
          lead.fullName,
          lead.businessName,
          lead.email,
          lead.phoneNumber,
          lead.city,
          lead.businessType,
          lead.status,
          new Date(lead.createdAt).toLocaleDateString(),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Leads exported successfully!');
  };

  // Filter and sort leads
  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = 
        lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phoneNumber.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.fullName.localeCompare(b.fullName);
      }
    });

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
  };
  
  // Count duplicates
  const duplicatesCount = findDuplicates().length;

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'demo-scheduled':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'converted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return <Star className="w-3 h-3" />;
      case 'contacted':
        return <Clock className="w-3 h-3" />;
      case 'demo-scheduled':
        return <Calendar className="w-3 h-3" />;
      case 'converted':
        return <CheckCircle className="w-3 h-3" />;
      case 'rejected':
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            Lead Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage and track all incoming leads from "Become a Partner"
          </p>
        </div>
        <div className="flex gap-3">
          {duplicatesCount > 0 && (
            <Button
              onClick={removeDuplicates}
              variant="outline"
              className="border-2 border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-700 relative"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Remove Duplicates
              <Badge className="ml-2 bg-orange-600 text-white">{duplicatesCount}</Badge>
            </Button>
          )}
          <Button
            onClick={exportLeads}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={leads.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">Total Leads</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium mb-1">New Leads</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.new}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">Contacted</p>
                <p className="text-3xl font-bold text-purple-900">{stats.contacted}</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Converted</p>
                <p className="text-3xl font-bold text-green-900">{stats.converted}</p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="demo-scheduled">Demo Scheduled</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-full sm:w-48">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Newest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Leads ({filteredLeads.length})
          </CardTitle>
          <CardDescription>
            All leads from the "Become a Partner" form
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No leads found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Leads will appear here when someone fills the partner form'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Business</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{lead.fullName}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <Mail className="w-3 h-3" />
                            <a href={`mailto:${lead.email}`} className="hover:text-purple-600">
                              {lead.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-0.5">
                            <Phone className="w-3 h-3" />
                            <a href={`tel:${lead.phoneNumber}`} className="hover:text-purple-600">
                              {lead.phoneNumber}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{lead.businessName}</p>
                          <p className="text-sm text-gray-600">{lead.businessType}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {lead.city}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)} cursor-pointer hover:opacity-80`}>
                              {getStatusIcon(lead.status)}
                              <span className="capitalize">{lead.status.replace('-', ' ')}</span>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'new')}>
                              <Star className="w-4 h-4 mr-2" /> New
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'contacted')}>
                              <Clock className="w-4 h-4 mr-2" /> Contacted
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'demo-scheduled')}>
                              <Calendar className="w-4 h-4 mr-2" /> Demo Scheduled
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'converted')}>
                              <CheckCircle className="w-4 h-4 mr-2" /> Converted
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'rejected')}>
                              <XCircle className="w-4 h-4 mr-2" /> Rejected
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(lead.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`mailto:${lead.email}`, '_blank')}
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteLead(lead.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}