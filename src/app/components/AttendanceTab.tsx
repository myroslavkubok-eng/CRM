import { useState } from 'react';
import { Clock, Users, Calendar as CalendarIcon, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  role: 'master' | 'admin';
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  breakStart: string | null;
  breakEnd: string | null;
  totalHours: number;
  status: 'present' | 'late' | 'absent' | 'on-break';
}

interface AttendanceTabProps {
  userRole?: 'owner' | 'admin' | 'master';
}

export function AttendanceTab({ userRole = 'owner' }: AttendanceTabProps) {
  const [selectedDate, setSelectedDate] = useState('2024-12-23');
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('today');

  // Mock data
  const [attendance] = useState<AttendanceRecord[]>([
    {
      id: '1',
      staffId: 'm1',
      staffName: 'Anna Kowalska',
      role: 'master',
      date: '2024-12-23',
      clockIn: '09:02',
      clockOut: null,
      breakStart: '13:00',
      breakEnd: '13:30',
      totalHours: 4.5,
      status: 'present'
    },
    {
      id: '2',
      staffId: 'm2',
      staffName: 'Sarah Johnson',
      role: 'master',
      date: '2024-12-23',
      clockIn: '08:58',
      clockOut: null,
      breakStart: null,
      breakEnd: null,
      totalHours: 5.0,
      status: 'present'
    },
    {
      id: '3',
      staffId: 'm3',
      staffName: 'Maria Garcia',
      role: 'admin',
      date: '2024-12-23',
      clockIn: '09:15',
      clockOut: null,
      breakStart: null,
      breakEnd: null,
      totalHours: 4.75,
      status: 'late'
    },
    {
      id: '4',
      staffId: 'm4',
      staffName: 'Emma Wilson',
      role: 'master',
      date: '2024-12-23',
      clockIn: null,
      clockOut: null,
      breakStart: null,
      breakEnd: null,
      totalHours: 0,
      status: 'absent'
    }
  ]);

  const todayRecords = attendance.filter(a => a.date === selectedDate);
  const presentCount = todayRecords.filter(a => a.status === 'present' || a.status === 'late').length;
  const lateCount = todayRecords.filter(a => a.status === 'late').length;
  const absentCount = todayRecords.filter(a => a.status === 'absent').length;
  const totalHours = todayRecords.reduce((sum, a) => sum + a.totalHours, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle };
      case 'late': return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertCircle };
      case 'absent': return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle };
      case 'on-break': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: AlertCircle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-8 h-8 text-blue-600" />
            Staff Attendance
          </h1>
          <p className="text-gray-500 mt-1">Track working hours, breaks, and attendance</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex gap-2">
        {(['today', 'week', 'month'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === mode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Late Arrivals</p>
                <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Staff Member</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Clock In</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Clock Out</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Break</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Total Hours</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                  {userRole === 'owner' && (
                    <th className="text-right p-4 text-sm font-medium text-gray-600">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {todayRecords.map(record => {
                  const statusConfig = getStatusColor(record.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{record.staffName}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm capitalize text-gray-600">{record.role}</span>
                      </td>
                      <td className="p-4">
                        {record.clockIn ? (
                          <span className="text-sm text-gray-900">{record.clockIn}</span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {record.clockOut ? (
                          <span className="text-sm text-gray-900">{record.clockOut}</span>
                        ) : record.clockIn ? (
                          <span className="text-sm text-green-600 font-medium">Working...</span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {record.breakStart && record.breakEnd ? (
                          <span className="text-sm text-gray-600">
                            {record.breakStart} - {record.breakEnd}
                          </span>
                        ) : record.breakStart ? (
                          <span className="text-sm text-blue-600 font-medium">On break...</span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-bold text-gray-900">
                          {record.totalHours > 0 ? `${record.totalHours.toFixed(1)}h` : '—'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${statusConfig.bg}`}>
                          <StatusIcon className={`w-3 h-3 ${statusConfig.text}`} />
                          <span className={`text-xs font-medium capitalize ${statusConfig.text}`}>
                            {record.status}
                          </span>
                        </div>
                      </td>
                      {userRole === 'owner' && (
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {todayRecords.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No attendance records for this date</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            Monthly Summary (December 2024)
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700 mb-1">Total Working Hours</p>
              <p className="text-2xl font-bold text-green-900">168h</p>
              <p className="text-xs text-green-600 mt-1">Expected: 176h</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-700 mb-1">Late Arrivals</p>
              <p className="text-2xl font-bold text-yellow-900">8</p>
              <p className="text-xs text-yellow-600 mt-1">Across all staff</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-700 mb-1">Absences</p>
              <p className="text-2xl font-bold text-red-900">3</p>
              <p className="text-xs text-red-600 mt-1">Total days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
