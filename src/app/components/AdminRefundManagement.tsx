import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  AlertTriangle,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  Shield,
  FileText,
} from 'lucide-react';

interface RefundRequest {
  id: number;
  salonId: number;
  salonName: string;
  owner: string;
  email: string;
  amount: number;
  paymentDate: string;
  requestDate: string;
  paymentMethod: string;
  reason: string;
  status: 'pending_verification' | 'verified' | 'pending_approval' | 'approved' | 'rejected' | 'processed';
  daysFromPayment: number;
  verifiedAt?: string;
  processedAt?: string;
  processedBy?: string;
  stripeRefundId?: string;
  rejectionReason?: string;
}

export function AdminRefundManagement() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // DEMO DATA: Запросы на возврат
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([
    {
      id: 1,
      salonId: 3,
      salonName: 'Quick Cuts',
      owner: 'John Smith',
      email: 'john@cuts.com',
      amount: 99,
      paymentDate: '2024-12-20',
      requestDate: '2024-12-22 14:30',
      paymentMethod: 'Visa •••• 1234',
      reason: 'Service did not meet expectations. Found the calendar feature too complex for our needs.',
      status: 'pending_approval',
      daysFromPayment: 2,
      verifiedAt: '2024-12-22 14:35',
    },
    {
      id: 2,
      salonId: 102,
      salonName: 'Glam Studio X',
      owner: 'Emma Davis',
      email: 'emma@glam.com',
      amount: 299,
      paymentDate: '2024-12-18',
      requestDate: '2024-12-23 10:15',
      paymentMethod: 'Mastercard •••• 5555',
      reason: 'Decided to go with a different solution. Great platform but not suitable for our business model.',
      status: 'verified',
      daysFromPayment: 5,
      verifiedAt: '2024-12-23 10:20',
    },
    {
      id: 3,
      salonId: 6,
      salonName: 'Glamour Studio',
      owner: 'Victoria Laurent',
      email: 'victoria@glamour.com',
      amount: 299,
      paymentDate: '2024-12-12',
      requestDate: '2024-12-20 09:00',
      paymentMethod: 'Visa •••• 9999',
      reason: 'Charged twice by mistake. Duplicate payment.',
      status: 'approved',
      daysFromPayment: 8,
      verifiedAt: '2024-12-20 09:05',
      processedAt: '2024-12-20 15:30',
      processedBy: 'Super Admin',
      stripeRefundId: 're_1QLxxx',
    },
    {
      id: 4,
      salonId: 101,
      salonName: 'New Beauty Spa',
      owner: 'Sarah Johnson',
      email: 'sarah@newbeauty.com',
      amount: 99,
      paymentDate: '2024-12-10',
      requestDate: '2024-12-24 11:20',
      paymentMethod: 'Visa •••• 4242',
      reason: 'Testing platform, not ready to commit yet.',
      status: 'rejected',
      daysFromPayment: 14,
      verifiedAt: '2024-12-24 11:25',
      processedAt: '2024-12-24 12:00',
      processedBy: 'Super Admin',
      rejectionReason: 'Request submitted after 7-day refund period (14 days from payment)',
    },
  ]);

  const filteredRequests = refundRequests.filter((req) => {
    if (filter !== 'all' && req.status !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        req.salonName.toLowerCase().includes(query) ||
        req.owner.toLowerCase().includes(query) ||
        req.email.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleApprove = (request: RefundRequest) => {
    if (confirm(`Approve refund of AED ${request.amount} for ${request.salonName}?`)) {
      setRefundRequests((prev) =>
        prev.map((r) =>
          r.id === request.id
            ? {
                ...r,
                status: 'approved',
                processedAt: new Date().toISOString(),
                processedBy: 'Super Admin',
                stripeRefundId: `re_${Math.random().toString(36).substr(2, 9)}`,
              }
            : r
        )
      );
      alert('✅ Refund approved! Stripe refund initiated.');
    }
  };

  const handleReject = (request: RefundRequest) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      setRefundRequests((prev) =>
        prev.map((r) =>
          r.id === request.id
            ? {
                ...r,
                status: 'rejected',
                processedAt: new Date().toISOString(),
                processedBy: 'Super Admin',
                rejectionReason: reason,
              }
            : r
        )
      );
      alert('❌ Refund rejected.');
    }
  };

  const getStatusBadge = (status: RefundRequest['status']) => {
    const configs = {
      pending_verification: { color: 'bg-gray-100 text-gray-700', label: 'Pending Verification' },
      verified: { color: 'bg-blue-100 text-blue-700', label: 'Verified' },
      pending_approval: { color: 'bg-amber-100 text-amber-700', label: 'Pending Approval' },
      approved: { color: 'bg-green-100 text-green-700', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-700', label: 'Rejected' },
      processed: { color: 'bg-purple-100 text-purple-700', label: 'Processed' },
    };
    return configs[status];
  };

  const stats = {
    pending: refundRequests.filter((r) => r.status === 'pending_approval' || r.status === 'verified')
      .length,
    approved: refundRequests.filter((r) => r.status === 'approved').length,
    rejected: refundRequests.filter((r) => r.status === 'rejected').length,
    totalAmount: refundRequests
      .filter((r) => r.status === 'approved')
      .reduce((sum, r) => sum + r.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* HEADER & STATS */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Refund Requests Management
              </h2>
              <p className="text-gray-600">Review and process customer refund requests</p>
            </div>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-5 border-2 border-amber-200 bg-amber-50">
            <Clock className="w-8 h-8 text-amber-600 mb-2" />
            <p className="text-sm text-gray-600">Pending Review</p>
            <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
          </Card>
          <Card className="p-5 border-2 border-green-200 bg-green-50">
            <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </Card>
          <Card className="p-5 border-2 border-red-200 bg-red-50">
            <XCircle className="w-8 h-8 text-red-600 mb-2" />
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </Card>
          <Card className="p-5 border-2 border-purple-200 bg-purple-50">
            <DollarSign className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-sm text-gray-600">Total Refunded</p>
            <p className="text-3xl font-bold text-purple-600">AED {stats.totalAmount}</p>
          </Card>
        </div>
      </div>

      {/* FILTERS */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by salon, owner, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">Status:</span>
            {[
              { value: 'all', label: 'All' },
              { value: 'pending_approval', label: 'Pending' },
              { value: 'verified', label: 'Verified' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ].map((f) => (
              <Button
                key={f.value}
                size="sm"
                variant={filter === f.value ? 'default' : 'outline'}
                onClick={() => setFilter(f.value)}
                className={filter === f.value ? 'bg-purple-600' : ''}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* REFUND REQUESTS LIST */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No refund requests found</p>
          </Card>
        ) : (
          filteredRequests.map((request) => {
            const statusConfig = getStatusBadge(request.status);
            const isEligible = request.daysFromPayment <= 7;

            return (
              <Card
                key={request.id}
                className={`p-6 border-2 transition-all hover:shadow-lg ${
                  request.status === 'pending_approval'
                    ? 'border-amber-200 bg-amber-50/30'
                    : request.status === 'verified'
                    ? 'border-blue-200 bg-blue-50/30'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{request.salonName}</h3>
                          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                          {!isEligible && (
                            <Badge className="bg-red-100 text-red-700 gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Outside Policy
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {request.owner}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {request.email}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Refund Amount</p>
                        <p className="text-3xl font-bold text-green-600">AED {request.amount}</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Payment Date</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {request.paymentDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Request Date</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {request.requestDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Days from Payment</p>
                        <p
                          className={`font-bold flex items-center gap-1 ${
                            isEligible ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {request.daysFromPayment} days
                          {isEligible ? ' ✓' : ' ✗'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Payment Method</p>
                        <p className="font-semibold flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          {request.paymentMethod}
                        </p>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Reason:</p>
                      <p className="text-gray-800">{request.reason}</p>
                    </div>

                    {/* Additional Info for Processed Requests */}
                    {(request.status === 'approved' || request.status === 'rejected') && (
                      <div
                        className={`p-4 rounded-lg border-2 ${
                          request.status === 'approved'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Processed At:</p>
                            <p className="font-bold">{request.processedAt}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Processed By:</p>
                            <p className="font-bold">{request.processedBy}</p>
                          </div>
                          {request.status === 'approved' && request.stripeRefundId && (
                            <div>
                              <p className="text-gray-600">Stripe Refund ID:</p>
                              <p className="font-bold font-mono text-xs">{request.stripeRefundId}</p>
                            </div>
                          )}
                          {request.status === 'rejected' && request.rejectionReason && (
                            <div className="col-span-3">
                              <p className="text-gray-600">Rejection Reason:</p>
                              <p className="font-bold text-red-700">{request.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowDetails(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>

                    {(request.status === 'verified' || request.status === 'pending_approval') && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(request)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleReject(request)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    {request.status === 'approved' && (
                      <Badge className="bg-green-600 text-white justify-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Processed
                      </Badge>
                    )}

                    {request.status === 'rejected' && (
                      <Badge className="bg-red-600 text-white justify-center">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
