import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { RefundRequestModal } from '../components/RefundRequestModal';
import type { RefundRequestData } from '../components/RefundRequestModal';
import {
  Package,
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  Mail,
  Download,
  Filter,
  Search,
  ChevronRight,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Unlock,
  Send,
  Phone,
  MessageSquare,
  Calendar,
  CreditCard,
  RefreshCw,
  Award,
  Zap,
  Target,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  Tag,
  Bell,
  Settings,
  ExternalLink,
  Copy,
  Check,
  Percent,
  Gift,
  ShoppingCart,
  Sparkles,
  Crown,
  Star,
  ChevronDown,
  Calendar as CalendarIcon,
  Upload,
  UserPlus,
  Plug,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
} from 'recharts';

export function SuperAdminDashboardPlans() {
  // 🎯 STATES
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedSalon, setSelectedSalon] = useState<any>(null);
  const [showSalonModal, setShowSalonModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSalons, setSelectedSalons] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTrialSection, setShowTrialSection] = useState(false);

  // 🔴 REAL-TIME STATES
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [realtimeStats, setRealtimeStats] = useState({
    newSalons: 0,
    newPayments: 0,
    failedPayments: 0,
    warnings: 0,
  });

  // 🎨 NEW FEATURES STATES
  const [showScheduledActions, setShowScheduledActions] = useState(false);
  const [showRevenueForecasting, setShowRevenueForecasting] = useState(false);
  const [showChurnPrediction, setShowChurnPrediction] = useState(false);
  const [showABTesting, setShowABTesting] = useState(false);
  const [showEmailCampaigns, setShowEmailCampaigns] = useState(false);
  const [showSalonBenchmarking, setShowSalonBenchmarking] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonSalons, setComparisonSalons] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('details');
  const [revenueFilter, setRevenueFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [warningsFilter, setWarningsFilter] = useState('all');
  const [autoRenewFilter, setAutoRenewFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showCustomPricing, setShowCustomPricing] = useState(false);
  const [billingPeriodFilter, setBillingPeriodFilter] = useState('all'); // NEW: фильтр по периодам
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundSalon, setRefundSalon] = useState<any>(null);

  // 🚀 ADVANCED FEATURES STATES
  const [showCustomReports, setShowCustomReports] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

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
      churnRate: 3.2,
      avgLifetime: 14.5,
      conversionRate: 62.3,
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
      churnRate: 1.8,
      avgLifetime: 22.3,
      conversionRate: 78.9,
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
      churnRate: 0.9,
      avgLifetime: 31.8,
      conversionRate: 89.2,
      features: ['Unlimited Masters', 'Pro Calendar + Drag&Drop', 'Unlimited Bookings', '24/7 Support', 'SMS + WhatsApp', 'Analytics Dashboard', 'White Label'],
    },
  ];

  // 🆓 TRIAL SALONS DATA
  const trialSalons = [
    { id: 101, name: 'New Beauty Spa', owner: 'Sarah Johnson', email: 'sarah@newbeauty.com', phone: '+971501112233', registered: '2024-12-08', expiresIn: 15, daysLeft: 15, bookings: 23, activity: 78, conversionProbability: 85, status: 'active' },
    { id: 102, name: 'Glam Studio X', owner: 'Emma Davis', email: 'emma@glam.com', phone: '+971502223344', registered: '2024-12-15', expiresIn: 8, daysLeft: 8, bookings: 42, activity: 92, conversionProbability: 95, status: 'active' },
    { id: 103, name: 'Quick Salon', owner: 'Mike Brown', email: 'mike@quick.com', phone: '+971503334455', registered: '2024-12-20', expiresIn: 3, daysLeft: 3, bookings: 8, activity: 45, conversionProbability: 62, status: 'expiring_soon' },
    { id: 104, name: 'Test Salon ABC', owner: 'Test User', email: 'test@abc.com', phone: '+971504445566', registered: '2024-12-22', expiresIn: 1, daysLeft: 1, bookings: 2, activity: 15, conversionProbability: 28, status: 'expiring_soon' },
    { id: 105, name: 'Beauty Hub', owner: 'Lisa White', email: 'lisa@hub.com', phone: '+971505556677', registered: '2024-12-01', expiresIn: 22, daysLeft: 22, bookings: 67, activity: 88, conversionProbability: 92, status: 'active' },
  ];

  // 🏢 SALONS BY PLAN WITH EXTENDED DATA
  const salonsByPlan = {
    basic: [
      {
        id: 1,
        name: 'Beauty Corner',
        owner: 'Maria Ivanova',
        email: 'maria@beauty.com',
        phone: '+971501234567',
        registered: '2024-10-15',
        status: 'active',
        revenue: 2970,
        bookings: 145,
        warnings: 0,
        nextPayment: '2025-01-15',
        autoRenew: true,
        healthScore: 92,
        billingPeriod: 'monthly', // Месячная подписка
        tags: ['VIP', 'High-Value'],
        notes: [
          { id: 1, admin: 'John Admin', date: '2024-12-20', text: 'Great customer, very active' },
        ],
        paymentHistory: [
          { id: 1, date: '2024-12-15', amount: 99, status: 'success', method: 'Visa •••• 4242' },
          { id: 2, date: '2024-11-15', amount: 99, status: 'success', method: 'Visa •••• 4242' },
          { id: 3, date: '2024-10-15', amount: 99, status: 'success', method: 'Visa •••• 4242' },
        ],
        timeline: [
          { id: 1, date: '2024-10-15', type: 'registration', text: 'Registered (Basic Plan)' },
          { id: 2, date: '2024-11-15', type: 'payment', text: 'Payment received: AED 99' },
          { id: 3, date: '2024-12-15', type: 'payment', text: 'Payment received: AED 99' },
        ],
        communications: [
          { id: 1, date: '2024-12-10', type: 'email', subject: 'Feature Announcement', status: 'opened' },
          { id: 2, date: '2024-11-20', type: 'email', subject: 'Monthly Newsletter', status: 'opened' },
        ],
        integrations: [
          { name: 'Google Calendar', status: 'active', lastSync: '2024-12-22 14:30' },
          { name: 'Stripe', status: 'active', lastSync: '2024-12-22 14:30' },
          { name: 'Mailchimp', status: 'inactive', lastSync: null },
        ],
      },
      {
        id: 2,
        name: 'Nails Art Studio',
        owner: 'Anna Petrova',
        email: 'anna@nails.com',
        phone: '+971509876543',
        registered: '2024-11-01',
        status: 'active',
        revenue: 1980,
        bookings: 98,
        warnings: 0,
        nextPayment: '2025-01-01',
        autoRenew: true,
        healthScore: 78,
        billingPeriod: 'semi-annual', // 6 месяцев
        tags: [],
        notes: [],
        paymentHistory: [
          { id: 1, date: '2024-12-01', amount: 99, status: 'success', method: 'Mastercard •••• 5555' },
          { id: 2, date: '2024-11-01', amount: 99, status: 'success', method: 'Mastercard •••• 5555' },
        ],
        timeline: [
          { id: 1, date: '2024-11-01', type: 'registration', text: 'Registered (Basic Plan)' },
          { id: 2, date: '2024-12-01', type: 'payment', text: 'Payment received: AED 99' },
        ],
        communications: [],
        integrations: [
          { name: 'Google Calendar', status: 'active', lastSync: '2024-12-22 12:15' },
          { name: 'Stripe', status: 'active', lastSync: '2024-12-22 12:15' },
        ],
      },
      {
        id: 3,
        name: 'Quick Cuts',
        owner: 'John Smith',
        email: 'john@cuts.com',
        phone: '+971507654321',
        registered: '2024-09-20',
        status: 'overdue',
        revenue: 891,
        bookings: 45,
        warnings: 2,
        nextPayment: '2024-12-20',
        autoRenew: false,
        healthScore: 35,
        billingPeriod: 'annual', // Годовая подписка
        tags: ['At-Risk', 'Payment-Issues'],
        notes: [
          { id: 1, admin: 'Sarah Admin', date: '2024-12-20', text: 'Payment failed 2 times, called owner - promised to update card' },
          { id: 2, admin: 'John Admin', date: '2024-12-18', text: 'Sent payment reminder email' },
        ],
        paymentHistory: [
          { id: 1, date: '2024-12-20', amount: 99, status: 'failed', method: 'Visa •••• 1234', reason: 'Card expired' },
          { id: 2, date: '2024-12-18', amount: 99, status: 'failed', method: 'Visa •••• 1234', reason: 'Insufficient funds' },
          { id: 3, date: '2024-11-20', amount: 99, status: 'success', method: 'Visa •••• 1234' },
        ],
        timeline: [
          { id: 1, date: '2024-09-20', type: 'registration', text: 'Registered (Basic Plan)' },
          { id: 2, date: '2024-12-18', type: 'warning', text: 'Warning sent: Payment Overdue' },
          { id: 3, date: '2024-12-20', type: 'payment_failed', text: 'Payment failed: Card expired' },
        ],
        communications: [
          { id: 1, date: '2024-12-20', type: 'phone', subject: 'Payment issue follow-up', status: 'completed' },
          { id: 2, date: '2024-12-18', type: 'email', subject: 'Payment Overdue Warning', status: 'opened' },
        ],
        integrations: [
          { name: 'Google Calendar', status: 'active', lastSync: '2024-12-15 09:30' },
          { name: 'Stripe', status: 'active', lastSync: '2024-12-15 09:30' },
        ],
      },
      {
        id: 4,
        name: 'Shine & Glow',
        owner: 'Emma Thompson',
        email: 'emma@shine.com',
        phone: '+971508888888',
        registered: '2024-07-15',
        status: 'active',
        revenue: 2970,
        bookings: 134,
        warnings: 0,
        nextPayment: '2025-01-15',
        autoRenew: true,
        healthScore: 85,
        billingPeriod: 'semi-annual', // 6 месяцев
        tags: [],
        notes: [],
        paymentHistory: [
          { id: 1, date: '2024-07-15', amount: 495, status: 'success', method: 'Visa •••• 2222' },
        ],
        timeline: [
          { id: 1, date: '2024-07-15', type: 'registration', text: 'Registered (Basic Plan - 6 months)' },
        ],
        communications: [],
        integrations: [
          { name: 'Google Calendar', status: 'active', lastSync: '2024-12-22 11:00' },
          { name: 'Stripe', status: 'active', lastSync: '2024-12-22 11:00' },
        ],
      },
      {
        id: 5,
        name: 'Fresh Look Salon',
        owner: 'David Lee',
        email: 'david@fresh.com',
        phone: '+971509999999',
        registered: '2024-01-20',
        status: 'active',
        revenue: 5940,
        bookings: 289,
        warnings: 0,
        nextPayment: '2025-01-20',
        autoRenew: true,
        healthScore: 91,
        billingPeriod: 'annual', // Годовая подписка
        tags: ['High-Value'],
        notes: [],
        paymentHistory: [
          { id: 1, date: '2024-01-20', amount: 990, status: 'success', method: 'Mastercard •••• 4444' },
        ],
        timeline: [
          { id: 1, date: '2024-01-20', type: 'registration', text: 'Registered (Basic Plan - Annual)' },
        ],
        communications: [],
        integrations: [
          { name: 'Google Calendar', status: 'active', lastSync: '2024-12-22 10:30' },
          { name: 'Stripe', status: 'active', lastSync: '2024-12-22 10:30' },
        ],
      },
    ],
    standard: [
      {
        id: 6,
        name: 'Glamour Studio',
        owner: 'Victoria Laurent',
        email: 'victoria@glamour.com',
        phone: '+971501111111',
        registered: '2024-05-12',
        status: 'active',
        revenue: 11960,
        bookings: 567,
        warnings: 0,
        nextPayment: '2025-01-12',
        autoRenew: true,
        healthScore: 98,
        billingPeriod: 'monthly', // Месячная подписка
        tags: ['VIP', 'High-Revenue', 'Top-Performer'],
        notes: [
          { id: 1, admin: 'CEO', date: '2024-12-01', text: 'Excellent partner, considering upgrade to Business' },
        ],
        paymentHistory: [
          { id: 1, date: '2024-12-12', amount: 299, status: 'success', method: 'Visa •••• 9999' },
          { id: 2, date: '2024-11-12', amount: 299, status: 'success', method: 'Visa •••• 9999' },
          { id: 3, date: '2024-10-12', amount: 299, status: 'success', method: 'Visa •••• 9999' },
        ],
        timeline: [
          { id: 1, date: '2024-05-12', type: 'registration', text: 'Registered (Basic Plan)' },
          { id: 2, date: '2024-08-01', type: 'upgrade', text: 'Upgraded to Standard Plan' },
          { id: 3, date: '2024-12-12', type: 'payment', text: 'Payment received: AED 299' },
        ],
        communications: [
          { id: 1, date: '2024-12-15', type: 'email', subject: 'Business Plan Offer (20% off)', status: 'opened' },
        ],
        integrations: [
          { name: 'Google Calendar', status: 'active', lastSync: '2024-12-22 15:45' },
          { name: 'Stripe', status: 'active', lastSync: '2024-12-22 15:45' },
          { name: 'Mailchimp', status: 'active', lastSync: '2024-12-22 10:30' },
        ],
      },
      {
        id: 7,
        name: 'Elite Beauty Lounge',
        owner: 'Sofia Martinez',
        email: 'sofia@elite.com',
        phone: '+971502222222',
        registered: '2024-03-10',
        status: 'active',
        revenue: 8970,
        bookings: 423,
        warnings: 0,
        nextPayment: '2025-03-10',
        autoRenew: true,
        healthScore: 94,
        billingPeriod: 'semi-annual', // 6 месяцев
        tags: ['High-Value'],
        notes: [],
        paymentHistory: [
          { id: 1, date: '2024-09-10', amount: 1497, status: 'success', method: 'Visa •••• 8888' },
          { id: 2, date: '2024-03-10', amount: 1497, status: 'success', method: 'Visa •••• 8888' },
        ],
        timeline: [
          { id: 1, date: '2024-03-10', type: 'registration', text: 'Registered (Standard Plan - 6 months)' },
          { id: 2, date: '2024-09-10', type: 'payment', text: 'Payment received: AED 1,497 (6 months)' },
        ],
        communications: [],
        integrations: [
          { name: 'Google Calendar', status: 'active', lastSync: '2024-12-22 13:20' },
          { name: 'Stripe', status: 'active', lastSync: '2024-12-22 13:20' },
        ],
      },
      {
        id: 8,
        name: 'Prestige Salon',
        owner: 'Michael Chen',
        email: 'michael@prestige.com',
        phone: '+971503333333',
        registered: '2024-01-05',
        status: 'active',
        revenue: 14352,
        bookings: 678,
        warnings: 0,
        nextPayment: '2025-01-05',
        autoRenew: true,
        healthScore: 96,
        billingPeriod: 'annual', // Годовая подписка
        tags: ['VIP', 'Top-Performer'],
        notes: [],
        paymentHistory: [
          { id: 1, date: '2024-01-05', amount: 2989, status: 'success', method: 'Amex •••• 7777' },
        ],
        timeline: [
          { id: 1, date: '2024-01-05', type: 'registration', text: 'Registered (Standard Plan - Annual)' },
        ],
        communications: [],
        integrations: [
          { name: 'Google Calendar', status: 'active', lastSync: '2024-12-22 14:50' },
          { name: 'Stripe', status: 'active', lastSync: '2024-12-22 14:50' },
        ],
      },
    ],
    business: [
      {
        id: 10,
        name: 'Royal Spa & Salon',
        owner: 'Alexander Petrov',
        email: 'alex@royal.com',
        phone: '+971505555555',
        registered: '2024-01-15',
        status: 'active',
        revenue: 29950,
        bookings: 1245,
        warnings: 0,
        nextPayment: '2025-01-15',
        autoRenew: true,
        healthScore: 100,
        billingPeriod: 'annual', // Годовая подписка
        tags: ['VIP', 'Enterprise', 'Top-Revenue'],
        notes: [
          { id: 1, admin: 'CEO', date: '2024-11-20', text: 'Top customer, offered custom enterprise plan' },
        ],
        paymentHistory: [
          { id: 1, date: '2024-12-15', amount: 499, status: 'success', method: 'Amex •••• 1111' },
          { id: 2, date: '2024-11-15', amount: 499, status: 'success', method: 'Amex •••• 1111' },
        ],
        timeline: [
          { id: 1, date: '2024-01-15', type: 'registration', text: 'Registered (Standard Plan)' },
          { id: 2, date: '2024-03-01', type: 'upgrade', text: 'Upgraded to Business Plan' },
        ],
        communications: [],
        integrations: [
          { name: 'Google Calendar', status: 'active', lastSync: '2024-12-22 16:00' },
          { name: 'Stripe', status: 'active', lastSync: '2024-12-22 16:00' },
          { name: 'Mailchimp', status: 'active', lastSync: '2024-12-22 14:20' },
          { name: 'Zapier', status: 'active', lastSync: '2024-12-22 11:10' },
        ],
      },
      {
        id: 11,
        name: 'Luxe Beauty Empire',
        owner: 'Isabella Rodriguez',
        email: 'isabella@luxe.com',
        phone: '+971506666666',
        registered: '2024-06-01',
        status: 'active',
        revenue: 14970,
        bookings: 834,
        warnings: 0,
        nextPayment: '2024-12-01',
        autoRenew: true,
        healthScore: 97,
        billingPeriod: 'semi-annual', // 6 месяцев
        tags: ['VIP', 'High-Revenue'],
        notes: [],
        paymentHistory: [
          { id: 1, date: '2024-06-01', amount: 2495, status: 'success', method: 'Visa •••• 6666' },
          { id: 2, date: '2024-12-01', amount: 2495, status: 'success', method: 'Visa •••• 6666' },
        ],
        timeline: [
          { id: 1, date: '2024-06-01', type: 'registration', text: 'Registered (Business Plan - 6 months)' },
          { id: 2, date: '2024-12-01', type: 'payment', text: 'Payment received: AED 2,495 (6 months)' },
        ],
        communications: [],
        integrations: [
          { name: 'Google Calendar', status: 'active', lastSync: '2024-12-22 16:30' },
          { name: 'Stripe', status: 'active', lastSync: '2024-12-22 16:30' },
          { name: 'Mailchimp', status: 'active', lastSync: '2024-12-22 15:00' },
        ],
      },
      {
        id: 12,
        name: 'Diamond Beauty Palace',
        owner: 'Olivia Williams',
        email: 'olivia@diamond.com',
        phone: '+971507777777',
        registered: '2024-02-01',
        status: 'active',
        revenue: 22456,
        bookings: 1456,
        warnings: 0,
        nextPayment: '2025-02-01',
        autoRenew: true,
        healthScore: 99,
        billingPeriod: 'monthly', // Месячная подписка
        tags: ['VIP', 'Enterprise', 'Top-Revenue'],
        notes: [
          { id: 1, admin: 'CEO', date: '2024-12-15', text: 'Top tier customer, highly satisfied' },
        ],
        paymentHistory: [
          { id: 1, date: '2024-12-01', amount: 499, status: 'success', method: 'Amex •••• 3333' },
          { id: 2, date: '2024-11-01', amount: 499, status: 'success', method: 'Amex •••• 3333' },
        ],
        timeline: [
          { id: 1, date: '2024-02-01', type: 'registration', text: 'Registered (Business Plan)' },
        ],
        communications: [],
        integrations: [
          { name: 'Google Calendar', status: 'active', lastSync: '2024-12-22 17:00' },
          { name: 'Stripe', status: 'active', lastSync: '2024-12-22 17:00' },
          { name: 'Mailchimp', status: 'active', lastSync: '2024-12-22 16:30' },
        ],
      },
    ],
  };

  // 🚫 BLOCKED SALONS
  const blockedSalons = [
    {
      id: 14,
      name: 'Diamond Cuts',
      plan: 'Business',
      owner: 'Natalia Ivanov',
      email: 'nat@diamond.com',
      blockReason: 'Multiple policy violations (fake reviews, spam)',
      warnings: 3,
      blockedDate: '2024-12-20',
      revenue: 9980,
    },
  ];

  // 📊 ANALYTICS DATA
  const revenueTrendData = [
    { month: 'Jul', basic: 58000, standard: 62000, business: 145000 },
    { month: 'Aug', basic: 62000, standard: 68000, business: 165000 },
    { month: 'Sep', basic: 64000, standard: 70000, business: 172000 },
    { month: 'Oct', basic: 66000, standard: 71000, business: 178000 },
    { month: 'Nov', basic: 67000, standard: 72000, business: 182000 },
    { month: 'Dec', basic: 68013, standard: 72657, business: 184119 },
  ];

  const conversionFunnelData = [
    { name: 'Trial Started', value: 230, fill: '#94A3B8' },
    { name: 'Basic Plan', value: 143, fill: '#8B5CF6' },
    { name: 'Standard Plan', value: 56, fill: '#EC4899' },
    { name: 'Business Plan', value: 33, fill: '#F59E0B' },
  ];

  const upgradeDowngradeData = [
    { month: 'Jul', upgrades: 12, downgrades: 3 },
    { month: 'Aug', upgrades: 15, downgrades: 4 },
    { month: 'Sep', upgrades: 18, downgrades: 2 },
    { month: 'Oct', upgrades: 14, downgrades: 5 },
    { month: 'Nov', upgrades: 20, downgrades: 3 },
    { month: 'Dec', upgrades: 23, downgrades: 2 },
  ];

  // 🏷️ AVAILABLE TAGS
  const availableTags = [
    { name: 'VIP', color: '#8B5CF6' },
    { name: 'High-Value', color: '#10B981' },
    { name: 'At-Risk', color: '#EF4444' },
    { name: 'Payment-Issues', color: '#F59E0B' },
    { name: 'Top-Performer', color: '#3B82F6' },
    { name: 'Enterprise', color: '#EC4899' },
    { name: 'Top-Revenue', color: '#10B981' },
    { name: 'Problem-Customer', color: '#EF4444' },
    { name: 'New', color: '#6366F1' },
  ];

  // ⚙️ AUTO-ACTIONS SETTINGS
  const autoActions = [
    { id: 1, name: 'Auto-block after 3 warnings', enabled: true },
    { id: 2, name: 'Auto-downgrade if payment fails 3 times', enabled: false },
    { id: 3, name: 'Auto-reminder emails (overdue +1/3/7 days)', enabled: true },
    { id: 4, name: 'Auto-cancel trial if no activity', enabled: false },
  ];

  // 📅 SCHEDULED ACTIONS DATA
  const scheduledActions = [
    { id: 1, action: 'Send payment reminder', salon: 'Beauty Corner', date: '2025-01-14 10:00', status: 'pending' },
    { id: 2, action: 'Block salon (3 warnings)', salon: 'Quick Cuts', date: '2025-01-15 00:00', status: 'pending' },
    { id: 3, action: 'Trial expiration warning', salon: 'Test Salon ABC', date: '2024-12-24 09:00', status: 'pending' },
    { id: 4, action: 'Auto-upgrade offer', salon: 'Glamour Studio', date: '2025-01-10 12:00', status: 'completed' },
  ];

  // 📈 REVENUE FORECASTING DATA
  const revenueForecasting = [
    { month: 'Jan 2025', forecast: 335000, actual: 0, confidence: 85 },
    { month: 'Feb 2025', forecast: 348000, actual: 0, confidence: 82 },
    { month: 'Mar 2025', forecast: 362000, actual: 0, confidence: 78 },
    { month: 'Apr 2025', forecast: 378000, actual: 0, confidence: 75 },
  ];

  // 🔮 CHURN PREDICTION DATA
  const churnPredictions = [
    { id: 3, name: 'Quick Cuts', plan: 'Basic', churnRisk: 92, reasons: ['Payment failures', 'Low usage', 'No auto-renew'], daysLeft: 12 },
    { id: 5, name: 'Nails Art Studio', plan: 'Basic', churnRisk: 68, reasons: ['Decreasing bookings', 'Support tickets'], daysLeft: 28 },
    { id: 9, name: 'Test Salon', plan: 'Standard', churnRisk: 54, reasons: ['Price concerns'], daysLeft: 45 },
  ];

  // 📧 EMAIL CAMPAIGNS DATA
  const emailCampaigns = [
    { id: 1, name: 'Upgrade to Business Promo', recipients: 67, sent: 67, opened: 42, clicked: 18, converted: 5, status: 'completed', date: '2024-12-15' },
    { id: 2, name: 'Trial Expiration Reminder', recipients: 23, sent: 23, opened: 19, clicked: 8, converted: 3, status: 'completed', date: '2024-12-20' },
    { id: 3, name: 'Payment Failed Follow-up', recipients: 12, sent: 8, opened: 5, clicked: 2, converted: 1, status: 'in_progress', date: '2024-12-22' },
  ];

  // 📊 BENCHMARKING DATA
  const benchmarkingData = {
    revenue: { industry: 8450, katia: 9234, percentile: 68 },
    bookings: { industry: 245, katia: 287, percentile: 72 },
    retention: { industry: 85, katia: 91, percentile: 78 },
    growth: { industry: 12, katia: 18, percentile: 82 },
  };

  // 🧪 A/B TESTING DATA
  const abTests = [
    {
      id: 1,
      name: 'Pricing Page - New Layout',
      status: 'running',
      startDate: '2024-12-01',
      variants: [
        { name: 'Control', visitors: 1245, conversions: 78, rate: 6.3 },
        { name: 'Variant A', visitors: 1312, conversions: 102, rate: 7.8 },
      ],
      winner: 'Variant A',
      confidence: 94,
    },
    {
      id: 2,
      name: 'Trial CTA Button Color',
      status: 'completed',
      startDate: '2024-11-15',
      endDate: '2024-12-15',
      variants: [
        { name: 'Purple', visitors: 2340, conversions: 145, rate: 6.2 },
        { name: 'Green', visitors: 2289, conversions: 189, rate: 8.3 },
      ],
      winner: 'Green',
      confidence: 98,
    },
    {
      id: 3,
      name: 'Email Subject Line Test',
      status: 'running',
      startDate: '2024-12-20',
      variants: [
        { name: 'Urgent', visitors: 456, conversions: 34, rate: 7.5 },
        { name: 'Benefit-focused', visitors: 478, conversions: 48, rate: 10.0 },
      ],
      winner: 'Benefit-focused',
      confidence: 87,
    },
  ];

  // 📋 KEYBOARD SHORTCUTS
  const keyboardShortcuts = [
    { key: 'Cmd+K', action: 'Open Command Palette', category: 'General' },
    { key: 'Cmd+F', action: 'Focus Search', category: 'Navigation' },
    { key: 'Cmd+N', action: 'New Notification', category: 'Actions' },
    { key: 'Cmd+E', action: 'Export Data', category: 'Actions' },
    { key: 'Cmd+B', action: 'Toggle Sidebar', category: 'Navigation' },
    { key: 'Cmd+/', action: 'Show Shortcuts', category: 'General' },
    { key: 'Esc', action: 'Close Modal/Panel', category: 'General' },
    { key: '/', action: 'Quick Search', category: 'Navigation' },
  ];

  // 🎯 COMMAND PALETTE COMMANDS
  const commands = [
    { id: 1, name: 'View Trial Salons', icon: '⏰', action: () => setShowTrialSection(true), category: 'Navigation' },
    { id: 2, name: 'Open Analytics', icon: '📊', action: () => setShowAnalytics(true), category: 'Navigation' },
    { id: 3, name: 'Churn Prediction', icon: '⚠️', action: () => setShowChurnPrediction(true), category: 'Navigation' },
    { id: 4, name: 'Email Campaigns', icon: '📧', action: () => setShowEmailCampaigns(true), category: 'Navigation' },
    { id: 5, name: 'Export Report', icon: '💾', action: () => setShowExportModal(true), category: 'Actions' },
    { id: 6, name: 'Toggle Live Updates', icon: '🟢', action: () => setLiveUpdates(!liveUpdates), category: 'Settings' },
    { id: 7, name: 'View Notifications', icon: '🔔', action: () => setShowNotifications(true), category: 'Navigation' },
    { id: 8, name: 'A/B Testing', icon: '🧪', action: () => setShowABTesting(true), category: 'Navigation' },
    { id: 9, name: 'Custom Reports', icon: '📋', action: () => setShowCustomReports(true), category: 'Navigation' },
    { id: 10, name: 'Benchmark Data', icon: '🏆', action: () => setShowSalonBenchmarking(true), category: 'Navigation' },
  ];

  // 🔴 REAL-TIME UPDATES EFFECT
  useEffect(() => {
    if (!liveUpdates) return;

    const interval = setInterval(() => {
      // Simulate real-time updates
      const randomEvent = Math.random();
      
      if (randomEvent > 0.8) {
        // New salon registered
        setRealtimeStats(prev => ({ ...prev, newSalons: prev.newSalons + 1 }));
        addNotification('✨ New salon registered: "Luxury Spa Dubai"', 'success');
      } else if (randomEvent > 0.6) {
        // Payment received
        setRealtimeStats(prev => ({ ...prev, newPayments: prev.newPayments + 1 }));
        addNotification('💰 Payment received: AED 299 from Glamour Studio', 'success');
      } else if (randomEvent > 0.4) {
        // Payment failed
        setRealtimeStats(prev => ({ ...prev, failedPayments: prev.failedPayments + 1 }));
        addNotification('⚠️ Payment failed: Quick Cuts - Card expired', 'warning');
      } else if (randomEvent > 0.2) {
        // Warning sent
        setRealtimeStats(prev => ({ ...prev, warnings: prev.warnings + 1 }));
        addNotification('📧 Warning sent to: Diamond Cuts - Policy violation', 'warning');
      }

      setLastUpdate(new Date());
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [liveUpdates]);

  const addNotification = (message: string, type: 'success' | 'warning' | 'error') => {
    const newNotif = {
      id: Date.now(),
      message,
      type,
      time: new Date().toLocaleTimeString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 20)); // Keep last 20
  };

  // ⌨️ KEYBOARD SHORTCUTS EFFECT
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K - Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      // Cmd+E - Export
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        setShowExportModal(true);
      }
      // Esc - Close modals
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowExportModal(false);
        setShowQuickActions(false);
      }
      // / - Quick search focus
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 🎯 HELPER FUNCTIONS
  const getAllSalons = () => {
    return [
      ...salonsByPlan.basic,
      ...salonsByPlan.standard,
      ...salonsByPlan.business,
    ];
  };

  const getFilteredSalons = (planId: string) => {
    let salons = salonsByPlan[planId as keyof typeof salonsByPlan] || [];

    // Filter by status
    if (filterStatus !== 'all') {
      salons = salons.filter((s) => s.status === filterStatus);
    }

    // Filter by billing period (NEW)
    if (billingPeriodFilter !== 'all') {
      salons = salons.filter((s) => s.billingPeriod === billingPeriodFilter);
    }

    // Filter by search query
    if (searchQuery) {
      salons = salons.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.phone.includes(searchQuery)
      );
    }

    // Filter by revenue
    if (revenueFilter === '0-1000') {
      salons = salons.filter((s) => s.revenue < 1000);
    } else if (revenueFilter === '1000-5000') {
      salons = salons.filter((s) => s.revenue >= 1000 && s.revenue < 5000);
    } else if (revenueFilter === '5000+') {
      salons = salons.filter((s) => s.revenue >= 5000);
    }

    // Filter by warnings
    if (warningsFilter === '0') {
      salons = salons.filter((s) => s.warnings === 0);
    } else if (warningsFilter === '1-2') {
      salons = salons.filter((s) => s.warnings >= 1 && s.warnings <= 2);
    } else if (warningsFilter === '3+') {
      salons = salons.filter((s) => s.warnings >= 3);
    }

    // Filter by auto-renew
    if (autoRenewFilter === 'enabled') {
      salons = salons.filter((s) => s.autoRenew === true);
    } else if (autoRenewFilter === 'disabled') {
      salons = salons.filter((s) => s.autoRenew === false);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      salons = salons.filter((s) =>
        selectedTags.some((tag) => s.tags.includes(tag))
      );
    }

    return salons;
  };

  const handleSelectAll = () => {
    if (!selectedPlan) return;
    const salons = getFilteredSalons(selectedPlan);
    if (selectedSalons.length === salons.length) {
      setSelectedSalons([]);
    } else {
      setSelectedSalons(salons.map((s) => s.id));
    }
  };

  const handleToggleSalon = (salonId: number) => {
    if (selectedSalons.includes(salonId)) {
      setSelectedSalons(selectedSalons.filter((id) => id !== salonId));
    } else {
      setSelectedSalons([...selectedSalons, salonId]);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedSalons.length === 0) {
      alert('Please select at least one salon');
      return;
    }
    alert(`Bulk action: ${action} for ${selectedSalons.length} salons`);
    setSelectedSalons([]);
    setShowBulkActions(false);
  };

  const exportToCSV = () => {
    if (selectedSalons.length === 0) {
      alert('Please select at least one salon to export');
      return;
    }
    alert(`Exporting ${selectedSalons.length} salons to CSV...`);
  };

  const calculateHealthScore = (salon: any) => {
    let score = 100;
    // Payment history (40%)
    const failedPayments = salon.paymentHistory?.filter((p: any) => p.status === 'failed').length || 0;
    score -= failedPayments * 10;
    // Warnings (20%)
    score -= salon.warnings * 15;
    // Usage (30%) - based on bookings
    if (salon.bookings < 50) score -= 20;
    else if (salon.bookings < 100) score -= 10;
    // Auto-renew (10%)
    if (!salon.autoRenew) score -= 10;
    return Math.max(0, Math.min(100, score));
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return '#10B981'; // green
    if (score >= 50) return '#F59E0B'; // orange
    return '#EF4444'; // red
  };

  return (
    <div className="space-y-8">
      {/* 🔝 HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-gray-900">Subscription Plans Management</h2>
            {/* 🔴 REAL-TIME INDICATOR */}
            {liveUpdates && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border-2 border-green-200 rounded-full animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-semibold text-green-700">LIVE</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-600">Manage salon subscriptions, analytics, and billing</p>
            {liveUpdates && (
              <span className="text-xs text-gray-500">
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          {/* 🔔 NOTIFICATIONS BUTTON */}
          <div className="relative">
            <Button
              variant="outline"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </Button>
            {/* NOTIFICATIONS DROPDOWN */}
            {showNotifications && (
              <Card className="absolute right-0 top-12 w-96 max-h-96 overflow-y-auto z-50 shadow-2xl border-2">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold">Real-Time Notifications</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setNotifications([])}
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">No notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-lg border ${
                            notif.type === 'success'
                              ? 'bg-green-50 border-green-200'
                              : notif.type === 'warning'
                              ? 'bg-orange-50 border-orange-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <p className="text-sm font-semibold">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* 🔴 LIVE UPDATES TOGGLE */}
          <Button
            variant={liveUpdates ? 'default' : 'outline'}
            className={liveUpdates ? 'bg-green-600 hover:bg-green-700' : ''}
            onClick={() => setLiveUpdates(!liveUpdates)}
          >
            <Activity className="w-4 h-4 mr-2" />
            {liveUpdates ? 'Live ON' : 'Live OFF'}
          </Button>

          {/* 📊 REAL-TIME STATS */}
          {liveUpdates && (
            <div className="flex gap-2">
              <Badge className="bg-blue-100 text-blue-700">
                +{realtimeStats.newSalons} salons
              </Badge>
              <Badge className="bg-green-100 text-green-700">
                +{realtimeStats.newPayments} payments
              </Badge>
              <Badge className="bg-red-100 text-red-700">
                {realtimeStats.failedPayments} failed
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* 🎯 ACTION BUTTONS */}
      <div className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={() => {
              setShowTrialSection(!showTrialSection);
              setShowAnalytics(false);
              setSelectedPlan(null);
            }}
          >
            <Clock className="w-4 h-4 mr-2" />
            Trial Salons ({trialSalons.length})
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowAnalytics(!showAnalytics);
              setShowTrialSection(false);
              setSelectedPlan(null);
            }}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" onClick={() => setShowComparison(!showComparison)}>
            <Target className="w-4 h-4 mr-2" />
            Compare Salons
          </Button>

          {/* 🎨 NEW FEATURES BUTTONS */}
          <Button variant="outline" onClick={() => setShowScheduledActions(!showScheduledActions)}>
            <Calendar className="w-4 h-4 mr-2" />
            Scheduled
          </Button>
          <Button variant="outline" onClick={() => setShowRevenueForecasting(!showRevenueForecasting)}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Forecast
          </Button>
          <Button variant="outline" onClick={() => setShowChurnPrediction(!showChurnPrediction)}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Churn Risk
          </Button>
          <Button variant="outline" onClick={() => setShowEmailCampaigns(!showEmailCampaigns)}>
            <Mail className="w-4 h-4 mr-2" />
            Campaigns
          </Button>
          <Button variant="outline" onClick={() => setShowSalonBenchmarking(!showSalonBenchmarking)}>
            <Award className="w-4 h-4 mr-2" />
            Benchmark
          </Button>

          {/* 🚀 NEW ADVANCED FEATURES */}
          <Button variant="outline" onClick={() => setShowABTesting(!showABTesting)}>
            <Zap className="w-4 h-4 mr-2" />
            A/B Tests
          </Button>
          <Button variant="outline" onClick={() => setShowCustomReports(!showCustomReports)}>
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowCommandPalette(true)}
            className="border-2 border-purple-200"
          >
            <Search className="w-4 h-4 mr-2" />
            Cmd+K
          </Button>

          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            onClick={() => setShowExportModal(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
      </div>

      {/* ⌨️ COMMAND PALETTE */}
      {showCommandPalette && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
          onClick={() => setShowCommandPalette(false)}
        >
          <Card className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Type a command or search..."
                  className="pl-10 text-lg"
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {commands
                  .filter((cmd) =>
                    cmd.name.toLowerCase().includes(commandSearch.toLowerCase())
                  )
                  .map((cmd) => (
                    <div
                      key={cmd.id}
                      className="p-3 hover:bg-purple-50 rounded-lg cursor-pointer flex items-center gap-3 transition-all"
                      onClick={() => {
                        cmd.action();
                        setShowCommandPalette(false);
                        setCommandSearch('');
                      }}
                    >
                      <span className="text-2xl">{cmd.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{cmd.name}</p>
                        <p className="text-xs text-gray-500">{cmd.category}</p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-gray-500">
                <span>Press ESC to close</span>
                <span>⌨️ Keyboard Shortcuts Available</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 💾 ADVANCED EXPORT MODAL */}
      {showExportModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowExportModal(false)}
        >
          <Card className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Export Data</h3>
                <Button variant="outline" onClick={() => setShowExportModal(false)}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* FORMAT SELECTION */}
                <div>
                  <h4 className="font-bold mb-3">Select Format:</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 border-2 border-green-200 bg-green-50 cursor-pointer hover:shadow-lg transition-all">
                      <FileText className="w-8 h-8 text-green-600 mb-2" />
                      <p className="font-bold">Excel</p>
                      <p className="text-xs text-gray-600">Full data with charts</p>
                    </Card>
                    <Card className="p-4 border-2 border-red-200 bg-red-50 cursor-pointer hover:shadow-lg transition-all">
                      <FileText className="w-8 h-8 text-red-600 mb-2" />
                      <p className="font-bold">PDF</p>
                      <p className="text-xs text-gray-600">Professional report</p>
                    </Card>
                    <Card className="p-4 border-2 border-blue-200 bg-blue-50 cursor-pointer hover:shadow-lg transition-all">
                      <FileText className="w-8 h-8 text-blue-600 mb-2" />
                      <p className="font-bold">CSV</p>
                      <p className="text-xs text-gray-600">Raw data only</p>
                    </Card>
                  </div>
                </div>

                {/* DATA SELECTION */}
                <div>
                  <h4 className="font-bold mb-3">Select Data:</h4>
                  <div className="space-y-2">
                    {['All Salons', 'Selected Salons Only', 'Trial Salons', 'Active Salons', 'Overdue Salons', 'Payment History', 'Analytics Data', 'Email Campaigns'].map((option) => (
                      <div key={option} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                        <input type="checkbox" className="w-4 h-4" defaultChecked={option === 'All Salons'} />
                        <label className="text-sm">{option}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DATE RANGE */}
                <div>
                  <h4 className="font-bold mb-3">Date Range:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">From:</label>
                      <Input type="date" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">To:</label>
                      <Input type="date" className="mt-1" />
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    Export Now
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Export
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 🆓 TRIAL SALONS SECTION */}
      {showTrialSection && (
        <div className="space-y-6">
          <Card className="p-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-bold">Trial Salons Management</h3>
                  <p className="text-gray-600">
                    {trialSalons.length} salons on trial • Convert to paid plans
                  </p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Send Bulk Nudge Email
              </Button>
            </div>

            {/* TRIAL STATS */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="p-4 border-2 border-green-100 bg-green-50">
                <p className="text-sm text-gray-600 mb-1">Avg Conversion Probability</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round(
                    trialSalons.reduce((acc, s) => acc + s.conversionProbability, 0) /
                      trialSalons.length
                  )}
                  %
                </p>
              </Card>
              <Card className="p-4 border-2 border-purple-100 bg-purple-50">
                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-purple-600">
                  {trialSalons.reduce((acc, s) => acc + s.bookings, 0)}
                </p>
              </Card>
              <Card className="p-4 border-2 border-orange-100 bg-orange-50">
                <p className="text-sm text-gray-600 mb-1">Expiring Soon (≤3 days)</p>
                <p className="text-3xl font-bold text-orange-600">
                  {trialSalons.filter((s) => s.daysLeft <= 3).length}
                </p>
              </Card>
              <Card className="p-4 border-2 border-blue-100 bg-blue-50">
                <p className="text-sm text-gray-600 mb-1">High Conversion (≥80%)</p>
                <p className="text-3xl font-bold text-blue-600">
                  {trialSalons.filter((s) => s.conversionProbability >= 80).length}
                </p>
              </Card>
            </div>

            {/* TRIAL SALONS LIST */}
            <div className="space-y-4">
              {trialSalons.map((salon) => (
                <div
                  key={salon.id}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    salon.daysLeft <= 3
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-xl font-bold">{salon.name}</h4>
                        <Badge
                          className={
                            salon.daysLeft <= 3
                              ? 'bg-orange-600 text-white'
                              : 'bg-blue-600 text-white'
                          }
                        >
                          {salon.daysLeft} days left
                        </Badge>
                        <Badge
                          style={{
                            backgroundColor:
                              salon.conversionProbability >= 80
                                ? '#10B981'
                                : salon.conversionProbability >= 60
                                ? '#F59E0B'
                                : '#EF4444',
                            color: 'white',
                          }}
                        >
                          {salon.conversionProbability}% conversion
                        </Badge>
                      </div>

                      <div className="grid grid-cols-5 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-gray-500">Owner</p>
                          <p className="font-semibold">{salon.owner}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="font-semibold">{salon.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Bookings</p>
                          <p className="font-bold text-purple-600">{salon.bookings}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Activity Score</p>
                          <p className="font-bold text-blue-600">{salon.activity}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Registered</p>
                          <p className="font-semibold">{salon.registered}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                            style={{ width: `${salon.activity}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {salon.activity}% active
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Convert to Paid
                      </Button>
                      <Button variant="outline">
                        <Send className="w-4 h-4 mr-1" />
                        Send Nudge
                      </Button>
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 📊 ANALYTICS DASHBOARD */}
      {showAnalytics && (
        <div className="space-y-6">
          <Card className="p-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <h3 className="text-2xl font-bold mb-6">Analytics Dashboard</h3>

            {/* REVENUE TREND */}
            <div className="mb-8">
              <h4 className="text-lg font-bold mb-4">Revenue Trend by Plan</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="basic"
                    stackId="1"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    name="Basic"
                  />
                  <Area
                    type="monotone"
                    dataKey="standard"
                    stackId="1"
                    stroke="#EC4899"
                    fill="#EC4899"
                    name="Standard"
                  />
                  <Area
                    type="monotone"
                    dataKey="business"
                    stackId="1"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    name="Business"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* CONVERSION FUNNEL & UPGRADE/DOWNGRADE */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold mb-4">Conversion Funnel</h4>
                <div className="space-y-3">
                  {conversionFunnelData.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-sm font-bold">{item.value}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="h-4 rounded-full"
                          style={{
                            width: `${(item.value / 230) * 100}%`,
                            backgroundColor: item.fill,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4">Upgrade vs Downgrade Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={upgradeDowngradeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="upgrades" fill="#10B981" name="Upgrades" />
                    <Bar dataKey="downgrades" fill="#EF4444" name="Downgrades" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PLAN STATS */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className="p-5 border-2 border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${plan.color}20` }}
                    >
                      <Package className="w-6 h-6" style={{ color: plan.color }} />
                    </div>
                    <div>
                      <h5 className="font-bold">{plan.name}</h5>
                      <p className="text-sm text-gray-600">{plan.salons} salons</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Churn Rate:</span>
                      <span className="font-bold text-red-600">{plan.churnRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Lifetime:</span>
                      <span className="font-bold">{plan.avgLifetime} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conversion:</span>
                      <span className="font-bold text-green-600">{plan.conversionRate}%</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 📅 SCHEDULED ACTIONS */}
      {showScheduledActions && (
        <Card className="p-6 border-2 border-blue-200 bg-blue-50/30">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-blue-600" />
            Scheduled Actions
          </h3>
          <div className="space-y-3">
            {scheduledActions.map((action) => (
              <Card key={action.id} className={`p-5 border-2 ${action.status === 'completed' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={action.status === 'completed' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}>
                        {action.status.toUpperCase()}
                      </Badge>
                      <span className="font-bold text-lg">{action.action}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>🏢 {action.salon}</span>
                      <span>📅 {action.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {action.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                          <XCircle className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* 📈 REVENUE FORECASTING */}
      {showRevenueForecasting && (
        <Card className="p-6 border-2 border-purple-200 bg-purple-50/30">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-purple-600" />
            Revenue Forecasting (Next 4 Months)
          </h3>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {revenueForecasting.map((item, idx) => (
              <Card key={idx} className="p-5 border-2 border-purple-100 bg-white">
                <p className="text-sm text-gray-600 mb-2">{item.month}</p>
                <p className="text-3xl font-bold text-purple-600 mb-2">AED {(item.forecast / 1000).toFixed(0)}K</p>
                <Badge className={`${item.confidence >= 80 ? 'bg-green-600' : item.confidence >= 70 ? 'bg-orange-600' : 'bg-gray-600'} text-white`}>
                  {item.confidence}% confidence
                </Badge>
              </Card>
            ))}
          </div>
          <div className="p-5 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-2">💡 Insights:</p>
            <ul className="text-sm space-y-1 text-blue-800">
              <li>• Expected growth: +8.3% MoM (based on last 6 months trend)</li>
              <li>• Predicted new salons: ~45 per month</li>
              <li>• Upgrade rate: 12% (Standard → Business)</li>
            </ul>
          </div>
        </Card>
      )}

      {/* 🔮 CHURN PREDICTION */}
      {showChurnPrediction && (
        <Card className="p-6 border-2 border-red-200 bg-red-50/30">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-red-600" />
            Churn Risk Prediction
          </h3>
          <div className="space-y-4">
            {churnPredictions.map((salon) => (
              <Card key={salon.id} className="p-5 border-2 border-red-200 bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-xl font-bold">{salon.name}</h4>
                      <Badge className="bg-purple-100 text-purple-700">{salon.plan}</Badge>
                      <Badge className={`${salon.churnRisk >= 80 ? 'bg-red-600' : salon.churnRisk >= 60 ? 'bg-orange-600' : 'bg-yellow-600'} text-white`}>
                        {salon.churnRisk}% Churn Risk
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Risk Factors:</p>
                      <div className="flex flex-wrap gap-2">
                        {salon.reasons.map((reason, idx) => (
                          <Badge key={idx} className="bg-gray-100 text-gray-700">{reason}</Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">⏰ Estimated cancellation in: {salon.daysLeft} days</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-3 h-3 mr-1" />
                      Send Retention Offer
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="w-3 h-3 mr-1" />
                      Call Owner
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* 📧 EMAIL CAMPAIGNS */}
      {showEmailCampaigns && (
        <Card className="p-6 border-2 border-green-200 bg-green-50/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-7 h-7 text-green-600" />
              Email Marketing Campaigns
            </h3>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
          <div className="space-y-4">
            {emailCampaigns.map((campaign) => (
              <Card key={campaign.id} className="p-5 border-2 border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold">{campaign.name}</h4>
                      <Badge className={campaign.status === 'completed' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}>
                        {campaign.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">📅 {campaign.date}</p>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4">
                  <Card className="p-3 border border-gray-200 bg-gray-50 text-center">
                    <p className="text-xs text-gray-600 mb-1">Recipients</p>
                    <p className="text-xl font-bold">{campaign.recipients}</p>
                  </Card>
                  <Card className="p-3 border border-blue-200 bg-blue-50 text-center">
                    <p className="text-xs text-gray-600 mb-1">Sent</p>
                    <p className="text-xl font-bold text-blue-600">{campaign.sent}</p>
                  </Card>
                  <Card className="p-3 border border-green-200 bg-green-50 text-center">
                    <p className="text-xs text-gray-600 mb-1">Opened</p>
                    <p className="text-xl font-bold text-green-600">{campaign.opened}</p>
                    <p className="text-xs text-green-600">{((campaign.opened / campaign.sent) * 100).toFixed(0)}%</p>
                  </Card>
                  <Card className="p-3 border border-purple-200 bg-purple-50 text-center">
                    <p className="text-xs text-gray-600 mb-1">Clicked</p>
                    <p className="text-xl font-bold text-purple-600">{campaign.clicked}</p>
                    <p className="text-xs text-purple-600">{((campaign.clicked / campaign.sent) * 100).toFixed(0)}%</p>
                  </Card>
                  <Card className="p-3 border border-orange-200 bg-orange-50 text-center">
                    <p className="text-xs text-gray-600 mb-1">Converted</p>
                    <p className="text-xl font-bold text-orange-600">{campaign.converted}</p>
                    <p className="text-xs text-orange-600">{((campaign.converted / campaign.sent) * 100).toFixed(0)}%</p>
                  </Card>
                  <div className="flex items-center justify-center">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* 📊 SALON BENCHMARKING */}
      {showSalonBenchmarking && (
        <Card className="p-6 border-2 border-yellow-200 bg-yellow-50/30">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-7 h-7 text-yellow-600" />
            Salon Industry Benchmarking
          </h3>
          <div className="grid grid-cols-4 gap-6">
            {Object.entries(benchmarkingData).map(([key, data]) => (
              <Card key={key} className="p-5 border-2 border-gray-200 bg-white">
                <h4 className="font-bold text-lg mb-4 capitalize">{key}</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Industry Average</p>
                    <p className="text-2xl font-bold text-gray-600">{data.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Katia Platform</p>
                    <p className="text-2xl font-bold text-purple-600">{data.katia}</p>
                  </div>
                  <div>
                    <Badge className={data.percentile >= 70 ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'}>
                      Top {data.percentile}%
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6 p-5 bg-green-50 rounded-lg border-2 border-green-200">
            <p className="font-bold text-green-900 mb-2">🏆 Performance Summary:</p>
            <p className="text-sm text-green-800">
              Katia platform salons perform <strong>18% better</strong> than industry average across all key metrics!
            </p>
          </div>
        </Card>
      )}

      {/* 🧪 A/B TESTING DASHBOARD */}
      {showABTesting && (
        <Card className="p-6 border-2 border-indigo-200 bg-indigo-50/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="w-7 h-7 text-indigo-600" />
              A/B Testing Dashboard
            </h3>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              New Test
            </Button>
          </div>

          <div className="space-y-6">
            {abTests.map((test) => (
              <Card key={test.id} className={`p-6 border-2 ${test.status === 'running' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold">{test.name}</h4>
                      <Badge className={test.status === 'running' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}>
                        {test.status.toUpperCase()}
                      </Badge>
                      {test.confidence >= 95 && (
                        <Badge className="bg-purple-600 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          {test.confidence}% Confident
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Started: {test.startDate} {test.endDate && `• Ended: ${test.endDate}`}
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-4 mb-4">
                  {test.variants.map((variant, idx) => (
                    <Card
                      key={idx}
                      className={`p-5 border-2 ${
                        variant.name === test.winner
                          ? 'border-green-300 bg-green-100'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-lg">{variant.name}</h5>
                        {variant.name === test.winner && (
                          <Crown className="w-6 h-6 text-yellow-500" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Visitors:</span>
                          <span className="font-bold">{variant.visitors.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Conversions:</span>
                          <span className="font-bold">{variant.conversions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Rate:</span>
                          <span className={`font-bold text-lg ${variant.name === test.winner ? 'text-green-600' : 'text-gray-700'}`}>
                            {variant.rate}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${variant.name === test.winner ? 'bg-green-600' : 'bg-gray-500'}`}
                          style={{ width: `${variant.rate * 10}%` }}
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                {test.status === 'running' ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
                      <XCircle className="w-3 h-3 mr-1" />
                      Stop Test
                    </Button>
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                      <Check className="w-3 h-3 mr-1" />
                      Declare Winner
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-lg border-2 border-green-200">
                    <p className="text-sm font-semibold text-green-900">
                      🏆 Winner: {test.winner} with {test.confidence}% confidence
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* 📋 CUSTOM REPORTS BUILDER */}
      {showCustomReports && (
        <Card className="p-6 border-2 border-cyan-200 bg-cyan-50/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-7 h-7 text-cyan-600" />
              Custom Reports Builder
            </h3>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Report
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* SAVED REPORTS */}
            <div>
              <h4 className="font-bold mb-4">Saved Reports</h4>
              <div className="space-y-3">
                {['Monthly Revenue Summary', 'Trial Conversion Analysis', 'Churn Risk Report', 'Payment Failures Log'].map((report, idx) => (
                  <Card key={idx} className="p-4 border-2 border-gray-200 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cyan-600" />
                        <div>
                          <p className="font-semibold">{report}</p>
                          <p className="text-xs text-gray-500">Last generated: 2 days ago</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* REPORT BUILDER */}
            <div>
              <h4 className="font-bold mb-4">Quick Report Builder</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Metrics:</label>
                  <div className="space-y-2">
                    {['Revenue', 'Salons Count', 'Bookings', 'Churn Rate', 'MRR', 'ARR'].map((metric) => (
                      <div key={metric} className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" />
                        <label className="text-sm">{metric}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Time Period:</label>
                  <select className="w-full p-2 border-2 border-gray-200 rounded-lg">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                    <option>Custom range</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Group By:</label>
                  <select className="w-full p-2 border-2 border-gray-200 rounded-lg">
                    <option>Plan Type</option>
                    <option>Registration Date</option>
                    <option>Revenue Range</option>
                    <option>Status</option>
                  </select>
                </div>

                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 💎 SUBSCRIPTION PLANS CARDS - MAIN VIEW */}
      {!selectedPlan && !showTrialSection && !showAnalytics && !showScheduledActions && !showRevenueForecasting && !showChurnPrediction && !showEmailCampaigns && !showSalonBenchmarking && !showABTesting && !showCustomReports && (
        <>
          <div className="grid lg:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.id}
                className="p-4 border-2 border-gray-200 hover:shadow-lg transition-all cursor-pointer hover:border-purple-300"
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className={`h-1 rounded-t-xl bg-gradient-to-r ${plan.gradient} mb-3`} />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                      <Package className="w-6 h-6" style={{ color: plan.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      <p className="text-xs text-gray-500">{plan.nameEn}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold" style={{ color: plan.color }}>
                        {plan.price}
                      </span>
                      <span className="text-xs text-gray-500">AED/mo</span>
                    </div>
                    <Badge className="text-xs mt-1" style={{ backgroundColor: plan.color, color: 'white' }}>
                      {plan.salons} Salons
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-xs text-gray-600">MRR</p>
                    <p className="font-bold text-sm text-green-600">AED {(plan.mrr / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <p className="text-xs text-gray-600">Churn</p>
                    <p className="font-bold text-sm text-red-600">{plan.churnRate}%</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <p className="text-xs text-gray-600">Lifetime</p>
                    <p className="font-bold text-sm text-purple-600">{plan.avgLifetime}m</p>
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                      <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full h-8 text-sm" style={{ backgroundColor: plan.color }}>
                  View Details <ChevronRight className="w-3 h-3 ml-1" />
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

          {/* 📅 BILLING PERIOD BREAKDOWN */}
          <Card className="p-6 border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center gap-3 mb-6">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Billing Period Breakdown
              </h3>
              <Badge className="bg-purple-600 text-white">Payment Cycles</Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              {/* Monthly Subscriptions */}
              <Card className="p-5 border-2 border-blue-200 bg-blue-50/50 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                    📅
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Monthly</p>
                    <p className="text-xs text-gray-500">1 Month Cycle</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Basic:</span>
                    <span className="font-bold text-blue-600">
                      {salonsByPlan.basic.filter(s => s.billingPeriod === 'monthly').length} salons
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Standard:</span>
                    <span className="font-bold text-blue-600">
                      {salonsByPlan.standard.filter(s => s.billingPeriod === 'monthly').length} salons
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Business:</span>
                    <span className="font-bold text-blue-600">
                      {salonsByPlan.business.filter(s => s.billingPeriod === 'monthly').length} salons
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700">Total:</span>
                      <span className="font-bold text-2xl text-blue-600">
                        {[...salonsByPlan.basic, ...salonsByPlan.standard, ...salonsByPlan.business]
                          .filter(s => s.billingPeriod === 'monthly').length}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 6-Month Subscriptions */}
              <Card className="p-5 border-2 border-purple-200 bg-purple-50/50 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                    📆
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Semi-Annual</p>
                    <p className="text-xs text-gray-500">6 Months Cycle</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Basic:</span>
                    <span className="font-bold text-purple-600">
                      {salonsByPlan.basic.filter(s => s.billingPeriod === 'semi-annual').length} salons
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Standard:</span>
                    <span className="font-bold text-purple-600">
                      {salonsByPlan.standard.filter(s => s.billingPeriod === 'semi-annual').length} salons
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Business:</span>
                    <span className="font-bold text-purple-600">
                      {salonsByPlan.business.filter(s => s.billingPeriod === 'semi-annual').length} salons
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-purple-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700">Total:</span>
                      <span className="font-bold text-2xl text-purple-600">
                        {[...salonsByPlan.basic, ...salonsByPlan.standard, ...salonsByPlan.business]
                          .filter(s => s.billingPeriod === 'semi-annual').length}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Annual Subscriptions */}
              <Card className="p-5 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center text-2xl">
                    🗓️
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Annual</p>
                    <p className="text-xs text-gray-500">1 Year Cycle</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Basic:</span>
                    <span className="font-bold text-amber-600">
                      {salonsByPlan.basic.filter(s => s.billingPeriod === 'annual').length} salons
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Standard:</span>
                    <span className="font-bold text-amber-600">
                      {salonsByPlan.standard.filter(s => s.billingPeriod === 'annual').length} salons
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Business:</span>
                    <span className="font-bold text-amber-600">
                      {salonsByPlan.business.filter(s => s.billingPeriod === 'annual').length} salons
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-amber-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700">Total:</span>
                      <span className="font-bold text-2xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {[...salonsByPlan.basic, ...salonsByPlan.standard, ...salonsByPlan.business]
                          .filter(s => s.billingPeriod === 'annual').length}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Revenue breakdown by period */}
            <div className="mt-6 p-4 bg-white rounded-xl border-2 border-purple-200">
              <h4 className="font-bold text-gray-700 mb-3">💰 Revenue Breakdown by Period</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Revenue:</span>
                  <span className="font-bold text-blue-600">
                    AED {[...salonsByPlan.basic, ...salonsByPlan.standard, ...salonsByPlan.business]
                      .filter(s => s.billingPeriod === 'monthly')
                      .reduce((sum, s) => sum + s.revenue, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">6-Month Revenue:</span>
                  <span className="font-bold text-purple-600">
                    AED {[...salonsByPlan.basic, ...salonsByPlan.standard, ...salonsByPlan.business]
                      .filter(s => s.billingPeriod === 'semi-annual')
                      .reduce((sum, s) => sum + s.revenue, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Revenue:</span>
                  <span className="font-bold text-amber-600">
                    AED {[...salonsByPlan.basic, ...salonsByPlan.standard, ...salonsByPlan.business]
                      .filter(s => s.billingPeriod === 'annual')
                      .reduce((sum, s) => sum + s.revenue, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

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

          {/* ⚙️ AUTO-ACTIONS SETTINGS */}
          <Card className="p-6 border-2 border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-purple-600" />
              <h3 className="text-2xl font-bold">Auto-Actions Settings</h3>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              {autoActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <span className="font-semibold">{action.name}</span>
                  <Button
                    size="sm"
                    variant={action.enabled ? 'default' : 'outline'}
                    className={action.enabled ? 'bg-green-600' : ''}
                  >
                    {action.enabled ? 'Enabled ✓' : 'Disabled'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* 🏢 SALONS LIST BY SELECTED PLAN */}
      {selectedPlan && !showTrialSection && !showAnalytics && !showScheduledActions && !showRevenueForecasting && !showChurnPrediction && !showEmailCampaigns && !showSalonBenchmarking && !showABTesting && !showCustomReports && (
        <div className="space-y-6">
          {/* HEADER & FILTERS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPlan(null);
                  setSelectedSalons([]);
                }}
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Plans
              </Button>
              <div>
                <h3 className="text-2xl font-bold">
                  {subscriptionPlans.find((p) => p.id === selectedPlan)?.name} Plan Salons
                </h3>
                <p className="text-gray-600">
                  {getFilteredSalons(selectedPlan).length} salons{' '}
                  {selectedSalons.length > 0 && `(${selectedSalons.length} selected)`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {selectedSalons.length > 0 && (
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowBulkActions(!showBulkActions)}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Bulk Actions ({selectedSalons.length})
                </Button>
              )}
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* BULK ACTIONS PANEL */}
          {showBulkActions && selectedSalons.length > 0 && (
            <Card className="p-6 border-2 border-purple-200 bg-purple-50">
              <h4 className="font-bold text-lg mb-4">Bulk Actions ({selectedSalons.length} salons selected)</h4>
              <div className="grid grid-cols-6 gap-3">
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => handleBulkAction('Send Warning')}
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Send Warning
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => handleBulkAction('Block')}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Block All
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleBulkAction('Upgrade')}
                >
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  Upgrade Plan
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleBulkAction('Send Email')}
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Send Email
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('Add Tag')}
                >
                  <Tag className="w-4 h-4 mr-1" />
                  Add Tag
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportToCSV}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export Selected
                </Button>
              </div>
            </Card>
          )}

          {/* SEARCH & ADVANCED FILTERS */}
          <Card className="p-6 border-2 border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by name, email, phone, owner..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            {/* FILTER CHIPS */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-600">Status:</span>
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

              <div className="h-6 w-px bg-gray-300" />

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-600">Revenue:</span>
                {['all', '0-1000', '1000-5000', '5000+'].map((range) => (
                  <Button
                    key={range}
                    size="sm"
                    variant={revenueFilter === range ? 'default' : 'outline'}
                    onClick={() => setRevenueFilter(range)}
                    className={revenueFilter === range ? 'bg-green-600' : ''}
                  >
                    {range === 'all' ? 'All' : `AED ${range}`}
                  </Button>
                ))}
              </div>

              <div className="h-6 w-px bg-gray-300" />

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-600">Warnings:</span>
                {['all', '0', '1-2', '3+'].map((count) => (
                  <Button
                    key={count}
                    size="sm"
                    variant={warningsFilter === count ? 'default' : 'outline'}
                    onClick={() => setWarningsFilter(count)}
                    className={warningsFilter === count ? 'bg-orange-600' : ''}
                  >
                    {count === 'all' ? 'All' : count}
                  </Button>
                ))}
              </div>

              <div className="h-6 w-px bg-gray-300" />

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-600">Auto-Renew:</span>
                {['all', 'enabled', 'disabled'].map((renew) => (
                  <Button
                    key={renew}
                    size="sm"
                    variant={autoRenewFilter === renew ? 'default' : 'outline'}
                    onClick={() => setAutoRenewFilter(renew)}
                    className={autoRenewFilter === renew ? 'bg-blue-600' : ''}
                  >
                    {renew.charAt(0).toUpperCase() + renew.slice(1)}
                  </Button>
                ))}
              </div>

              <div className="h-6 w-px bg-gray-300" />

              {/* NEW: BILLING PERIOD FILTER */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-600">Period:</span>
                {[
                  { value: 'all', label: 'All' },
                  { value: 'monthly', label: '1 Month', icon: '📅' },
                  { value: 'semi-annual', label: '6 Months', icon: '📆' },
                  { value: 'annual', label: '1 Year', icon: '🗓️' }
                ].map((period) => (
                  <Button
                    key={period.value}
                    size="sm"
                    variant={billingPeriodFilter === period.value ? 'default' : 'outline'}
                    onClick={() => setBillingPeriodFilter(period.value)}
                    className={billingPeriodFilter === period.value ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                  >
                    {period.icon && <span className="mr-1">{period.icon}</span>}
                    {period.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* TAGS FILTER */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-600">Filter by Tags:</span>
              {availableTags.map((tag) => (
                <Button
                  key={tag.name}
                  size="sm"
                  variant={selectedTags.includes(tag.name) ? 'default' : 'outline'}
                  onClick={() => {
                    if (selectedTags.includes(tag.name)) {
                      setSelectedTags(selectedTags.filter((t) => t !== tag.name));
                    } else {
                      setSelectedTags([...selectedTags, tag.name]);
                    }
                  }}
                  style={
                    selectedTags.includes(tag.name)
                      ? { backgroundColor: tag.color, color: 'white' }
                      : {}
                  }
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.name}
                </Button>
              ))}
            </div>
          </Card>

          {/* SALONS TABLE */}
          <Card className="p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-lg">
                {getFilteredSalons(selectedPlan).length} Salons Found
              </h4>
              <Button size="sm" variant="outline" onClick={handleSelectAll}>
                <Check className="w-4 h-4 mr-1" />
                {selectedSalons.length === getFilteredSalons(selectedPlan).length
                  ? 'Deselect All'
                  : 'Select All'}
              </Button>
            </div>

            <div className="space-y-4">
              {getFilteredSalons(selectedPlan).map((salon) => {
                const healthScore = salon.healthScore || calculateHealthScore(salon);
                const healthColor = getHealthColor(healthScore);

                return (
                  <div
                    key={salon.id}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      selectedSalons.includes(salon.id)
                        ? 'border-purple-400 bg-purple-50'
                        : salon.status === 'blocked'
                        ? 'bg-red-50 border-red-200'
                        : salon.status === 'overdue'
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-white border-gray-100 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start">
                      {/* CHECKBOX */}
                      <input
                        type="checkbox"
                        checked={selectedSalons.includes(salon.id)}
                        onChange={() => handleToggleSalon(salon.id)}
                        className="mt-1 mr-4 w-5 h-5 rounded border-gray-300 cursor-pointer"
                      />

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
                          {/* HEALTH SCORE */}
                          <Badge style={{ backgroundColor: healthColor, color: 'white' }}>
                            <Activity className="w-3 h-3 mr-1" />
                            Health: {healthScore}/100
                          </Badge>
                          {/* TAGS */}
                          {salon.tags &&
                            salon.tags.map((tagName: string) => {
                              const tag = availableTags.find((t) => t.name === tagName);
                              return (
                                <Badge
                                  key={tagName}
                                  style={{ backgroundColor: tag?.color, color: 'white' }}
                                >
                                  {tagName}
                                </Badge>
                              );
                            })}
                        </div>

                        <div className="grid grid-cols-5 gap-4 text-sm mb-3">
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

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Registered</p>
                            <p className="font-semibold">{salon.registered}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Next Payment</p>
                            <p className="font-semibold">{salon.nextPayment || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Billing Period</p>
                            <Badge className={
                              salon.billingPeriod === 'monthly' 
                                ? 'bg-blue-100 text-blue-700' 
                                : salon.billingPeriod === 'semi-annual'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700'
                            }>
                              {salon.billingPeriod === 'monthly' && '📅 1 Month'}
                              {salon.billingPeriod === 'semi-annual' && '📆 6 Months'}
                              {salon.billingPeriod === 'annual' && '🗓️ 1 Year'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
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
                              onClick={() => alert(`Send warning to ${salon.name}`)}
                            >
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              Send Warning
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600"
                              onClick={() => {
                                if (confirm(`Block ${salon.name}?`)) {
                                  alert(`Salon ${salon.name} blocked`);
                                }
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Block
                            </Button>
                          </>
                        )}
                        {salon.status === 'blocked' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              if (confirm(`Unblock ${salon.name}?`)) {
                                alert(`Salon ${salon.name} unblocked`);
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
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* 🔥 SALON DETAILS MODAL WITH TABS */}
      {showSalonModal && selectedSalon && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowSalonModal(false)}
        >
          <Card
            className="w-full max-w-6xl my-8"
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
                    <Badge
                      style={{
                        backgroundColor: getHealthColor(selectedSalon.healthScore || calculateHealthScore(selectedSalon)),
                        color: 'white',
                      }}
                    >
                      Health: {selectedSalon.healthScore || calculateHealthScore(selectedSalon)}/100
                    </Badge>
                  </div>
                  <p className="text-gray-600">Salon ID: #{selectedSalon.id}</p>
                </div>
                <Button variant="outline" onClick={() => setShowSalonModal(false)}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              {/* TABS */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="payments">Payment History</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="notes">Notes & Tags</TabsTrigger>
                  <TabsTrigger value="communications">Communications</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>

                {/* TAB 1: DETAILS */}
                <TabsContent value="details" className="space-y-6 mt-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg border-b pb-2">Contact Information</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Owner Name</p>
                          <p className="font-semibold">{selectedSalon.owner}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{selectedSalon.email}</p>
                            <Button size="sm" variant="ghost">
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{selectedSalon.phone}</p>
                            <Button size="sm" variant="ghost">
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-lg border-b pb-2">Subscription Details</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Current Plan</p>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-purple-600">
                              {subscriptionPlans.find((p) => p.id === selectedPlan)?.name} (AED{' '}
                              {subscriptionPlans.find((p) => p.id === selectedPlan)?.price}/mo)
                            </p>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <ArrowUpRight className="w-3 h-3 mr-1" />
                              Upgrade
                            </Button>
                          </div>
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
                          <p className="text-sm text-gray-500">Billing Period</p>
                          <Badge className={
                            selectedSalon.billingPeriod === 'monthly' 
                              ? 'bg-blue-100 text-blue-700' 
                              : selectedSalon.billingPeriod === 'semi-annual'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700'
                          }>
                            {selectedSalon.billingPeriod === 'monthly' && '📅 Monthly (1 Month)'}
                            {selectedSalon.billingPeriod === 'semi-annual' && '📆 Semi-Annual (6 Months)'}
                            {selectedSalon.billingPeriod === 'annual' && '🗓️ Annual (1 Year)'}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Auto-Renew</p>
                          <Badge
                            className={
                              selectedSalon.autoRenew
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }
                          >
                            {selectedSalon.autoRenew ? 'Enabled ✓' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STATS CARDS */}
                  <div className="grid grid-cols-3 gap-4">
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

                  {/* UPGRADE/DOWNGRADE SECTION */}
                  <Card className="p-6 border-2 border-blue-100 bg-blue-50/30">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Upgrade / Downgrade Plan
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {subscriptionPlans.map((plan) => (
                        <Card
                          key={plan.id}
                          className={`p-4 border-2 cursor-pointer transition-all ${
                            plan.id === selectedPlan
                              ? 'border-purple-400 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-200'
                          }`}
                        >
                          <h5 className="font-bold mb-2">{plan.name}</h5>
                          <p className="text-2xl font-bold mb-2" style={{ color: plan.color }}>
                            AED {plan.price}
                          </p>
                          {plan.id === selectedPlan ? (
                            <Badge className="bg-purple-600 text-white w-full">Current Plan</Badge>
                          ) : (
                            <Button
                              size="sm"
                              className="w-full"
                              style={{ backgroundColor: plan.color }}
                              onClick={() => alert(`Upgrade to ${plan.name} plan`)}
                            >
                              {parseInt(plan.price.toString()) >
                              parseInt(
                                subscriptionPlans.find((p) => p.id === selectedPlan)?.price.toString() || '0'
                              )
                                ? 'Upgrade'
                                : 'Downgrade'}
                            </Button>
                          )}
                        </Card>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg border">
                      <p className="text-sm text-gray-600 mb-2">💡 Special Offers:</p>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-purple-600" />
                          <span>Upgrade to Business: Get 20% off first 3 months</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-purple-600" />
                          <span>Annual payment: Save 15%</span>
                        </li>
                      </ul>
                    </div>
                  </Card>

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
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => {
                        setRefundSalon(selectedSalon);
                        setShowRefundModal(true);
                      }}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Request Refund
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
                  </div>
                </TabsContent>

                {/* TAB 2: PAYMENT HISTORY */}
                <TabsContent value="payments" className="space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">Payment History</h4>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {selectedSalon.paymentHistory?.map((payment: any) => (
                      <Card
                        key={payment.id}
                        className={`p-5 border-2 ${
                          payment.status === 'failed'
                            ? 'border-red-200 bg-red-50'
                            : 'border-green-200 bg-green-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge
                                className={
                                  payment.status === 'success'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-red-600 text-white'
                                }
                              >
                                {payment.status.toUpperCase()}
                              </Badge>
                              <span className="font-bold text-lg">AED {payment.amount}</span>
                              <span className="text-sm text-gray-600">{payment.date}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Payment Method: {payment.method}
                            </p>
                            {payment.reason && (
                              <p className="text-sm text-red-600 mt-1">
                                ⚠️ Reason: {payment.reason}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {payment.status === 'failed' && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <RefreshCw className="w-4 h-4 mr-1" />
                                  Retry Payment
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Update Method
                                </Button>
                              </>
                            )}
                            {payment.status === 'success' && (
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-1" />
                                Receipt
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {selectedSalon.paymentHistory?.filter((p: any) => p.status === 'failed').length >
                    0 && (
                    <Card className="p-5 border-2 border-orange-200 bg-orange-50">
                      <h5 className="font-bold mb-3">💳 Payment Method Update</h5>
                      <p className="text-sm text-gray-600 mb-4">
                        This salon has {selectedSalon.paymentHistory.filter((p: any) => p.status === 'failed').length} failed payment(s). Contact
                        owner to update payment method.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Mail className="w-4 h-4 mr-1" />
                          Send Payment Update Link
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-1" />
                          Call Owner
                        </Button>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                {/* TAB 3: TIMELINE */}
                <TabsContent value="timeline" className="space-y-6 mt-6">
                  <h4 className="font-bold text-lg">Activity Timeline</h4>

                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                    <div className="space-y-6">
                      {selectedSalon.timeline?.map((event: any, idx: number) => (
                        <div key={event.id} className="relative flex gap-4">
                          <div
                            className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                              event.type === 'registration'
                                ? 'bg-blue-100'
                                : event.type === 'payment'
                                ? 'bg-green-100'
                                : event.type === 'payment_failed'
                                ? 'bg-red-100'
                                : event.type === 'warning'
                                ? 'bg-orange-100'
                                : event.type === 'upgrade'
                                ? 'bg-purple-100'
                                : 'bg-gray-100'
                            }`}
                          >
                            {event.type === 'registration' && (
                              <UserPlus className="w-5 h-5 text-blue-600" />
                            )}
                            {event.type === 'payment' && (
                              <CreditCard className="w-5 h-5 text-green-600" />
                            )}
                            {event.type === 'payment_failed' && (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            {event.type === 'warning' && (
                              <AlertTriangle className="w-5 h-5 text-orange-600" />
                            )}
                            {event.type === 'upgrade' && (
                              <ArrowUpRight className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <Card className="flex-1 p-4 border-2 border-gray-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">{event.text}</p>
                                <p className="text-sm text-gray-600">{event.date}</p>
                              </div>
                              <Badge
                                className={
                                  event.type === 'registration'
                                    ? 'bg-blue-100 text-blue-700'
                                    : event.type === 'payment'
                                    ? 'bg-green-100 text-green-700'
                                    : event.type === 'payment_failed'
                                    ? 'bg-red-100 text-red-700'
                                    : event.type === 'warning'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-purple-100 text-purple-700'
                                }
                              >
                                {event.type.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 4: NOTES & TAGS */}
                <TabsContent value="notes" className="space-y-6 mt-6">
                  <div>
                    <h4 className="font-bold text-lg mb-4">Tags</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedSalon.tags?.map((tagName: string) => {
                        const tag = availableTags.find((t) => t.name === tagName);
                        return (
                          <Badge
                            key={tagName}
                            style={{ backgroundColor: tag?.color, color: 'white' }}
                            className="text-sm px-3 py-1"
                          >
                            {tagName}
                            <button
                              className="ml-2 hover:text-red-200"
                              onClick={() => alert(`Remove tag: ${tagName}`)}
                            >
                              ×
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-sm text-gray-600 my-auto">Add Tag:</span>
                      {availableTags
                        .filter((tag) => !selectedSalon.tags?.includes(tag.name))
                        .map((tag) => (
                          <Button
                            key={tag.name}
                            size="sm"
                            variant="outline"
                            onClick={() => alert(`Add tag: ${tag.name}`)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {tag.name}
                          </Button>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-4">Internal Notes</h4>
                    <div className="space-y-3 mb-4">
                      {selectedSalon.notes?.map((note: any) => (
                        <Card key={note.id} className="p-4 border-2 border-gray-100">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-purple-100 text-purple-700">{note.admin}</Badge>
                                <span className="text-sm text-gray-600">{note.date}</span>
                              </div>
                              <p className="text-gray-800">{note.text}</p>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Card className="p-4 border-2 border-purple-200 bg-purple-50/30">
                      <textarea
                        className="w-full p-3 border-2 border-gray-200 rounded-lg resize-none"
                        rows={3}
                        placeholder="Add internal note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => {
                            if (newNote.trim()) {
                              alert(`Note added: ${newNote}`);
                              setNewNote('');
                            }
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Note
                        </Button>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* TAB 5: COMMUNICATIONS */}
                <TabsContent value="communications" className="space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">Communication History</h4>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Send className="w-4 h-4 mr-2" />
                      New Message
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {selectedSalon.communications?.map((comm: any) => (
                      <Card key={comm.id} className="p-5 border-2 border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge
                                className={
                                  comm.type === 'email'
                                    ? 'bg-blue-600 text-white'
                                    : comm.type === 'phone'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-purple-600 text-white'
                                }
                              >
                                {comm.type === 'email' && <Mail className="w-3 h-3 mr-1" />}
                                {comm.type === 'phone' && <Phone className="w-3 h-3 mr-1" />}
                                {comm.type === 'sms' && <MessageSquare className="w-3 h-3 mr-1" />}
                                {comm.type.toUpperCase()}
                              </Badge>
                              <span className="font-semibold">{comm.subject}</span>
                              <span className="text-sm text-gray-600">{comm.date}</span>
                            </div>
                            {comm.type === 'email' && comm.status && (
                              <Badge
                                className={
                                  comm.status === 'opened'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }
                              >
                                {comm.status === 'opened' ? '✓ Opened' : 'Not opened'}
                              </Badge>
                            )}
                            {comm.type === 'phone' && (
                              <Badge className="bg-green-100 text-green-700">
                                {comm.status === 'completed' ? '✓ Completed' : comm.status}
                              </Badge>
                            )}
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {selectedSalon.communications?.length === 0 && (
                    <Card className="p-8 border-2 border-dashed border-gray-300 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No communications yet</p>
                      <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                        <Send className="w-4 h-4 mr-2" />
                        Send First Message
                      </Button>
                    </Card>
                  )}
                </TabsContent>

                {/* TAB 6: INTEGRATIONS */}
                <TabsContent value="integrations" className="space-y-6 mt-6">
                  <h4 className="font-bold text-lg">Integration Status</h4>

                  <div className="grid lg:grid-cols-2 gap-4">
                    {selectedSalon.integrations?.map((integration: any, idx: number) => (
                      <Card
                        key={idx}
                        className={`p-5 border-2 ${
                          integration.status === 'active'
                            ? 'border-green-200 bg-green-50/50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                integration.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                              }`}
                            >
                              {integration.name === 'Google Calendar' && (
                                <CalendarIcon className="w-5 h-5 text-blue-600" />
                              )}
                              {integration.name === 'Stripe' && (
                                <CreditCard className="w-5 h-5 text-purple-600" />
                              )}
                              {integration.name === 'Mailchimp' && (
                                <Mail className="w-5 h-5 text-orange-600" />
                              )}
                              {integration.name === 'Zapier' && (
                                <Zap className="w-5 h-5 text-orange-500" />
                              )}
                            </div>
                            <div>
                              <h5 className="font-bold">{integration.name}</h5>
                              <p className="text-sm text-gray-600">
                                {integration.lastSync ? `Last sync: ${integration.lastSync}` : 'Not connected'}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={
                              integration.status === 'active'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-600 text-white'
                            }
                          >
                            {integration.status === 'active' ? '✓ Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          {integration.status === 'active' ? (
                            <>
                              <Button size="sm" variant="outline" className="flex-1">
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Sync Now
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-600">
                                <XCircle className="w-3 h-3 mr-1" />
                                Disconnect
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                              <Plug className="w-3 h-3 mr-1" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      )}

      {/* 🚀 FLOATING QUICK ACTIONS BUTTON */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-2xl hover:scale-110 transition-all"
          onClick={() => setShowQuickActions(!showQuickActions)}
        >
          <Zap className="w-8 h-8" />
        </Button>

        {/* QUICK ACTIONS PANEL */}
        {showQuickActions && (
          <Card className="absolute bottom-20 right-0 w-72 shadow-2xl border-2 border-purple-200">
            <div className="p-4">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setShowCommandPalette(true);
                    setShowQuickActions(false);
                  }}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Command Palette (⌘K)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setShowExportModal(true);
                    setShowQuickActions(false);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data (⌘E)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setShowNotifications(true);
                    setShowQuickActions(false);
                  }}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <Badge className="ml-auto bg-red-600 text-white">
                      {notifications.filter((n) => !n.read).length}
                    </Badge>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setLiveUpdates(!liveUpdates)}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  {liveUpdates ? 'Disable Live' : 'Enable Live'}
                </Button>
                <div className="border-t pt-2 mt-2">
                  <p className="text-xs text-gray-500 mb-2">⌨️ Keyboard Shortcuts:</p>
                  {keyboardShortcuts.slice(0, 4).map((shortcut) => (
                    <div
                      key={shortcut.key}
                      className="flex items-center justify-between text-xs py-1"
                    >
                      <span className="text-gray-600">{shortcut.action}</span>
                      <Badge variant="outline" className="text-xs">
                        {shortcut.key}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* 💸 REFUND REQUEST MODAL */}
      {showRefundModal && refundSalon && (
        <RefundRequestModal
          salon={refundSalon}
          onClose={() => {
            setShowRefundModal(false);
            setRefundSalon(null);
          }}
          onSubmit={(data: RefundRequestData) => {
            console.log('✅ Refund request submitted:', data);
            alert(`Refund request for ${data.salonName} (AED ${data.amount}) has been submitted!\n\nVerification email sent to: ${data.confirmationEmail}\n\nSuper admin will review the request.`);
            setShowRefundModal(false);
            setRefundSalon(null);
          }}
        />
      )}
    </div>
  );
}
