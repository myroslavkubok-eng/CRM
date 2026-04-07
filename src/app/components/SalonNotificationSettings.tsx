import { useState, useEffect } from 'react';
import { Bell, Clock, Users, Settings as SettingsIcon, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface SalonNotificationConfig {
  enabled: boolean;
  reminders: {
    threeDaysBefore: boolean;
    oneDayBefore: boolean;
    twoHoursBefore: boolean;
    thirtyMinutesBefore: boolean;
  };
  ownerNotifications: {
    newBookings: boolean;
    cancellations: boolean;
    rescheduled: boolean;
  };
}

const defaultConfig: SalonNotificationConfig = {
  enabled: true,
  reminders: {
    threeDaysBefore: true,
    oneDayBefore: true,
    twoHoursBefore: true,
    thirtyMinutesBefore: false,
  },
  ownerNotifications: {
    newBookings: true,
    cancellations: true,
    rescheduled: true,
  },
};

export function SalonNotificationSettings() {
  const { user } = useAuth();
  const [config, setConfig] = useState<SalonNotificationConfig>(defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load salon notification config
  useEffect(() => {
    loadConfig();
  }, [user]);

  const loadConfig = () => {
    try {
      const savedConfig = localStorage.getItem(`salon:notifications:${user?.salonId || 'default'}`);
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Error loading salon notification config:', error);
    }
  };

  const handleToggle = (section: string, key: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleMasterToggle = (value: boolean) => {
    setConfig(prev => ({ ...prev, enabled: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem(`salon:notifications:${user?.salonId || 'default'}`, JSON.stringify(config));
      
      toast.success('Notification settings saved successfully! 🎉');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    setHasChanges(true);
    toast.info('Settings reset to default');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-purple-600" />
            Salon Notification Settings
          </h2>
          <p className="text-gray-600 mt-1">
            Configure automatic reminders for all your clients
          </p>
        </div>
        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      {/* Master Toggle */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {config.enabled ? (
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-gray-600" />
                </div>
              )}
              <div>
                <Label className="text-base font-semibold">Automatic Notifications</Label>
                <p className="text-sm text-gray-600">
                  {config.enabled 
                    ? 'Clients will receive automatic appointment reminders' 
                    : 'All automatic reminders are disabled'}
                </p>
              </div>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={handleMasterToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Client Reminder Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <div>
              <CardTitle>Client Reminder Schedule</CardTitle>
              <CardDescription className="mt-1">
                Choose when clients receive appointment reminders
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-900">
                <strong>How it works:</strong> You set the reminder schedule here. Clients choose their preferred notification channels (Push, Email, SMS) in their settings. They'll automatically receive reminders at the times you configure below.
              </p>
            </div>
          </div>

          {/* 3 Days Before */}
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <div className="flex-1">
              <Label className="font-medium text-base">3 Days Before Appointment</Label>
              <p className="text-sm text-gray-600 mt-1">
                Early reminder to help clients plan ahead
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded">
                  72 hours before
                </span>
                <span className="text-xs text-gray-500">
                  e.g., Friday appointment → Tuesday reminder
                </span>
              </div>
            </div>
            <Switch
              checked={config.reminders.threeDaysBefore}
              onCheckedChange={(value) => handleToggle('reminders', 'threeDaysBefore', value)}
              disabled={!config.enabled}
            />
          </div>

          {/* 1 Day Before */}
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <div className="flex-1">
              <Label className="font-medium text-base">1 Day Before Appointment</Label>
              <p className="text-sm text-gray-600 mt-1">
                Next-day reminder for final preparation
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded">
                  24 hours before
                </span>
                <span className="text-xs text-gray-500">
                  e.g., Friday appointment → Thursday reminder
                </span>
              </div>
            </div>
            <Switch
              checked={config.reminders.oneDayBefore}
              onCheckedChange={(value) => handleToggle('reminders', 'oneDayBefore', value)}
              disabled={!config.enabled}
            />
          </div>

          {/* 2 Hours Before */}
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <div className="flex-1">
              <Label className="font-medium text-base">2 Hours Before Appointment</Label>
              <p className="text-sm text-gray-600 mt-1">
                Last-minute reminder to prevent no-shows
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded">
                  2 hours before
                </span>
                <span className="text-xs text-gray-500">
                  e.g., 2:00 PM appointment → 12:00 PM reminder
                </span>
              </div>
            </div>
            <Switch
              checked={config.reminders.twoHoursBefore}
              onCheckedChange={(value) => handleToggle('reminders', 'twoHoursBefore', value)}
              disabled={!config.enabled}
            />
          </div>

          {/* 30 Minutes Before */}
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <div className="flex-1">
              <Label className="font-medium text-base">30 Minutes Before Appointment</Label>
              <p className="text-sm text-gray-600 mt-1">
                Final reminder right before the appointment
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded">
                  30 minutes before
                </span>
                <span className="text-xs text-gray-500">
                  e.g., 2:00 PM appointment → 1:30 PM reminder
                </span>
              </div>
            </div>
            <Switch
              checked={config.reminders.thirtyMinutesBefore}
              onCheckedChange={(value) => handleToggle('reminders', 'thirtyMinutesBefore', value)}
              disabled={!config.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Owner/Admin Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <CardTitle>Staff Notifications</CardTitle>
              <CardDescription className="mt-1">
                Notifications for owners and administrators
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* New Bookings */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-transparent hover:border-purple-200 transition-colors">
            <div className="flex-1">
              <Label className="font-medium text-base">New Booking Alerts</Label>
              <p className="text-sm text-gray-600 mt-1">
                Get notified when a client makes a new booking
              </p>
            </div>
            <Switch
              checked={config.ownerNotifications.newBookings}
              onCheckedChange={(value) => handleToggle('ownerNotifications', 'newBookings', value)}
              disabled={!config.enabled}
            />
          </div>

          {/* Cancellations */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-transparent hover:border-purple-200 transition-colors">
            <div className="flex-1">
              <Label className="font-medium text-base">Cancellation Alerts</Label>
              <p className="text-sm text-gray-600 mt-1">
                Get notified when a client cancels their booking
              </p>
            </div>
            <Switch
              checked={config.ownerNotifications.cancellations}
              onCheckedChange={(value) => handleToggle('ownerNotifications', 'cancellations', value)}
              disabled={!config.enabled}
            />
          </div>

          {/* Rescheduled */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-transparent hover:border-purple-200 transition-colors">
            <div className="flex-1">
              <Label className="font-medium text-base">Reschedule Alerts</Label>
              <p className="text-sm text-gray-600 mt-1">
                Get notified when a client reschedules their appointment
              </p>
            </div>
            <Switch
              checked={config.ownerNotifications.rescheduled}
              onCheckedChange={(value) => handleToggle('ownerNotifications', 'rescheduled', value)}
              disabled={!config.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-900 mb-2">Current Configuration Summary</p>
              <div className="space-y-1 text-sm text-green-800">
                <p>
                  • <strong>Client Reminders:</strong>{' '}
                  {[
                    config.reminders.threeDaysBefore && '3 days',
                    config.reminders.oneDayBefore && '1 day',
                    config.reminders.twoHoursBefore && '2 hours',
                    config.reminders.thirtyMinutesBefore && '30 minutes',
                  ].filter(Boolean).join(', ') || 'None selected'}
                </p>
                <p>
                  • <strong>Staff Alerts:</strong>{' '}
                  {[
                    config.ownerNotifications.newBookings && 'New bookings',
                    config.ownerNotifications.cancellations && 'Cancellations',
                    config.ownerNotifications.rescheduled && 'Reschedules',
                  ].filter(Boolean).join(', ') || 'None selected'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handleReset}
          variant="outline"
          disabled={isSaving}
        >
          Reset to Default
        </Button>
        
        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        )}
      </div>
    </div>
  );
}
