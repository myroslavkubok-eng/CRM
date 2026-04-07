import { useState } from 'react';
import { Bell, BellOff, Smartphone, Mail, MessageSquare, Gift, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useNotifications } from '../../contexts/NotificationsContext';
import { toast } from 'sonner';

export function ClientNotificationSettings() {
  const {
    settings,
    updateSettings,
    subscribeToPush,
    unsubscribeFromPush,
    isPushSubscribed,
    isPushSupported,
    testNotification,
  } = useNotifications();

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (key: string, value: boolean) => {
    setIsSaving(true);
    try {
      await updateSettings({ [key]: value } as any);
      toast.success('Settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePushToggle = async () => {
    if (isPushSubscribed) {
      const success = await unsubscribeFromPush();
      if (success) {
        toast.success('Push notifications disabled');
      } else {
        toast.error('Failed to disable push notifications');
      }
    } else {
      const success = await subscribeToPush();
      if (success) {
        toast.success('Push notifications enabled! 🎉');
      } else {
        toast.error('Failed to enable push notifications. Please check your browser settings.');
      }
    }
  };

  const handleTestNotification = async () => {
    await testNotification();
    toast.success('Test notification sent!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="w-6 h-6 text-purple-600" />
          Notification Preferences
        </h2>
        <p className="text-gray-600 mt-1">
          Choose how you want to receive appointment reminders
        </p>
      </div>

      {/* Master Toggle */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.enabled ? (
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <BellOff className="w-6 h-6 text-gray-600" />
                </div>
              )}
              <div>
                <Label className="text-base font-semibold">All Notifications</Label>
                <p className="text-sm text-gray-600">
                  {settings.enabled ? 'You will receive notifications' : 'All notifications are disabled'}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(value) => handleToggle('enabled', value)}
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Info about salon settings */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">💡 Reminder Schedule</p>
              <p className="text-blue-700">
                The salon has set up automatic reminders for your appointments. You'll receive notifications at the times configured by the salon. Just choose your preferred notification channels below.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>
            Choose how you want to receive your appointment reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-transparent hover:border-purple-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <Label className="font-medium text-base">Push Notifications</Label>
                <p className="text-sm text-gray-600">
                  {isPushSupported
                    ? 'Get instant alerts on this device'
                    : 'Not supported on this browser'}
                </p>
                {isPushSubscribed && (
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                )}
              </div>
            </div>
            <Switch
              checked={isPushSubscribed}
              onCheckedChange={handlePushToggle}
              disabled={!isPushSupported || isSaving || !settings.enabled}
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-transparent hover:border-purple-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <Label className="font-medium text-base">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive reminders via email</p>
                {settings.emailNotifications && (
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                )}
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(value) => handleToggle('emailNotifications', value)}
              disabled={isSaving || !settings.enabled}
            />
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-transparent opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <Label className="font-medium text-base text-gray-700">SMS Notifications</Label>
                <p className="text-sm text-gray-500">Coming soon - text message reminders</p>
              </div>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(value) => handleToggle('smsNotifications', value)}
              disabled={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Other Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing & Updates</CardTitle>
          <CardDescription>Stay updated with promotions and news</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-transparent hover:border-purple-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <Label className="font-medium text-base">Promotions & Special Offers</Label>
                <p className="text-sm text-gray-600">Get notified about exclusive deals and discounts</p>
              </div>
            </div>
            <Switch
              checked={settings.marketing}
              onCheckedChange={(value) => handleToggle('marketing', value)}
              disabled={isSaving || !settings.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Notification */}
      {isPushSupported && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-purple-900 mb-1">Test Your Notifications</p>
                  <p className="text-sm text-purple-700">
                    Send a test notification to make sure everything is working correctly
                  </p>
                </div>
              </div>
              <Button
                onClick={handleTestNotification}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto"
                disabled={!isPushSubscribed && !settings.emailNotifications}
              >
                Send Test
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-sm text-gray-700 space-y-2">
            <p className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span><strong>Push notifications</strong> require browser permission. If you don't see the prompt, check your browser settings.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span><strong>iOS users:</strong> Install the app to your home screen via Safari's "Share" → "Add to Home Screen" to receive push notifications.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>The salon controls when reminders are sent. You just choose how you want to receive them.</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
