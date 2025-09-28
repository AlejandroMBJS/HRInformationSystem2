export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr';
  timezone: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  notificationFrequency: 'daily' | 'weekly' | 'instant';
  marketingEmails: boolean;
}

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: Date;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: Date;
  activeSessions: ActiveSession[];
}

export interface AccountInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string;
  dateJoined: Date;
}

export interface PersonalSettingsData {
  preferences: UserPreferences;
  notifications: NotificationSettings;
  security: SecuritySettings;
  account: AccountInfo;
}
