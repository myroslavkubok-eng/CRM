import { useState } from 'react';
import { SuperAdminDashboardPlans } from './SuperAdminDashboardPlans';
import { LeadsManagement } from '../components/LeadsManagement';
import { SupportMessagesManagement } from '../components/SupportMessagesManagement';
import { AdminRefundManagement } from '../components/AdminRefundManagement';
import { EmailCampaignManagerWithRoles } from '../components/EmailCampaignManagerWithRoles';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  LifeBuoy,
  Flag,
  Activity,
  FileText,
  Shield,
  AlertTriangle,
  Mail,
  Key,
  UserPlus,
  TrendingDown,
  Target,
  Plug,
  Lock,
  Unlock,
  Crown,
  Bell,
  Download,
  Settings,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  RefreshCw,
  Award,
  Zap,
  Calendar,
  CreditCard,
  BarChart3,
  PieChart,
  ChevronRight,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Phone,
  Globe,
  Code,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Package,
  Gift,
  Percent,
  Receipt,
  Banknote,
  CircleDollarSign,
  Wallet,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function SuperAdminDashboard() {
  const [activeModule, setActiveModule] = useState('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedSalon, setSelectedSalon] = useState<any>(null);
  const [showSalonModal, setShowSalonModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // 💰 BILLING DATA
  const billingData = {
    mrr: 324789,
    mrrGrowth: 23.4,
    arr: 3897468,
    churnRate: 2.1,
    ltv: 8450,
    trialConversion: 68.5,
    avgRevenuePerSalon: 298,
    totalRevenue: 1247893,
  };

  const revenueByPlan = [
    { name: 'Free Trial', value: 0, count: 159, color: '#94A3B8', mrr: 0 },
    { name: 'Pro (AED 99)', value: 68013, count: 687, color: '#8B5CF6', mrr: 99 },
    { name: 'Premium (AED 299)', value: 72657, count: 243, color: '#EC4899', mrr: 299 },
    { name: 'Enterprise (AED 499)', value: 184119, count: 369, color: '#F59E0B', mrr: 499 },
  ];

  const subscriptionStatus = [
    { status: 'Active', count: 1089, color: '#10B981', percentage: 74.7 },
    { status: 'Trial', count: 159, color: '#3B82F6', percentage: 10.9 },
    { status: 'Overdue', count: 87, color: '#F59E0B', percentage: 6.0 },
    { status: 'Churned', count: 123, color: '#EF4444', percentage: 8.4 },
  ];

  const failedPayments = [
    { id: 1, salon: 'Glamour Studio', amount: 299, reason: 'Insufficient funds', date: '2024-12-22', attempts: 2 },
    { id: 2, salon: 'Bella Nails', amount: 99, reason: 'Card expired', date: '2024-12-22', attempts: 1 },
    { id: 3, salon: 'Style Bar', amount: 499, reason: 'Bank declined', date: '2024-12-21', attempts: 3 },
    { id: 4, salon: 'Luxe Spa', amount: 299, reason: 'Invalid card', date: '2024-12-21', attempts: 1 },
  ];

  const mrrTrend = [
    { month: 'Jul', mrr: 245000, newMrr: 22000, churnMrr: 8500, expansion: 5000 },
    { month: 'Aug', mrr: 268000, newMrr: 30200, churnMrr: 7200, expansion: 6000 },
    { month: 'Sep', mrr: 285000, newMrr: 24000, churnMrr: 6800, expansion: 4800 },
    { month: 'Oct', mrr: 302000, newMrr: 22900, churnMrr: 5900, expansion: 5200 },
    { month: 'Nov', mrr: 315000, newMrr: 19200, churnMrr: 6200, expansion: 6100 },
    { month: 'Dec', mrr: 324789, newMrr: 16589, churnMrr: 6800, expansion: 7000 },
  ];

  const cohortRetention = [
    { cohort: 'Jan 2024', month0: 100, month1: 92, month2: 85, month3: 78, month4: 72, month5: 68 },
    { cohort: 'Feb 2024', month0: 100, month1: 94, month2: 87, month3: 81, month4: 75, month5: 70 },
    { cohort: 'Mar 2024', month0: 100, month1: 91, month2: 83, month3: 76, month4: 71, month5: 67 },
    { cohort: 'Apr 2024', month0: 100, month1: 93, month2: 86, month3: 79, month4: 73, month5: 69 },
  ];

  const coupons = [
    { id: 1, code: 'LAUNCH2024', discount: 50, type: '%', used: 45, limit: 100, expires: '2024-12-31' },
    { id: 2, code: 'FIRST3MONTHS', discount: 30, type: '%', used: 128, limit: 500, expires: '2025-01-31' },
    { id: 3, code: 'ENTERPRISE50', discount: 50, type: 'AED', used: 12, limit: 50, expires: '2024-12-25' },
  ];

  // 🚩 FEATURE FLAGS DATA
  const featureFlags = [
    { id: 1, name: 'AI Smart Scheduling', enabled: true, rollout: 100, salons: 1089, impact: 'high', category: 'Core' },
    { id: 2, name: 'Dynamic Pricing', enabled: true, rollout: 35, salons: 381, impact: 'high', category: 'Revenue' },
    { id: 3, name: 'SMS Notifications', enabled: true, rollout: 85, salons: 926, impact: 'medium', category: 'Communication' },
    { id: 4, name: 'Group Booking', enabled: false, rollout: 0, salons: 0, impact: 'medium', category: 'Core' },
    { id: 5, name: 'Voice Booking (Beta)', enabled: true, rollout: 15, salons: 163, impact: 'low', category: 'Experimental' },
    { id: 6, name: 'White Label Branding', enabled: true, rollout: 60, salons: 653, impact: 'high', category: 'Enterprise' },
    { id: 7, name: 'Loyalty Program', enabled: true, rollout: 45, salons: 490, impact: 'medium', category: 'Revenue' },
    { id: 8, name: 'Multi-location Management', enabled: true, rollout: 100, salons: 1089, impact: 'high', category: 'Enterprise' },
  ];

  // 📜 AUDIT LOGS DATA
  const auditLogs = [
    { id: 1, user: 'admin@katia.com', action: 'Updated subscription', target: 'Glamour Studio', type: 'payment', timestamp: '2024-12-22 14:35', ip: '192.168.1.1' },
    { id: 2, user: 'owner@glamour.com', action: 'Changed pricing', target: 'Service: Haircut', type: 'settings', timestamp: '2024-12-22 13:20', ip: '192.168.1.45' },
    { id: 3, user: 'admin@katia.com', action: 'Refunded payment', target: 'Bella Nails', type: 'payment', timestamp: '2024-12-22 12:10', ip: '192.168.1.1' },
    { id: 4, user: 'system', action: 'Failed login attempt', target: 'suspicious@email.com', type: 'security', timestamp: '2024-12-22 11:55', ip: '45.123.45.67' },
    { id: 5, user: 'owner@style.com', action: 'Added new master', target: 'Master: John Doe', type: 'user', timestamp: '2024-12-22 10:30', ip: '192.168.1.89' },
  ];

  // 🌍 SYSTEM HEALTH DATA
  const systemHealth = {
    apiUptime: 99.97,
    avgLatency: 87,
    p95Latency: 145,
    p99Latency: 234,
    errorRate: 0.02,
    activeConnections: 1247,
    dbQueries: 15234,
    cdnHits: 98.5,
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 38,
  };

  const performanceData = [
    { time: '00:00', latency: 85, errors: 2, traffic: 1200 },
    { time: '04:00', latency: 92, errors: 1, traffic: 800 },
    { time: '08:00', latency: 145, errors: 5, traffic: 3500 },
    { time: '12:00', latency: 178, errors: 8, traffic: 4800 },
    { time: '16:00', latency: 156, errors: 4, traffic: 4200 },
    { time: '20:00', latency: 98, errors: 2, traffic: 2100 },
  ];

  // 💳 SUBSCRIPTION PLANS DATA
  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Базовый',
      nameEn: 'Basic',
      price: 99,
      color: '#8B5CF6',
      gradient: 'from-purple-500 to-purple-600',
      salons: 687,
      revenue: 68013,
      mrr: 68013,
      features: ['5 Masters', 'Basic Calendar', '100 Bookings/mo', 'Email Support'],
    },
    {
      id: 'standard',
      name: 'Стандарт',
      nameEn: 'Standard',
      price: 299,
      color: '#EC4899',
      gradient: 'from-pink-500 to-pink-600',
      salons: 243,
      revenue: 72657,
      mrr: 72657,
      features: ['15 Masters', 'Advanced Calendar', '500 Bookings/mo', 'Priority Support', 'SMS Notifications'],
    },
    {
      id: 'business',
      name: 'Бизнес',
      nameEn: 'Business',
      price: 499,
      color: '#F59E0B',
      gradient: 'from-amber-500 to-orange-600',
      salons: 369,
      revenue: 184119,
      mrr: 184119,
      features: ['Unlimited Masters', 'Pro Calendar + Drag&Drop', 'Unlimited Bookings', '24/7 Support', 'SMS + WhatsApp', 'Analytics Dashboard', 'White Label'],
    },
  ];

  const salonsByPlan = {
    basic: [
      { id: 1, name: 'Beauty Corner', owner: 'Maria Ivanova', email: 'maria@beauty.com', phone: '+971501234567', registered: '2024-10-15', status: 'active', revenue: 2970, bookings: 145, warnings: 0, nextPayment: '2025-01-15', autoRenew: true },
      { id: 2, name: 'Nails Art Studio', owner: 'Anna Petrova', email: 'anna@nails.com', phone: '+971509876543', registered: '2024-11-01', status: 'active', revenue: 1980, bookings: 98, warnings: 0, nextPayment: '2025-01-01', autoRenew: true },
      { id: 3, name: 'Quick Cuts', owner: 'John Smith', email: 'john@cuts.com', phone: '+971507654321', registered: '2024-09-20', status: 'overdue', revenue: 891, bookings: 45, warnings: 2, nextPayment: '2024-12-20', autoRenew: false },
      { id: 4, name: 'Hair Studio Plus', owner: 'Elena Sokolova', email: 'elena@hair.com', phone: '+971502345678', registered: '2024-08-10', status: 'active', revenue: 3960, bookings: 234, warnings: 0, nextPayment: '2025-01-10', autoRenew: true },
      { id: 5, name: 'Manicure Express', owner: 'Olga Nikolaeva', email: 'olga@mani.com', phone: '+971508765432', registered: '2024-12-01', status: 'active', revenue: 99, bookings: 12, warnings: 0, nextPayment: '2025-01-01', autoRenew: true },
    ],
    standard: [
      { id: 6, name: 'Glamour Studio', owner: 'Victoria Laurent', email: 'victoria@glamour.com', phone: '+971501111111', registered: '2024-05-12', status: 'active', revenue: 11960, bookings: 567, warnings: 0, nextPayment: '2025-01-12', autoRenew: true },
      { id: 7, name: 'Bella Salon', owner: 'Isabella Rossi', email: 'bella@salon.com', phone: '+971502222222', registered: '2024-06-20', status: 'active', revenue: 8970, bookings: 423, warnings: 0, nextPayment: '2025-01-20', autoRenew: true },
      { id: 8, name: 'Elite Beauty', owner: 'Sophia Chen', email: 'sophia@elite.com', phone: '+971503333333', registered: '2024-07-15', status: 'overdue', revenue: 5980, bookings: 289, warnings: 1, nextPayment: '2024-12-15', autoRenew: true },
      { id: 9, name: 'Luxe Nails', owner: 'Emma Wilson', email: 'emma@luxe.com', phone: '+971504444444', registered: '2024-03-10', status: 'active', revenue: 14950, bookings: 678, warnings: 0, nextPayment: '2025-01-10', autoRenew: true },
    ],
    business: [
      { id: 10, name: 'Royal Spa & Salon', owner: 'Alexander Petrov', email: 'alex@royal.com', phone: '+971505555555', registered: '2024-01-15', status: 'active', revenue: 29950, bookings: 1245, warnings: 0, nextPayment: '2025-01-15', autoRenew: true },
      { id: 11, name: 'Style Bar Premium', owner: 'Catherine Miller', email: 'cat@stylebar.com', phone: '+971506666666', registered: '2024-02-01', status: 'active', revenue: 24950, bookings: 987, warnings: 0, nextPayment: '2025-02-01', autoRenew: true },
      { id: 12, name: 'Prestige Beauty House', owner: 'Diana Volkov', email: 'diana@prestige.com', phone: '+971507777777', registered: '2024-03-20', status: 'active', revenue: 19960, bookings: 876, warnings: 0, nextPayment: '2025-01-20', autoRenew: true },
      { id: 13, name: 'VIP Salon & Spa', owner: 'Michael Johnson', email: 'michael@vip.com', phone: '+971508888888', registered: '2023-12-01', status: 'active', revenue: 34930, bookings: 1456, warnings: 0, nextPayment: '2025-01-01', autoRenew: true },
      { id: 14, name: 'Diamond Cuts', owner: 'Natalia Ivanov', email: 'nat@diamond.com', phone: '+971509999999', registered: '2024-04-10', status: 'blocked', revenue: 9980, blockReason: 'Multiple policy violations', warnings: 3, blockedDate: '2024-12-20' },
    ],
  };

  const blockedSalons = [
    { id: 14, name: 'Diamond Cuts', plan: 'Business', owner: 'Natalia Ivanov', email: 'nat@diamond.com', blockReason: 'Multiple policy violations', warnings: 3, blockedDate: '2024-12-20', revenue: 9980 },
    { id: 15, name: 'Fake Studio', plan: 'Basic', owner: 'John Doe', email: 'fake@studio.com', blockReason: 'Fraudulent activity', warnings: 5, blockedDate: '2024-12-18', revenue: 297 },
  ];

  const warningTemplates = [
    { id: 1, title: 'Quality Standards Violation', text: 'Your salon has received customer complaints about service quality...' },
    { id: 2, title: 'Policy Violation', text: 'We detected violations of platform policies...' },
    { id: 3, title: 'Payment Overdue', text: 'Your payment is overdue. Please update payment method...' },
    { id: 4, title: 'Incomplete Profile', text: 'Please complete your salon profile to continue...' },
    { id: 5, title: 'Suspicious Activity', text: 'We detected unusual activity on your account...' },
  ];

  // ⚖️ DISPUTE DATA
  const disputes = [
    { id: 1, salon: 'Glamour Studio', client: 'John Doe', issue: 'Service not completed', amount: 150, status: 'investigating', created: '2h ago' },
    { id: 2, salon: 'Bella Nails', client: 'Jane Smith', issue: 'Quality complaint', amount: 85, status: 'pending_refund', created: '1d ago' },
    { id: 3, salon: 'Style Bar', client: 'Mike Johnson', issue: 'No-show dispute', amount: 200, status: 'resolved', created: '3d ago' },
  ];

  // 🚨 FRAUD DETECTION DATA
  const fraudAlerts = [
    { id: 1, salon: 'Suspicious Salon A', risk: 87, reason: 'Multiple failed payments', action: 'Review', date: '2024-12-22' },
    { id: 2, salon: 'Test Account B', risk: 92, reason: 'Duplicate account detected', action: 'Blocked', date: '2024-12-21' },
    { id: 3, salon: 'Unknown Salon C', risk: 65, reason: 'Unusual activity pattern', action: 'Monitor', date: '2024-12-20' },
  ];

  // ✉️ EMAIL TEMPLATES DATA
  const emailTemplates = [
    { id: 1, name: 'Welcome Email', category: 'Onboarding', openRate: 78.5, clickRate: 34.2, sent: 1240 },
    { id: 2, name: 'Payment Failed', category: 'Billing', openRate: 92.3, clickRate: 67.8, sent: 87 },
    { id: 3, name: 'Trial Expiring', category: 'Conversion', openRate: 85.7, clickRate: 45.3, sent: 159 },
    { id: 4, name: 'Feature Announcement', category: 'Marketing', openRate: 56.4, clickRate: 18.9, sent: 1089 },
  ];

  // 🔑 API MANAGEMENT DATA
  const apiKeys = [
    { id: 1, salon: 'Glamour Studio', key: 'sk_live_abc123...', created: '2024-12-01', requests: 45230, status: 'active' },
    { id: 2, salon: 'Bella Nails', key: 'sk_live_def456...', created: '2024-11-15', requests: 28950, status: 'active' },
    { id: 3, salon: 'Style Bar', key: 'sk_live_ghi789...', created: '2024-10-20', requests: 89670, status: 'rate_limited' },
  ];

  // 📋 ONBOARDING DATA
  const onboardingProgress = [
    { salon: 'New Salon A', progress: 85, step: 'Upload Photos', stuck: false, lastActivity: '2h ago' },
    { salon: 'New Salon B', progress: 40, step: 'Add Services', stuck: true, lastActivity: '3d ago' },
    { salon: 'New Salon C', progress: 100, step: 'Completed', stuck: false, lastActivity: '1d ago' },
    { salon: 'New Salon D', progress: 15, step: 'Registration', stuck: true, lastActivity: '7d ago' },
  ];

  const onboardingStats = {
    avgCompletion: 72.5,
    avgTime: '4.2 days',
    stuckSalons: 23,
    completedToday: 5,
  };

  // 📉 CHURN ANALYSIS DATA
  const churnData = {
    monthlyRate: 2.1,
    quarterlyRate: 5.8,
    yearlyRate: 18.3,
    revenueLost: 45670,
    salonsChurned: 123,
    avgLifetime: 18.5,
  };

  const churnReasons = [
    { reason: 'Too expensive', count: 42, percentage: 34.1 },
    { reason: 'Missing features', count: 28, percentage: 22.8 },
    { reason: 'Poor support', count: 15, percentage: 12.2 },
    { reason: 'Technical issues', count: 19, percentage: 15.4 },
    { reason: 'Other', count: 19, percentage: 15.4 },
  ];

  // 💚 CUSTOMER SUCCESS DATA
  const customerHealthScores = [
    { salon: 'Glamour Studio', score: 92, usage: 'High', features: 85, tickets: 1, trend: 'up' },
    { salon: 'Bella Nails', score: 45, usage: 'Low', features: 30, tickets: 5, trend: 'down' },
    { salon: 'Style Bar', score: 88, usage: 'High', features: 90, tickets: 0, trend: 'up' },
    { salon: 'Luxe Spa', score: 62, usage: 'Medium', features: 55, tickets: 2, trend: 'stable' },
  ];

  // 🔌 INTEGRATIONS DATA
  const integrations = [
    { name: 'Google Calendar', active: 892, total: 1089, health: 'healthy', status: 'operational' },
    { name: 'Stripe', active: 1089, total: 1089, health: 'healthy', status: 'operational' },
    { name: 'Mailchimp', active: 234, total: 1089, health: 'healthy', status: 'operational' },
    { name: 'Zapier', active: 156, total: 1089, health: 'degraded', status: 'issues' },
  ];

  // 🔐 ADMIN PERMISSIONS DATA
  const adminUsers = [
    { id: 1, name: 'Super Admin', email: 'admin@katia.com', role: 'Full Admin', lastLogin: '2h ago' },
    { id: 2, name: 'Support Lead', email: 'support@katia.com', role: 'Support Admin', lastLogin: '5h ago' },
    { id: 3, name: 'Billing Manager', email: 'billing@katia.com', role: 'Billing Admin', lastLogin: '1d ago' },
    { id: 4, name: 'Viewer', email: 'viewer@katia.com', role: 'View Only', lastLogin: '3d ago' },
  ];

  // 📊 SIDEBAR MODULES
  const modules = [
    { id: 'leads', icon: UserPlus, label: 'Lead Management', badge: 'NEW' },
    { id: 'billing', icon: DollarSign, label: 'Billing & Subscriptions', badge: '23' },
    { id: 'refunds', icon: RefreshCw, label: 'Refund Requests', badge: '2' },
    { id: 'support', icon: LifeBuoy, label: 'Support Tickets', badge: '5 urgent' },
    { id: 'features', icon: Flag, label: 'Feature Flags', badge: null },
    { id: 'audit', icon: FileText, label: 'Audit Logs', badge: null },
    { id: 'health', icon: Activity, label: 'System Health', badge: '99.97%' },
    { id: 'plans', icon: Package, label: 'Subscription Plans', badge: '1299' },
    { id: 'disputes', icon: AlertTriangle, label: 'Dispute Resolution', badge: '3' },
    { id: 'fraud', icon: Shield, label: 'Fraud Detection', badge: '2' },
    { id: 'emails', icon: Mail, label: 'Email Campaigns', badge: '5' },
    { id: 'api', icon: Key, label: 'API Management', badge: null },
    { id: 'onboarding', icon: UserPlus, label: 'Onboarding Pipeline', badge: '23' },
    { id: 'churn', icon: TrendingDown, label: 'Churn Analysis', badge: null },
    { id: 'success', icon: Target, label: 'Customer Success', badge: null },
    { id: 'integrations', icon: Plug, label: 'Integrations', badge: null },
    { id: 'permissions', icon: Lock, label: 'Admin Permissions', badge: null },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
      {/* 👑 SUPER ADMIN HEADER */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center shadow-xl">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Katia Super Admin Dashboard</h1>
                <p className="text-purple-100">Platform Control Center • Real-time SaaS Metrics</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white/20 border-2 border-white/40 text-white hover:bg-white/30 backdrop-blur-lg">
                <Bell className="w-5 h-5 mr-2" />
                Alerts (5)
              </Button>
              <Button className="bg-white/20 border-2 border-white/40 text-white hover:bg-white/30 backdrop-blur-lg">
                <Download className="w-5 h-5 mr-2" />
                Export
              </Button>
              <Button className="bg-white/20 border-2 border-white/40 text-white hover:bg-white/30 backdrop-blur-lg">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* 📱 SIDEBAR NAVIGATION */}
        <aside className="w-80 bg-white border-r-2 border-gray-200 h-screen overflow-y-auto sticky top-0 shadow-xl">
          <div className="p-6">
            {/* 🔍 SEARCH */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search modules..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* 🔥 MODULES LIST */}
            <nav className="space-y-2">
              {modules
                .filter((m) => m.label.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((module) => {
                  const Icon = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        activeModule === module.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold text-sm">{module.label}</span>
                      </div>
                      {module.badge && (
                        <Badge
                          className={
                            activeModule === module.id
                              ? 'bg-white/20 text-white'
                              : 'bg-purple-100 text-purple-700'
                          }
                        >
                          {module.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
            </nav>

            {/* 🚨 CRITICAL ALERTS */}
            <div className="mt-8 p-4 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-red-900">Critical Alerts</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-gray-700">5 urgent support tickets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                  <span className="text-gray-700">23 failed payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full" />
                  <span className="text-gray-700">2 fraud alerts</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* 📊 MAIN CONTENT AREA */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* 🎯 LEADS MANAGEMENT */}
          {activeModule === 'leads' && (
            <div className="space-y-8">
              <LeadsManagement />
            </div>
          )}

          {/* 💰 1. BILLING & SUBSCRIPTIONS */}
          {activeModule === 'billing' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Billing & Subscriptions</h2>
                  <p className="text-gray-600">Revenue management, subscriptions, and financial analytics</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>

              {/* 💎 KEY METRICS */}
              <div className="grid grid-cols-4 gap-6">
                <Card className="p-6 border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-10 h-10 text-green-600" />
                    <Badge className="bg-green-600 text-white">+{billingData.mrrGrowth}%</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Recurring Revenue</p>
                  <p className="text-3xl font-bold text-green-600">AED {billingData.mrr.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+AED 18,450 this month</span>
                  </div>
                </Card>

                <Card className="p-6 border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-10 h-10 text-purple-600" />
                    <Badge className="bg-purple-600 text-white">ARR</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Annual Recurring Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">AED {(billingData.arr / 1000000).toFixed(2)}M</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-purple-600">
                    <Award className="w-4 h-4" />
                    <span>Target: AED 4.5M</span>
                  </div>
                </Card>

                <Card className="p-6 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-10 h-10 text-blue-600" />
                    <Badge className="bg-blue-600 text-white">LTV</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Lifetime Value per Salon</p>
                  <p className="text-3xl font-bold text-blue-600">AED {billingData.ltv.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
                    <Zap className="w-4 h-4" />
                    <span>LTV/CAC: 6.8x</span>
                  </div>
                </Card>

                <Card className="p-6 border-2 border-red-100 bg-gradient-to-br from-red-50 to-orange-50">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingDown className="w-10 h-10 text-red-600" />
                    <Badge className="bg-red-600 text-white">Churn</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Churn Rate</p>
                  <p className="text-3xl font-bold text-red-600">{billingData.churnRate}%</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <ArrowDownRight className="w-4 h-4" />
                    <span>-0.3% vs last month</span>
                  </div>
                </Card>
              </div>

              {/* 📈 MRR TREND CHART */}
              <Card className="p-6 border-2 border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">MRR Growth & Movement</h3>
                    <p className="text-gray-600">New MRR, Expansion, and Churn breakdown</p>
                  </div>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Last 6 Months
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={mrrTrend}>
                    <defs>
                      <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="mrr"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorMrr)"
                      name="Total MRR"
                    />
                    <Line type="monotone" dataKey="newMrr" stroke="#10B981" strokeWidth={2} name="New MRR" />
                    <Line type="monotone" dataKey="expansion" stroke="#3B82F6" strokeWidth={2} name="Expansion" />
                    <Line type="monotone" dataKey="churnMrr" stroke="#EF4444" strokeWidth={2} name="Churn MRR" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* 💰 REVENUE BY PLAN */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6 border-2 border-gray-100">
                  <h3 className="text-xl font-bold mb-6">Revenue Distribution by Plan</h3>
                  <div className="space-y-6">
                    {revenueByPlan.map((plan) => (
                      <div key={plan.name}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: plan.color }} />
                            <div>
                              <h4 className="font-bold text-lg">{plan.name}</h4>
                              <p className="text-sm text-gray-600">{plan.count} active salons</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              AED {plan.value.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {((plan.value / billingData.mrr) * 100).toFixed(1)}% of MRR
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all"
                            style={{
                              width: `${(plan.value / billingData.mrr) * 100}%`,
                              backgroundColor: plan.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 border-2 border-gray-100">
                  <h3 className="text-xl font-bold mb-6">Subscription Status</h3>
                  <div className="space-y-4">
                    {subscriptionStatus.map((status) => (
                      <div key={status.status} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          <div>
                            <p className="font-bold text-lg">{status.status}</p>
                            <p className="text-sm text-gray-600">{status.percentage}% of total</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color: status.color }}>
                            {status.count}
                          </p>
                          <p className="text-xs text-gray-500">salons</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* 💳 FAILED PAYMENTS */}
              <Card className="p-6 border-2 border-red-100 bg-red-50/30">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-2xl font-bold">Failed Payments Requiring Action</h3>
                  <Badge className="bg-red-600 text-white">{failedPayments.length} alerts</Badge>
                </div>
                <div className="space-y-4">
                  {failedPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="bg-white p-5 rounded-xl border-2 border-gray-100 hover:border-red-300 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-lg">{payment.salon}</h4>
                            <Badge className="bg-red-100 text-red-700">
                              {payment.attempts} attempt{payment.attempts > 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                            <span>💰 AED {payment.amount}</span>
                            <span>⚠️ {payment.reason}</span>
                            <span>📅 {payment.date}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Retry
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 🎟️ COHORT RETENTION */}
              <Card className="p-6 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6">Cohort Retention Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-3 font-bold">Cohort</th>
                        <th className="text-center p-3 font-bold">Month 0</th>
                        <th className="text-center p-3 font-bold">Month 1</th>
                        <th className="text-center p-3 font-bold">Month 2</th>
                        <th className="text-center p-3 font-bold">Month 3</th>
                        <th className="text-center p-3 font-bold">Month 4</th>
                        <th className="text-center p-3 font-bold">Month 5</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohortRetention.map((cohort) => (
                        <tr key={cohort.cohort} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-semibold">{cohort.cohort}</td>
                          <td className="text-center p-3">
                            <span className="inline-block px-3 py-1 rounded-lg bg-green-100 text-green-700 font-semibold">
                              {cohort.month0}%
                            </span>
                          </td>
                          <td className="text-center p-3">
                            <span className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-semibold">
                              {cohort.month1}%
                            </span>
                          </td>
                          <td className="text-center p-3">
                            <span className="inline-block px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-semibold">
                              {cohort.month2}%
                            </span>
                          </td>
                          <td className="text-center p-3">
                            <span className="inline-block px-3 py-1 rounded-lg bg-purple-100 text-purple-700 font-semibold">
                              {cohort.month3}%
                            </span>
                          </td>
                          <td className="text-center p-3">
                            <span className="inline-block px-3 py-1 rounded-lg bg-orange-100 text-orange-700 font-semibold">
                              {cohort.month4}%
                            </span>
                          </td>
                          <td className="text-center p-3">
                            <span className="inline-block px-3 py-1 rounded-lg bg-red-100 text-red-700 font-semibold">
                              {cohort.month5}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* 🎁 COUPONS & DISCOUNTS */}
              <Card className="p-6 border-2 border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">Coupons & Discount Management</h3>
                    <p className="text-gray-600">Active promotional codes and usage tracking</p>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Coupon
                  </Button>
                </div>
                <div className="space-y-4">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                          <Gift className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-bold">{coupon.code}</h4>
                            <Badge className="bg-purple-600 text-white">
                              {coupon.discount}
                              {coupon.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <span>✅ Used: {coupon.used}/{coupon.limit}</span>
                            <span>📅 Expires: {coupon.expires}</span>
                            <span>📊 {((coupon.used / coupon.limit) * 100).toFixed(0)}% utilized</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 📊 ADDITIONAL METRICS */}
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="p-6 border-2 border-blue-100 bg-blue-50/30">
                  <Calendar className="w-10 h-10 text-blue-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Trial → Paid Conversion</p>
                  <p className="text-3xl font-bold text-blue-600">{billingData.trialConversion}%</p>
                  <p className="text-sm text-gray-600 mt-2">109 of 159 trials converted</p>
                </Card>

                <Card className="p-6 border-2 border-green-100 bg-green-50/30">
                  <Wallet className="w-10 h-10 text-green-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Avg Revenue per Salon</p>
                  <p className="text-3xl font-bold text-green-600">AED {billingData.avgRevenuePerSalon}</p>
                  <p className="text-sm text-gray-600 mt-2">Per month</p>
                </Card>

                <Card className="p-6 border-2 border-purple-100 bg-purple-50/30">
                  <Receipt className="w-10 h-10 text-purple-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Total Platform Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">
                    AED {(billingData.totalRevenue / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-gray-600 mt-2">This month</p>
                </Card>
              </div>
            </div>
          )}

          {/* 💸 REFUND REQUESTS MANAGEMENT */}
          {activeModule === 'refunds' && (
            <AdminRefundManagement />
          )}

          {/* 🎫 2. SUPPORT & CONTACT MESSAGES */}
          {activeModule === 'support' && (
            <SupportMessagesManagement />
          )}

          {/* 🚩 3. FEATURE FLAGS */}
          {activeModule === 'features' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Feature Flags Control Center</h2>
                  <p className="text-gray-600">Enable/disable features and control gradual rollout</p>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Feature Flag
                </Button>
              </div>

              {/* 📊 FEATURE STATS */}
              <div className="grid grid-cols-4 gap-6">
                <Card className="p-6 border-2 border-green-100 bg-green-50/30">
                  <Flag className="w-10 h-10 text-green-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Total Features</p>
                  <p className="text-3xl font-bold text-green-600">{featureFlags.length}</p>
                </Card>

                <Card className="p-6 border-2 border-blue-100 bg-blue-50/30">
                  <CheckCircle className="w-10 h-10 text-blue-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Enabled</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {featureFlags.filter((f) => f.enabled).length}
                  </p>
                </Card>

                <Card className="p-6 border-2 border-orange-100 bg-orange-50/30">
                  <Zap className="w-10 h-10 text-orange-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">In Rollout</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {featureFlags.filter((f) => f.rollout > 0 && f.rollout < 100).length}
                  </p>
                </Card>

                <Card className="p-6 border-2 border-purple-100 bg-purple-50/30">
                  <Target className="w-10 h-10 text-purple-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">High Impact</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {featureFlags.filter((f) => f.impact === 'high').length}
                  </p>
                </Card>
              </div>

              {/* 🚩 FEATURE FLAGS LIST */}
              <div className="space-y-4">
                {featureFlags.map((flag) => (
                  <Card
                    key={flag.id}
                    className={`p-6 border-2 transition-all ${
                      flag.enabled ? 'border-green-200 bg-green-50/30' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h4 className="text-2xl font-bold">{flag.name}</h4>
                          <Badge
                            className={
                              flag.enabled
                                ? 'bg-green-600 text-white text-sm px-3 py-1'
                                : 'bg-gray-400 text-white text-sm px-3 py-1'
                            }
                          >
                            {flag.enabled ? '✅ ENABLED' : '❌ DISABLED'}
                          </Badge>
                          <Badge
                            className={
                              flag.impact === 'high'
                                ? 'bg-red-100 text-red-700'
                                : flag.impact === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }
                          >
                            {flag.impact.toUpperCase()} IMPACT
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-700">{flag.category}</Badge>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-700">Rollout Progress:</span>
                            <span className="text-lg font-bold text-purple-600">{flag.rollout}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-5">
                            <div
                              className={`h-5 rounded-full transition-all ${
                                flag.enabled
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                                  : 'bg-gray-400'
                              }`}
                              style={{ width: `${flag.rollout}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-8 text-sm">
                          <span className="font-semibold">
                            🏢 {flag.salons.toLocaleString()} active salons
                          </span>
                          {flag.rollout > 0 && (
                            <span className="text-gray-600">
                              📊 {((flag.salons / 1089) * 100).toFixed(1)}% of platform
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 ml-8">
                        {flag.enabled ? (
                          <>
                            <Button className="bg-orange-600 hover:bg-orange-700">
                              <Edit className="w-4 h-4 mr-2" />
                              Adjust Rollout
                            </Button>
                            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                              <XCircle className="w-4 h-4 mr-2" />
                              Disable
                            </Button>
                          </>
                        ) : (
                          <Button className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Enable Feature
                          </Button>
                        )}
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 📜 4. AUDIT LOGS */}
          {activeModule === 'audit' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Audit Logs & Activity Tracking</h2>
                  <p className="text-gray-600">Complete history of all platform actions and events</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter by Type
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export Logs
                  </Button>
                </div>
              </div>

              {/* 📊 LOG STATS */}
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: 'Total Events', value: '15,234', color: 'gray' },
                  { label: 'User Actions', value: '8,945', color: 'blue' },
                  { label: 'Payment Events', value: '3,421', color: 'green' },
                  { label: 'Settings Changes', value: '1,876', color: 'purple' },
                  { label: 'Security Events', value: '892', color: 'red' },
                ].map((stat) => (
                  <Card key={stat.label} className={`p-5 border-2 border-${stat.color}-100 bg-${stat.color}-50/30`}>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  </Card>
                ))}
              </div>

              {/* 📜 LOGS TABLE */}
              <Card className="p-6 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-5 rounded-xl border-2 ${
                        log.type === 'security'
                          ? 'bg-red-50 border-red-200'
                          : log.type === 'payment'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge
                              className={
                                log.type === 'security'
                                  ? 'bg-red-600 text-white'
                                  : log.type === 'payment'
                                  ? 'bg-green-600 text-white'
                                  : log.type === 'settings'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-blue-600 text-white'
                              }
                            >
                              {log.type.toUpperCase()}
                            </Badge>
                            <h4 className="font-bold text-lg">{log.action}</h4>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                            <span>👤 {log.user}</span>
                            <span>🎯 {log.target}</span>
                            <span>⏰ {log.timestamp}</span>
                            <span>🌐 IP: {log.ip}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* 🌍 5. SYSTEM HEALTH */}
          {activeModule === 'health' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">System Health Monitor</h2>
                <p className="text-gray-600">Real-time platform performance and infrastructure metrics</p>
              </div>

              {/* 🌍 SYSTEM STATS */}
              <div className="grid grid-cols-3 gap-6">
                <Card className="p-6 border-2 border-green-100 bg-green-50/50">
                  <Activity className="w-10 h-10 text-green-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">API Uptime</p>
                  <p className="text-4xl font-bold text-green-600">{systemHealth.apiUptime}%</p>
                  <Badge className="mt-2 bg-green-600 text-white">Excellent</Badge>
                </Card>

                <Card className="p-6 border-2 border-blue-100 bg-blue-50/50">
                  <Zap className="w-10 h-10 text-blue-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Avg API Latency</p>
                  <p className="text-4xl font-bold text-blue-600">{systemHealth.avgLatency}ms</p>
                  <Badge className="mt-2 bg-blue-600 text-white">Fast</Badge>
                </Card>

                <Card className="p-6 border-2 border-purple-100 bg-purple-50/50">
                  <Shield className="w-10 h-10 text-purple-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Error Rate</p>
                  <p className="text-4xl font-bold text-purple-600">{systemHealth.errorRate}%</p>
                  <Badge className="mt-2 bg-purple-600 text-white">Healthy</Badge>
                </Card>
              </div>

              {/* 📈 PERFORMANCE CHART */}
              <Card className="p-6 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6">24-Hour Performance Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="latency"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      name="Latency (ms)"
                    />
                    <Line type="monotone" dataKey="errors" stroke="#EF4444" strokeWidth={3} name="Errors" />
                    <Line
                      type="monotone"
                      dataKey="traffic"
                      stroke="#10B981"
                      strokeWidth={3}
                      name="Traffic"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* 🔥 INFRASTRUCTURE STATUS */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6 border-2 border-gray-100">
                  <h3 className="text-xl font-bold mb-6">Infrastructure Status</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'API Servers', status: 'operational', value: '8/8 healthy', icon: Server },
                      {
                        name: 'Database Cluster',
                        status: 'operational',
                        value: 'Primary + 2 replicas',
                        icon: Database,
                      },
                      {
                        name: 'CDN Network',
                        status: 'operational',
                        value: `${systemHealth.cdnHits}% hit rate`,
                        icon: Globe,
                      },
                      { name: 'Message Queue', status: 'operational', value: '0 delayed jobs', icon: Package },
                      { name: 'Cache Layer', status: 'operational', value: '99.2% hit rate', icon: Zap },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Icon className="w-6 h-6 text-gray-600" />
                            <span className="font-semibold">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">{item.value}</span>
                            <Badge className="bg-green-100 text-green-700">{item.status}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="p-6 border-2 border-gray-100">
                  <h3 className="text-xl font-bold mb-6">Server Resources</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'CPU Usage', value: systemHealth.cpuUsage, icon: Cpu, color: 'purple' },
                      { label: 'Memory Usage', value: systemHealth.memoryUsage, icon: Server, color: 'blue' },
                      { label: 'Disk Usage', value: systemHealth.diskUsage, icon: HardDrive, color: 'green' },
                    ].map((resource) => {
                      const Icon = resource.icon;
                      return (
                        <div key={resource.label}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="w-5 h-5 text-gray-600" />
                              <span className="font-semibold">{resource.label}</span>
                            </div>
                            <span className={`text-2xl font-bold text-${resource.color}-600`}>
                              {resource.value}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 bg-${resource.color}-600 rounded-full`}
                              style={{ width: `${resource.value}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* 💳 6. SUBSCRIPTION PLANS MANAGEMENT */}
          {activeModule === 'plans' && <SuperAdminDashboardPlans />}

          {/* OLD PLANS MODULE - REPLACED WITH SuperAdminDashboardPlans */}
          {false && activeModule === 'plans_old' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Subscription Plans Management</h2>
                  <p className="text-gray-600">Manage salon subscriptions by plan tier</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                    <Users className="w-4 h-4 mr-2" />
                    View All Salons
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>

              {/* 💎 SUBSCRIPTION PLANS CARDS */}
              {!selectedPlan && (
                <>
                  <div className="grid lg:grid-cols-3 gap-6">
                    {subscriptionPlans.map((plan) => (
                      <Card
                        key={plan.id}
                        className="p-6 border-2 border-gray-200 hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <div className={`h-2 rounded-t-xl bg-gradient-to-r ${plan.gradient} mb-4`} />
                        <div className="text-center mb-6">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                            <Package className="w-10 h-10" style={{ color: plan.color }} />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                          <div className="flex items-baseline justify-center gap-2 mb-4">
                            <span className="text-5xl font-bold" style={{ color: plan.color }}>
                              {plan.price}
                            </span>
                            <span className="text-gray-600">AED/mo</span>
                          </div>
                          <Badge className="text-sm px-4 py-2" style={{ backgroundColor: plan.color, color: 'white' }}>
                            {plan.salons} Active Salons
                          </Badge>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Monthly Revenue:</span>
                            <span className="font-bold text-green-600">AED {plan.mrr.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Avg per Salon:</span>
                            <span className="font-bold">AED {plan.price}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Market Share:</span>
                            <span className="font-bold text-purple-600">
                              {((plan.salons / 1299) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          <p className="text-xs font-bold text-gray-400 uppercase">Features:</p>
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          className="w-full"
                          style={{ backgroundColor: plan.color }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlan(plan.id);
                          }}
                        >
                          View {plan.salons} Salons
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Card>
                    ))}
                  </div>

                  {/* 📊 QUICK STATS */}
                  <div className="grid grid-cols-5 gap-4">
                    <Card className="p-5 border-2 border-green-100 bg-green-50/50">
                      <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                      <p className="text-sm text-gray-600">Total Salons</p>
                      <p className="text-3xl font-bold text-green-600">1,299</p>
                    </Card>

                    <Card className="p-5 border-2 border-purple-100 bg-purple-50/50">
                      <DollarSign className="w-8 h-8 text-purple-600 mb-2" />
                      <p className="text-sm text-gray-600">Total MRR</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {(subscriptionPlans.reduce((acc, p) => acc + p.mrr, 0) / 1000).toFixed(0)}K
                      </p>
                    </Card>

                    <Card className="p-5 border-2 border-blue-100 bg-blue-50/50">
                      <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                      <p className="text-sm text-gray-600">Avg Revenue</p>
                      <p className="text-3xl font-bold text-blue-600">
                        AED {Math.round(subscriptionPlans.reduce((acc, p) => acc + p.mrr, 0) / 1299)}
                      </p>
                    </Card>

                    <Card className="p-5 border-2 border-orange-100 bg-orange-50/50">
                      <AlertTriangle className="w-8 h-8 text-orange-600 mb-2" />
                      <p className="text-sm text-gray-600">Overdue</p>
                      <p className="text-3xl font-bold text-orange-600">8</p>
                    </Card>

                    <Card className="p-5 border-2 border-red-100 bg-red-50/50">
                      <XCircle className="w-8 h-8 text-red-600 mb-2" />
                      <p className="text-sm text-gray-600">Blocked</p>
                      <p className="text-3xl font-bold text-red-600">{blockedSalons.length}</p>
                    </Card>
                  </div>

                  {/* 🚫 BLOCKED SALONS */}
                  {blockedSalons.length > 0 && (
                    <Card className="p-6 border-2 border-red-200 bg-red-50/30">
                      <div className="flex items-center gap-3 mb-6">
                        <XCircle className="w-6 h-6 text-red-600" />
                        <h3 className="text-2xl font-bold text-red-900">Blocked Salons</h3>
                        <Badge className="bg-red-600 text-white">{blockedSalons.length}</Badge>
                      </div>
                      <div className="space-y-4">
                        {blockedSalons.map((salon) => (
                          <div
                            key={salon.id}
                            className="bg-white p-5 rounded-xl border-2 border-red-200 hover:shadow-lg transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-bold text-lg">{salon.name}</h4>
                                  <Badge className="bg-red-600 text-white">BLOCKED</Badge>
                                  <Badge className="bg-purple-100 text-purple-700">{salon.plan}</Badge>
                                </div>
                                <div className="grid grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                  <span>👤 {salon.owner}</span>
                                  <span>✉️ {salon.email}</span>
                                  <span>⚠️ {salon.warnings} warnings</span>
                                  <span>💰 AED {salon.revenue.toLocaleString()} lost</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                  <span className="text-sm font-semibold text-red-900">
                                    Reason: {salon.blockReason}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-2">Blocked: {salon.blockedDate}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <Unlock className="w-4 h-4 mr-1" />
                                  Unblock
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </>
              )}

              {/* 🏢 SALONS LIST BY SELECTED PLAN */}
              {selectedPlan && (
                <div className="space-y-6">
                  {/* HEADER */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPlan(null)}
                        className="flex items-center gap-2"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Back to Plans
                      </Button>
                      <div>
                        <h3 className="text-2xl font-bold">
                          {subscriptionPlans.find((p) => p.id === selectedPlan)?.name} Plan Salons
                        </h3>
                        <p className="text-gray-600">
                          {salonsByPlan[selectedPlan as keyof typeof salonsByPlan]?.length || 0} active salons
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter: {filterStatus === 'all' ? 'All' : filterStatus}
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>

                  {/* FILTERS */}
                  <div className="flex gap-2">
                    {['all', 'active', 'overdue', 'blocked'].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={filterStatus === status ? 'default' : 'outline'}
                        onClick={() => setFilterStatus(status)}
                        className={filterStatus === status ? 'bg-purple-600' : ''}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>

                  {/* SALONS TABLE */}
                  <Card className="p-6 border-2 border-gray-100">
                    <div className="space-y-4">
                      {(salonsByPlan[selectedPlan as keyof typeof salonsByPlan] || [])
                        .filter(
                          (salon) => filterStatus === 'all' || salon.status === filterStatus
                        )
                        .map((salon) => (
                          <div
                            key={salon.id}
                            className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                              salon.status === 'blocked'
                                ? 'bg-red-50 border-red-200'
                                : salon.status === 'overdue'
                                ? 'bg-orange-50 border-orange-200'
                                : 'bg-white border-gray-100'
                            }`}
                            onClick={() => {
                              setSelectedSalon(salon);
                              setShowSalonModal(true);
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h4 className="text-xl font-bold">{salon.name}</h4>
                                  <Badge
                                    className={
                                      salon.status === 'active'
                                        ? 'bg-green-600 text-white'
                                        : salon.status === 'overdue'
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-red-600 text-white'
                                    }
                                  >
                                    {salon.status.toUpperCase()}
                                  </Badge>
                                  {salon.warnings > 0 && (
                                    <Badge className="bg-red-100 text-red-700">
                                      {salon.warnings} warning{salon.warnings > 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                  {salon.autoRenew && salon.status === 'active' && (
                                    <Badge className="bg-blue-100 text-blue-700">Auto-Renew ✓</Badge>
                                  )}
                                </div>

                                <div className="grid grid-cols-5 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500">Owner</p>
                                    <p className="font-semibold">{salon.owner}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Email</p>
                                    <p className="font-semibold">{salon.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Phone</p>
                                    <p className="font-semibold">{salon.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Total Revenue</p>
                                    <p className="font-bold text-green-600">AED {salon.revenue.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Bookings</p>
                                    <p className="font-bold text-purple-600">{salon.bookings}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                  <div>
                                    <p className="text-gray-500">Registered</p>
                                    <p className="font-semibold">{salon.registered}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Next Payment</p>
                                    <p className="font-semibold">
                                      {salon.status === 'blocked'
                                        ? `Blocked: ${(salon as any).blockedDate}`
                                        : salon.nextPayment}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 ml-6">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSalon(salon);
                                    setShowSalonModal(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                                {salon.status !== 'blocked' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-orange-600 hover:bg-orange-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        alert(`Send warning to ${salon.name}`);
                                      }}
                                    >
                                      <AlertTriangle className="w-4 h-4 mr-1" />
                                      Send Warning
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 border-red-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (
                                          confirm(
                                            `Are you sure you want to block ${salon.name}?`
                                          )
                                        ) {
                                          alert(`Salon ${salon.name} has been blocked`);
                                        }
                                      }}
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Block Salon
                                    </Button>
                                  </>
                                )}
                                {salon.status === 'blocked' && (
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        confirm(`Are you sure you want to unblock ${salon.name}?`)
                                      ) {
                                        alert(`Salon ${salon.name} has been unblocked`);
                                      }
                                    }}
                                  >
                                    <Unlock className="w-4 h-4 mr-1" />
                                    Unblock
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* 🔥 SALON DETAILS MODAL */}
              {showSalonModal && selectedSalon && (
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setShowSalonModal(false)}
                >
                  <Card
                    className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-8">
                      {/* HEADER */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-3xl font-bold">{selectedSalon.name}</h3>
                            <Badge
                              className={
                                selectedSalon.status === 'active'
                                  ? 'bg-green-600 text-white'
                                  : selectedSalon.status === 'overdue'
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-red-600 text-white'
                              }
                            >
                              {selectedSalon.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-gray-600">Salon ID: #{selectedSalon.id}</p>
                        </div>
                        <Button variant="outline" onClick={() => setShowSalonModal(false)}>
                          <XCircle className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* DETAILS GRID */}
                      <div className="grid lg:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                          <h4 className="font-bold text-lg border-b pb-2">Contact Information</h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-500">Owner Name</p>
                              <p className="font-semibold">{selectedSalon.owner}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-semibold">{selectedSalon.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-semibold">{selectedSalon.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-bold text-lg border-b pb-2">Subscription Details</h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-500">Current Plan</p>
                              <p className="font-bold text-purple-600">
                                {subscriptionPlans.find((p) => p.id === selectedPlan)?.name} (AED{' '}
                                {subscriptionPlans.find((p) => p.id === selectedPlan)?.price}/mo)
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Registered Date</p>
                              <p className="font-semibold">{selectedSalon.registered}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Next Payment</p>
                              <p className="font-semibold">{selectedSalon.nextPayment || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Auto-Renew</p>
                              <Badge className={selectedSalon.autoRenew ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                {selectedSalon.autoRenew ? 'Enabled ✓' : 'Disabled'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* STATS CARDS */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <Card className="p-4 border-2 border-green-100 bg-green-50/50">
                          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                          <p className="text-2xl font-bold text-green-600">
                            AED {selectedSalon.revenue.toLocaleString()}
                          </p>
                        </Card>
                        <Card className="p-4 border-2 border-purple-100 bg-purple-50/50">
                          <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                          <p className="text-2xl font-bold text-purple-600">{selectedSalon.bookings}</p>
                        </Card>
                        <Card className="p-4 border-2 border-red-100 bg-red-50/50">
                          <p className="text-sm text-gray-600 mb-1">Warnings</p>
                          <p className="text-2xl font-bold text-red-600">{selectedSalon.warnings}</p>
                        </Card>
                      </div>

                      {/* WARNING SECTION */}
                      {selectedSalon.status !== 'blocked' && (
                        <Card className="p-6 border-2 border-orange-100 bg-orange-50/30 mb-6">
                          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            Send Warning to Salon
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-semibold mb-2 block">Select Warning Template</label>
                              <select className="w-full p-3 border-2 border-gray-200 rounded-lg">
                                {warningTemplates.map((template) => (
                                  <option key={template.id} value={template.id}>
                                    {template.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <Button className="w-full bg-orange-600 hover:bg-orange-700">
                              <Send className="w-4 h-4 mr-2" />
                              Send Warning Email
                            </Button>
                          </div>
                        </Card>
                      )}

                      {/* ACTION BUTTONS */}
                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact Owner
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Download Report
                        </Button>
                        {selectedSalon.status !== 'blocked' && (
                          <Button
                            className="flex-1 bg-red-600 hover:bg-red-700"
                            onClick={() => {
                              if (confirm(`Block ${selectedSalon.name}?`)) {
                                alert('Salon blocked!');
                                setShowSalonModal(false);
                              }
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Block Salon
                          </Button>
                        )}
                        {selectedSalon.status === 'blocked' && (
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              if (confirm(`Unblock ${selectedSalon.name}?`)) {
                                alert('Salon unblocked!');
                                setShowSalonModal(false);
                              }
                            }}
                          >
                            <Unlock className="w-4 h-4 mr-2" />
                            Unblock Salon
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* ⚖️ 7. DISPUTE RESOLUTION */}
          {activeModule === 'disputes' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Dispute Resolution Center</h2>
                <p className="text-gray-600">Manage conflicts between salons and clients</p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <Card className="p-6 border-2 border-orange-100 bg-orange-50/50">
                  <AlertTriangle className="w-10 h-10 text-orange-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Active Disputes</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {disputes.filter((d) => d.status !== 'resolved').length}
                  </p>
                </Card>

                <Card className="p-6 border-2 border-green-100 bg-green-50/50">
                  <CheckCircle className="w-10 h-10 text-green-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Resolved This Month</p>
                  <p className="text-3xl font-bold text-green-600">
                    {disputes.filter((d) => d.status === 'resolved').length}
                  </p>
                </Card>

                <Card className="p-6 border-2 border-purple-100 bg-purple-50/50">
                  <DollarSign className="w-10 h-10 text-purple-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Total Amount in Dispute</p>
                  <p className="text-3xl font-bold text-purple-600">
                    AED {disputes.reduce((acc, d) => acc + d.amount, 0).toLocaleString()}
                  </p>
                </Card>
              </div>

              <Card className="p-6 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6">Active Disputes</h3>
                <div className="space-y-4">
                  {disputes.map((dispute) => (
                    <div
                      key={dispute.id}
                      className={`p-5 rounded-xl border-2 ${
                        dispute.status === 'resolved'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-orange-50 border-orange-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge
                              className={
                                dispute.status === 'resolved'
                                  ? 'bg-green-600 text-white'
                                  : dispute.status === 'investigating'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-orange-600 text-white'
                              }
                            >
                              {dispute.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <h4 className="font-bold text-lg">{dispute.issue}</h4>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                            <span>🏢 {dispute.salon}</span>
                            <span>👤 {dispute.client}</span>
                            <span>💰 AED {dispute.amount}</span>
                            <span>⏰ {dispute.created}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {dispute.status !== 'resolved' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* 🚨 8. FRAUD DETECTION */}
          {activeModule === 'fraud' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Fraud Detection & Prevention</h2>
                <p className="text-gray-600">Monitor suspicious activity and protect the platform</p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <Card className="p-6 border-2 border-red-100 bg-red-50/50">
                  <Shield className="w-10 h-10 text-red-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">High Risk Alerts</p>
                  <p className="text-3xl font-bold text-red-600">{fraudAlerts.filter((a) => a.risk >= 80).length}</p>
                </Card>

                <Card className="p-6 border-2 border-orange-100 bg-orange-50/50">
                  <AlertTriangle className="w-10 h-10 text-orange-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Under Review</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {fraudAlerts.filter((a) => a.action === 'Review').length}
                  </p>
                </Card>

                <Card className="p-6 border-2 border-gray-100 bg-gray-50/50">
                  <Lock className="w-10 h-10 text-gray-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Blocked Accounts</p>
                  <p className="text-3xl font-bold text-gray-600">
                    {fraudAlerts.filter((a) => a.action === 'Blocked').length}
                  </p>
                </Card>
              </div>

              <Card className="p-6 border-2 border-red-100 bg-red-50/30">
                <h3 className="text-2xl font-bold mb-6">Fraud Alerts</h3>
                <div className="space-y-4">
                  {fraudAlerts.map((alert) => (
                    <div key={alert.id} className="bg-white p-5 rounded-xl border-2 border-red-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge
                              className={
                                alert.risk >= 80
                                  ? 'bg-red-600 text-white'
                                  : alert.risk >= 60
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-yellow-600 text-white'
                              }
                            >
                              RISK: {alert.risk}%
                            </Badge>
                            <Badge
                              className={
                                alert.action === 'Blocked'
                                  ? 'bg-gray-600 text-white'
                                  : alert.action === 'Review'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-green-600 text-white'
                              }
                            >
                              {alert.action.toUpperCase()}
                            </Badge>
                            <h4 className="font-bold text-lg">{alert.salon}</h4>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <span>⚠️ {alert.reason}</span>
                            <span>📅 {alert.date}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <Lock className="w-4 h-4 mr-1" />
                            Block
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Investigate
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ✉️ 9. EMAIL CAMPAIGNS */}
          {activeModule === 'emails' && (
            <EmailCampaignManagerWithRoles />
          )}

          {activeModule === 'emails_old' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Email Templates Manager</h2>
                  <p className="text-gray-600">Manage automated email communications and campaigns</p>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {emailTemplates.map((template) => (
                  <Card key={template.id} className="p-6 border-2 border-gray-100 hover:shadow-lg transition-all">
                    <Mail className="w-10 h-10 text-purple-600 mb-3" />
                    <h4 className="font-bold text-lg mb-2">{template.name}</h4>
                    <Badge className="mb-4 bg-purple-100 text-purple-700">{template.category}</Badge>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Open Rate:</span>
                        <span className="font-bold text-green-600">{template.openRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Click Rate:</span>
                        <span className="font-bold text-blue-600">{template.clickRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Sent:</span>
                        <span className="font-bold">{template.sent}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 🔑 10. API MANAGEMENT */}
          {activeModule === 'api' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">API Management</h2>
                  <p className="text-gray-600">Monitor API usage and manage access keys</p>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate API Key
                </Button>
              </div>

              <Card className="p-6 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6">Active API Keys</h3>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="p-5 bg-gray-50 rounded-xl border-2 border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-lg">{apiKey.salon}</h4>
                            <Badge
                              className={
                                apiKey.status === 'active'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-orange-600 text-white'
                              }
                            >
                              {apiKey.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                            <span>🔑 {apiKey.key}</span>
                            <span>📊 {apiKey.requests.toLocaleString()} requests</span>
                            <span>📅 Created: {apiKey.created}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Rotate
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* 📋 11. ONBOARDING PIPELINE */}
          {activeModule === 'onboarding' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Onboarding Pipeline</h2>
                <p className="text-gray-600">Track salon setup progress and identify stuck salons</p>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <Card className="p-6 border-2 border-blue-100 bg-blue-50/50">
                  <UserPlus className="w-10 h-10 text-blue-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Avg Completion Rate</p>
                  <p className="text-3xl font-bold text-blue-600">{onboardingStats.avgCompletion}%</p>
                </Card>

                <Card className="p-6 border-2 border-purple-100 bg-purple-50/50">
                  <Clock className="w-10 h-10 text-purple-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Avg Time to Complete</p>
                  <p className="text-3xl font-bold text-purple-600">{onboardingStats.avgTime}</p>
                </Card>

                <Card className="p-6 border-2 border-orange-100 bg-orange-50/50">
                  <AlertTriangle className="w-10 h-10 text-orange-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Stuck Salons</p>
                  <p className="text-3xl font-bold text-orange-600">{onboardingStats.stuckSalons}</p>
                </Card>

                <Card className="p-6 border-2 border-green-100 bg-green-50/50">
                  <CheckCircle className="w-10 h-10 text-green-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Completed Today</p>
                  <p className="text-3xl font-bold text-green-600">{onboardingStats.completedToday}</p>
                </Card>
              </div>

              <Card className="p-6 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6">Onboarding Progress</h3>
                <div className="space-y-4">
                  {onboardingProgress.map((salon, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-xl border-2 ${
                        salon.stuck ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-lg">{salon.salon}</h4>
                            {salon.stuck && <Badge className="bg-orange-600 text-white">STUCK</Badge>}
                          </div>
                          <p className="text-sm text-gray-600">
                            Current Step: {salon.step} • Last Activity: {salon.lastActivity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-purple-600">{salon.progress}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full ${
                            salon.stuck ? 'bg-orange-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'
                          }`}
                          style={{ width: `${salon.progress}%` }}
                        />
                      </div>
                      {salon.stuck && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Mail className="w-4 h-4 mr-1" />
                            Send Reminder
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4 mr-1" />
                            Call Salon
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* 📉 12. CHURN ANALYSIS */}
          {activeModule === 'churn' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Churn Analysis & Prevention</h2>
                <p className="text-gray-600">Understand why salons leave and implement win-back strategies</p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <Card className="p-6 border-2 border-red-100 bg-red-50/50">
                  <TrendingDown className="w-10 h-10 text-red-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Monthly Churn Rate</p>
                  <p className="text-3xl font-bold text-red-600">{churnData.monthlyRate}%</p>
                </Card>

                <Card className="p-6 border-2 border-orange-100 bg-orange-50/50">
                  <DollarSign className="w-10 h-10 text-orange-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Revenue Lost</p>
                  <p className="text-3xl font-bold text-orange-600">AED {churnData.revenueLost.toLocaleString()}</p>
                </Card>

                <Card className="p-6 border-2 border-purple-100 bg-purple-50/50">
                  <Users className="w-10 h-10 text-purple-600 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Salons Churned</p>
                  <p className="text-3xl font-bold text-purple-600">{churnData.salonsChurned}</p>
                </Card>
              </div>

              <Card className="p-6 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6">Churn Reasons</h3>
                <div className="space-y-4">
                  {churnReasons.map((reason, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{reason.reason}</span>
                        <span className="text-sm text-gray-600">
                          {reason.count} salons ({reason.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 bg-red-600 rounded-full"
                          style={{ width: `${reason.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* 💚 13. CUSTOMER SUCCESS */}
          {activeModule === 'success' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Customer Success Dashboard</h2>
                <p className="text-gray-600">Monitor salon health scores and proactive outreach</p>
              </div>

              <Card className="p-6 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6">Health Score Monitoring</h3>
                <div className="space-y-4">
                  {customerHealthScores.map((salon, idx) => (
                    <div key={idx} className="p-5 bg-gray-50 rounded-xl border-2 border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="font-bold text-lg">{salon.salon}</h4>
                            <Badge
                              className={
                                salon.score >= 80
                                  ? 'bg-green-600 text-white'
                                  : salon.score >= 60
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-red-600 text-white'
                              }
                            >
                              Health Score: {salon.score}/100
                            </Badge>
                            <Badge
                              className={
                                salon.trend === 'up'
                                  ? 'bg-green-100 text-green-700'
                                  : salon.trend === 'down'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                              }
                            >
                              {salon.trend === 'up' ? '↗' : salon.trend === 'down' ? '↘' : '→'} {salon.trend.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                            <span>📊 Usage: {salon.usage}</span>
                            <span>⚡ Features: {salon.features}%</span>
                            <span>🎫 Tickets: {salon.tickets}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {salon.score < 60 && (
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              <Phone className="w-4 h-4 mr-1" />
                              Urgent Call
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* 🔌 14. INTEGRATIONS */}
          {activeModule === 'integrations' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Integration Marketplace</h2>
                <p className="text-gray-600">Manage third-party integrations and monitor health</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {integrations.map((integration, idx) => (
                  <Card key={idx} className="p-6 border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Plug className="w-10 h-10 text-purple-600" />
                        <div>
                          <h4 className="font-bold text-xl">{integration.name}</h4>
                          <p className="text-sm text-gray-600">
                            {integration.active} of {integration.total} salons
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          integration.status === 'operational'
                            ? 'bg-green-600 text-white'
                            : 'bg-orange-600 text-white'
                        }
                      >
                        {integration.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Adoption Rate</span>
                        <span className="font-bold">{((integration.active / integration.total) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 bg-purple-600 rounded-full"
                          style={{ width: `${(integration.active / integration.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 🔐 15. ADMIN PERMISSIONS */}
          {activeModule === 'permissions' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Super Admin Permissions</h2>
                  <p className="text-gray-600">Manage admin team roles and access control</p>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Admin
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {[
                  { role: 'Full Admin', count: 1, color: 'purple' },
                  { role: 'Support Admin', count: 1, color: 'blue' },
                  { role: 'Billing Admin', count: 1, color: 'green' },
                  { role: 'View Only', count: 1, color: 'gray' },
                ].map((stat) => (
                  <Card key={stat.role} className={`p-6 border-2 border-${stat.color}-100 bg-${stat.color}-50/30`}>
                    <Lock className={`w-10 h-10 text-${stat.color}-600 mb-3`} />
                    <p className="text-sm text-gray-600 mb-1">{stat.role}</p>
                    <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.count}</p>
                  </Card>
                ))}
              </div>

              <Card className="p-6 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6">Admin Users</h3>
                <div className="space-y-4">
                  {adminUsers.map((admin) => (
                    <div key={admin.id} className="p-5 bg-gray-50 rounded-xl border-2 border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-lg">{admin.name}</h4>
                            <Badge
                              className={
                                admin.role === 'Full Admin'
                                  ? 'bg-purple-600 text-white'
                                  : admin.role === 'Support Admin'
                                  ? 'bg-blue-600 text-white'
                                  : admin.role === 'Billing Admin'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-600 text-white'
                              }
                            >
                              {admin.role}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <span>✉️ {admin.email}</span>
                            <span>⏰ Last Login: {admin.lastLogin}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
