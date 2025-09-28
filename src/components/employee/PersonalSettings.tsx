import React, { useState, useEffect } from 'react';
import { PersonalSettingsData, UserPreferences, NotificationSettings, SecuritySettings, AccountInfo, ActiveSession } from '../lib/types';
import { mockPersonalSettingsData } from '../lib/mockData';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

// Helper function to simulate API calls
const simulateApiCall = <T,>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 500);
  });
};

const PersonalSettings: React.FC = () => {
  const [settings, setSettings] = useState<PersonalSettingsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulate fetching data from an API
        const data = await simulateApiCall<PersonalSettingsData>(mockPersonalSettingsData);
        setSettings(data);
      } catch (err) {
        setError('Failed to load personal settings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handlePreferenceChange = async (key: keyof UserPreferences, value: any) => {
    if (!settings) return;
    const updatedPreferences = { ...settings.preferences, [key]: value };
    try {
      setLoading(true);
      await simulateApiCall(updatedPreferences);
      setSettings((prev) => prev ? { ...prev, preferences: updatedPreferences } : null);
    } catch (err) {
      setError('Failed to update preferences.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async (key: keyof NotificationSettings, value: any) => {
    if (!settings) return;
    const updatedNotifications = { ...settings.notifications, [key]: value };
    try {
      setLoading(true);
      await simulateApiCall(updatedNotifications);
      setSettings((prev) => prev ? { ...prev, notifications: updatedNotifications } : null);
    } catch (err) {
      setError('Failed to update notifications.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountInfoChange = async (key: keyof AccountInfo, value: any) => {
    if (!settings) return;
    const updatedAccountInfo = { ...settings.account, [key]: value };
    try {
      setLoading(true);
      await simulateApiCall(updatedAccountInfo);
      setSettings((prev) => prev ? { ...prev, account: updatedAccountInfo } : null);
    } catch (err) {
      setError('Failed to update account info.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (newPassword: string) => {
    // Simulate password change API call
    try {
      setLoading(true);
      await simulateApiCall({ success: true }); // Mock success
      alert('Password changed successfully!');
    } catch (err) {
      setError('Failed to change password.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTwoFactor = async (enabled: boolean) => {
    if (!settings) return;
    const updatedSecurity = { ...settings.security, twoFactorEnabled: enabled };
    try {
      setLoading(true);
      await simulateApiCall(updatedSecurity);
      setSettings((prev) => prev ? { ...prev, security: updatedSecurity } : null);
    } catch (err) {
      setError('Failed to update two-factor authentication.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async (sessionId: string) => {
    if (!settings) return;
    const updatedSessions = settings.security.activeSessions.filter(session => session.id !== sessionId);
    const updatedSecurity = { ...settings.security, activeSessions: updatedSessions };
    try {
      setLoading(true);
      await simulateApiCall(updatedSecurity);
      setSettings((prev) => prev ? { ...prev, security: updatedSecurity } : null);
    } catch (err) {
      setError('Failed to end session.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg" aria-live="polite" aria-busy="true">Loading settings...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-lg text-red-500" role="alert">Error: {error}</div>;
  }

  if (!settings) {
    return <div className="flex justify-center items-center h-screen text-lg">No settings data available.</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl" aria-label="Personal Settings">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Personal Settings</h1>

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="preferences" aria-controls="preferences-tab-panel">Preferences</TabsTrigger>
          <TabsTrigger value="notifications" aria-controls="notifications-tab-panel">Notifications</TabsTrigger>
          <TabsTrigger value="security" aria-controls="security-tab-panel">Security</TabsTrigger>
          <TabsTrigger value="account" aria-controls="account-tab-panel">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" id="preferences-tab-panel" role="tabpanel" aria-labelledby="preferences-tab">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.preferences.theme} onValueChange={(value: 'light' | 'dark' | 'system') => handlePreferenceChange('theme', value)} aria-label="Select theme">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={settings.preferences.language} onValueChange={(value: 'en' | 'es' | 'fr') => handlePreferenceChange('language', value)} aria-label="Select language">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  type="text"
                  value={settings.preferences.timezone}
                  onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                  aria-label="Timezone input"
                />
              </div>
            </div>
            <Button onClick={() => alert('Preferences saved!')} aria-label="Save preferences">Save Preferences</Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" id="notifications-tab-panel" role="tabpanel" aria-labelledby="notifications-tab">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  aria-label="Toggle email notifications"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Switch
                  id="push-notifications"
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                  aria-label="Toggle push notifications"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <Switch
                  id="sms-notifications"
                  checked={settings.notifications.smsNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                  aria-label="Toggle SMS notifications"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <Switch
                  id="marketing-emails"
                  checked={settings.notifications.marketingEmails}
                  onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                  aria-label="Toggle marketing emails"
                />
              </div>
              <div>
                <Label htmlFor="notification-frequency">Notification Frequency</Label>
                <Select value={settings.notifications.notificationFrequency} onValueChange={(value: 'daily' | 'weekly' | 'instant') => handleNotificationChange('notificationFrequency', value)} aria-label="Select notification frequency">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => alert('Notification settings saved!')} aria-label="Save notification settings">Save Notifications</Button>
          </div>
        </TabsContent>

        <TabsContent value="security" id="security-tab-panel" role="tabpanel" aria-labelledby="security-tab">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <Switch
                  id="two-factor"
                  checked={settings.security.twoFactorEnabled}
                  onCheckedChange={handleToggleTwoFactor}
                  aria-label="Toggle two-factor authentication"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Change Password</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" aria-label="Open change password dialog">Change Password</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>Enter your new password below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-password" className="text-right">New Password</Label>
                        <Input id="new-password" type="password" className="col-span-3" aria-label="New password input" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="confirm-password" className="text-right">Confirm Password</Label>
                        <Input id="confirm-password" type="password" className="col-span-3" aria-label="Confirm new password input" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={() => handleChangePassword('new-password-value')} aria-label="Confirm password change">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Active Sessions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Last password change: {new Date(settings.security.lastPasswordChange).toLocaleDateString()}</p>
                <div className="space-y-3">
                  {settings.security.activeSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                      <div>
                        <p className="font-medium">{session.device}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{session.location} - {session.ipAddress}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last active: {new Date(session.lastActive).toLocaleString()}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleEndSession(session.id)} aria-label={`End session on ${session.device}`}>End Session</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account" id="account-tab-panel" role="tabpanel" aria-labelledby="account-tab">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Account Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  type="text"
                  value={settings.account.firstName}
                  onChange={(e) => handleAccountInfoChange('firstName', e.target.value)}
                  aria-label="First name input"
                />
              </div>
              <div>
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  type="text"
                  value={settings.account.lastName}
                  onChange={(e) => handleAccountInfoChange('lastName', e.target.value)}
                  aria-label="Last name input"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.account.email}
                  onChange={(e) => handleAccountInfoChange('email', e.target.value)}
                  aria-label="Email input"
                />
              </div>
              <div>
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  value={settings.account.phoneNumber}
                  onChange={(e) => handleAccountInfoChange('phoneNumber', e.target.value)}
                  aria-label="Phone number input"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="profile-picture">Profile Picture URL</Label>
                <Input
                  id="profile-picture"
                  type="url"
                  value={settings.account.profilePictureUrl}
                  onChange={(e) => handleAccountInfoChange('profilePictureUrl', e.target.value)}
                  aria-label="Profile picture URL input"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Member since: {new Date(settings.account.dateJoined).toLocaleDateString()}</p>
            <div className="flex justify-between items-center">
              <Button onClick={() => alert('Account info saved!')} aria-label="Save account information">Save Account Info</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" aria-label="Open deactivate account dialog">Deactivate Account</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Deactivate Account</DialogTitle>
                    <DialogDescription>Are you sure you want to deactivate your account? This action cannot be undone.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="destructive" onClick={() => alert('Account deactivated!')} aria-label="Confirm account deactivation">Confirm Deactivation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalSettings;
