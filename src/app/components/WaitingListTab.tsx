import { useState } from 'react';
import { Clock, Phone, Mail, Calendar, User, AlertCircle, CheckCircle, XCircle, Send, X, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';

interface WaitingListEntry {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  service: string;
  masterPreference: string;
  requestedDate: string;
  requestedTime: string;
  addedOn: string;
  status: 'waiting' | 'notified' | 'booked' | 'cancelled';
  notes?: string;
  priority: 'high' | 'normal' | 'low';
}

interface WaitingListTabProps {
  userRole?: 'owner' | 'admin' | 'master';
  onBookFromWaitingList?: (entry: WaitingListEntry) => void;
}

export function WaitingListTab({ userRole = 'owner', onBookFromWaitingList }: WaitingListTabProps) {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'waiting' | 'notified' | 'booked' | 'cancelled'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<WaitingListEntry | null>(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    service: '',
    masterPreference: 'Any available',
    requestedDate: '',
    requestedTime: '',
    priority: 'normal' as 'high' | 'normal' | 'low',
    notes: ''
  });

  // Mock data
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([
    {
      id: '1',
      clientName: 'Emma Wilson',
      phone: '+971 50 123 4567',
      email: 'emma.w@email.com',
      service: 'Hair Coloring',
      masterPreference: 'Anna Kowalska',
      requestedDate: '2024-12-24',
      requestedTime: '14:00',
      addedOn: '2024-12-23 10:30',
      status: 'waiting',
      notes: 'Prefers afternoon slots',
      priority: 'high'
    },
    {
      id: '2',
      clientName: 'Sarah Martinez',
      phone: '+971 50 234 5678',
      email: 'sarah.m@email.com',
      service: 'Manicure + Pedicure',
      masterPreference: 'Any available',
      requestedDate: '2024-12-25',
      requestedTime: '11:00',
      addedOn: '2024-12-23 09:15',
      status: 'notified',
      priority: 'normal'
    },
    {
      id: '3',
      clientName: 'Lisa Taylor',
      phone: '+971 50 345 6789',
      email: 'lisa.t@email.com',
      service: 'Women\'s Haircut',
      masterPreference: 'Sarah Johnson',
      requestedDate: '2024-12-26',
      requestedTime: '16:00',
      addedOn: '2024-12-22 15:45',
      status: 'booked',
      notes: 'VIP client',
      priority: 'high'
    },
    {
      id: '4',
      clientName: 'Maria Lopez',
      phone: '+971 50 456 7890',
      email: 'maria.l@email.com',
      service: 'Facial',
      masterPreference: 'Anna Kowalska',
      requestedDate: '2024-12-27',
      requestedTime: '10:00',
      addedOn: '2024-12-23 11:20',
      status: 'waiting',
      priority: 'normal'
    },
    {
      id: '5',
      clientName: 'Jessica Brown',
      phone: '+971 50 567 8901',
      email: 'jessica.b@email.com',
      service: 'Balayage',
      masterPreference: 'Any available',
      requestedDate: '2024-12-24',
      requestedTime: '15:00',
      addedOn: '2024-12-21 14:30',
      status: 'cancelled',
      notes: 'Client found another salon',
      priority: 'low'
    }
  ]);

  const filteredList = waitingList.filter(entry => 
    selectedStatus === 'all' || entry.status === selectedStatus
  );

  const waitingCount = waitingList.filter(e => e.status === 'waiting').length;
  const notifiedCount = waitingList.filter(e => e.status === 'notified').length;
  const bookedCount = waitingList.filter(e => e.status === 'booked').length;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'waiting':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Waiting' };
      case 'notified':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: Send, label: 'Notified' };
      case 'booked':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Booked' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Cancelled' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: 'Unknown' };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">High Priority</span>;
      case 'normal':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">Normal</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">Low</span>;
      default:
        return null;
    }
  };

  const handleAddToWaitingList = () => {
    const newEntry: WaitingListEntry = {
      id: (waitingList.length + 1).toString(),
      clientName: formData.clientName,
      phone: formData.phone,
      email: formData.email,
      service: formData.service,
      masterPreference: formData.masterPreference,
      requestedDate: formData.requestedDate,
      requestedTime: formData.requestedTime,
      addedOn: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'waiting',
      notes: formData.notes,
      priority: formData.priority
    };

    setWaitingList([...waitingList, newEntry]);
    setShowAddModal(false);
    setFormData({
      clientName: '',
      phone: '',
      email: '',
      service: '',
      masterPreference: 'Any available',
      requestedDate: '',
      requestedTime: '',
      priority: 'normal',
      notes: ''
    });
  };

  const handleNotifyClient = (entry: WaitingListEntry) => {
    setSelectedEntry(entry);
    setNotificationMessage(
      `Hi ${entry.clientName.split(' ')[0]}, good news! A slot for ${entry.service} with ${entry.masterPreference} is now available on ${entry.requestedDate} at ${entry.requestedTime}. Would you like to book it?`
    );
    setShowNotificationModal(true);
  };

  const handleSendNotification = () => {
    if (!selectedEntry) return;

    // Update status to notified
    setWaitingList(waitingList.map(e => 
      e.id === selectedEntry.id 
        ? { ...e, status: 'notified' as const }
        : e
    ));

    setShowNotificationModal(false);
    setSelectedEntry(null);
    setNotificationMessage('');
    
    toast.success(`Notification sent to ${selectedEntry.clientName} via SMS and Email`);
  };

  const handleBookClient = (entry: WaitingListEntry) => {
    // Call parent callback to open booking modal with pre-filled data
    if (onBookFromWaitingList) {
      onBookFromWaitingList(entry);
    }
    
    // Update status to booked
    setWaitingList(waitingList.map(e => 
      e.id === entry.id 
        ? { ...e, status: 'booked' as const }
        : e
    ));

    toast.success(`${entry.clientName} moved to bookings`);
  };

  const handleConfirmBooking = (entry: WaitingListEntry) => {
    // Update status to booked
    setWaitingList(waitingList.map(e => 
      e.id === entry.id 
        ? { ...e, status: 'booked' as const }
        : e
    ));

    toast.success(`Booking confirmed for ${entry.clientName}`);
  };

  const handleCancelEntry = (entry: WaitingListEntry) => {
    // Update status to cancelled
    setWaitingList(waitingList.map(e => 
      e.id === entry.id 
        ? { ...e, status: 'cancelled' as const }
        : e
    ));

    toast.info(`${entry.clientName} removed from waiting list`);
  };

  const services = [
    'Women\'s Haircut',
    'Men\'s Haircut',
    'Hair Coloring',
    'Balayage',
    'Highlights',
    'Manicure',
    'Pedicure',
    'Manicure + Pedicure',
    'Facial',
    'Massage',
    'Makeup'
  ];

  const masters = [
    'Any available',
    'Anna Kowalska',
    'Sarah Johnson',
    'Maria Garcia',
    'Emily Davis'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-8 h-8 text-purple-600" />
            Waiting List
          </h1>
          <p className="text-gray-500 mt-1">Manage client waiting list and notify when slots open</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
        >
          <User className="w-4 h-4" />
          Add to Waiting List
        </Button>
      </div>

      {/* Add to Waiting List Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add to Waiting List</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter client name"
                  required
                />
              </div>

              {/* Phone and Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+971 50 123 4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="client@email.com"
                  />
                </div>
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Service *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              {/* Master Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Master Preference
                </label>
                <select
                  value={formData.masterPreference}
                  onChange={(e) => setFormData({ ...formData, masterPreference: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {masters.map((master) => (
                    <option key={master} value={master}>{master}</option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    value={formData.requestedDate}
                    onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <input
                    type="time"
                    value={formData.requestedTime}
                    onChange={(e) => setFormData({ ...formData, requestedTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="flex gap-3">
                  {(['high', 'normal', 'low'] as const).map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority })}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.priority === priority
                          ? priority === 'high'
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : priority === 'normal'
                            ? 'border-gray-500 bg-gray-50 text-gray-700'
                            : 'border-gray-300 bg-gray-50 text-gray-500'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
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
                  placeholder="Any special requests or preferences..."
                  rows={3}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddToWaitingList}
                disabled={!formData.clientName || !formData.phone || !formData.service || !formData.requestedDate || !formData.requestedTime}
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Waiting List
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && selectedEntry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Send Notification
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{selectedEntry.clientName}</p>
                  <p className="text-sm text-gray-600">{selectedEntry.phone}</p>
                  <p className="text-sm text-gray-600">{selectedEntry.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={6}
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  Notification will be sent via SMS{selectedEntry.email ? ', Email' : ''} and WhatsApp
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNotificationModal(false);
                  setSelectedEntry(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendNotification}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Waiting</p>
                <p className="text-2xl font-bold text-yellow-600">{waitingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Notified</p>
                <p className="text-2xl font-bold text-blue-600">{notifiedCount}</p>
              </div>
              <Send className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Converted</p>
                <p className="text-2xl font-bold text-green-600">{bookedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {((bookedCount / waitingList.length) * 100).toFixed(0)}%
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        {(['all', 'waiting', 'notified', 'booked', 'cancelled'] as const).map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedStatus === status
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-white bg-opacity-20 rounded text-xs">
                {waitingList.filter(e => e.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Waiting List Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Client</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Service</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Master</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Requested Date/Time</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Added On</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Priority</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                  {userRole !== 'master' && (
                    <th className="text-right p-4 text-sm font-medium text-gray-600">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredList.map(entry => {
                  const statusConfig = getStatusConfig(entry.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{entry.clientName}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                            <Phone className="w-3 h-3" />
                            {userRole === 'master' ? '***-***-' + entry.phone.slice(-4) : entry.phone}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {entry.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-900">{entry.service}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{entry.masterPreference}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-gray-900">{entry.requestedDate}</span>
                          <span className="text-gray-500">at {entry.requestedTime}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-gray-500">{entry.addedOn}</span>
                      </td>
                      <td className="p-4">
                        {getPriorityBadge(entry.priority)}
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${statusConfig.bg}`}>
                          <StatusIcon className={`w-3 h-3 ${statusConfig.text}`} />
                          <span className={`text-xs font-medium ${statusConfig.text}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </td>
                      {userRole !== 'master' && (
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            {entry.status === 'waiting' && (
                              <>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleNotifyClient(entry)}>
                                  <Send className="w-3 h-3 mr-1" />
                                  Notify
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleBookClient(entry)}>
                                  Book
                                </Button>
                              </>
                            )}
                            {entry.status === 'notified' && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleConfirmBooking(entry)}>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Confirm Booking
                              </Button>
                            )}
                            {entry.status === 'waiting' || entry.status === 'notified' ? (
                              <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleCancelEntry(entry)}>
                                Cancel
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredList.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No entries in waiting list</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto-Notification Settings */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            Auto-Notification Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Notify when slot opens</p>
                <p className="text-xs text-gray-600">Automatically send SMS/Email when requested slot becomes available</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Priority notifications</p>
                <p className="text-xs text-gray-600">Send high-priority entries to multiple channels (SMS + Email + WhatsApp)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Auto-remove after 7 days</p>
                <p className="text-xs text-gray-600">Remove entries from waiting list if not converted within 7 days</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}