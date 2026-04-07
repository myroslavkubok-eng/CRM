import { useState } from 'react';
import { DollarSign, TrendingDown, Plus, Calendar, PieChart, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useCurrency } from '../../contexts/CurrencyContext';

interface Expense {
  id: string;
  category: 'Rent' | 'Utilities' | 'Salaries' | 'Supplies' | 'Marketing' | 'Equipment' | 'Other';
  description: string;
  amount: number;
  date: string;
  recurring: boolean;
}

export function ExpenseTab() {
  const { formatPrice } = useCurrency();
  const [selectedMonth, setSelectedMonth] = useState('2024-12');

  // Mock data
  const [expenses] = useState<Expense[]>([
    {
      id: '1',
      category: 'Rent',
      description: 'Monthly rent - Glamour Downtown',
      amount: 8000,
      date: '2024-12-01',
      recurring: true
    },
    {
      id: '2',
      category: 'Utilities',
      description: 'Electricity & Water',
      amount: 1200,
      date: '2024-12-05',
      recurring: true
    },
    {
      id: '3',
      category: 'Salaries',
      description: 'Staff salaries - December',
      amount: 18000,
      date: '2024-12-31',
      recurring: true
    },
    {
      id: '4',
      category: 'Supplies',
      description: 'Hair products & materials',
      amount: 2340,
      date: '2024-12-10',
      recurring: false
    },
    {
      id: '5',
      category: 'Marketing',
      description: 'Instagram & Facebook ads',
      amount: 800,
      date: '2024-12-15',
      recurring: true
    },
    {
      id: '6',
      category: 'Equipment',
      description: 'New hair dryer',
      amount: 450,
      date: '2024-12-18',
      recurring: false
    },
    {
      id: '7',
      category: 'Supplies',
      description: 'Nail products',
      amount: 890,
      date: '2024-12-12',
      recurring: false
    },
    {
      id: '8',
      category: 'Other',
      description: 'Cleaning service',
      amount: 300,
      date: '2024-12-20',
      recurring: true
    }
  ]);

  // Mock revenue
  const monthlyRevenue = 45600;

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const profit = monthlyRevenue - totalExpenses;
  const profitMargin = ((profit / monthlyRevenue) * 100).toFixed(1);

  const expensesByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors: Record<string, string> = {
    Rent: 'bg-purple-600',
    Utilities: 'bg-blue-600',
    Salaries: 'bg-green-600',
    Supplies: 'bg-yellow-600',
    Marketing: 'bg-pink-600',
    Equipment: 'bg-indigo-600',
    Other: 'bg-gray-600'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            Expense Tracking
          </h1>
          <p className="text-gray-500 mt-1">Monitor costs and manage salon budget</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(monthlyRevenue)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatPrice(totalExpenses)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Net Profit</p>
                <p className="text-2xl font-bold text-purple-900">{formatPrice(profit)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className="text-2xl font-bold text-gray-900">{profitMargin}%</p>
              </div>
              <PieChart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(expensesByCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => {
                const percentage = ((amount / totalExpenses) * 100).toFixed(1);
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{category}</span>
                      <span className="text-sm font-bold text-gray-900">{formatPrice(amount)} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${categoryColors[category]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Expenses</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Description</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenses
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(expense => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <span className="text-sm text-gray-900">{expense.date}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium text-white ${categoryColors[expense.category]}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-900">{expense.description}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-bold text-gray-900">{formatPrice(expense.amount)}</span>
                      </td>
                      <td className="p-4">
                        {expense.recurring ? (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Recurring</span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">One-time</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
