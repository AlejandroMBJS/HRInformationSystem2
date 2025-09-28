import { PersonalSettingsData } from './types';

export const mockPersonalSettingsData: PersonalSettingsData = {
  preferences: {
    theme: 'dark',
    language: 'en',
    timezone: 'America/Los_Angeles',
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notificationFrequency: 'daily',
    marketingEmails: false,
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: new Date('2025-09-01T10:00:00Z'),
    activeSessions: [
      {
        id: 'session_123',
        device: 'Chrome on Windows',
        location: 'San Francisco, CA',
        ipAddress: '192.168.1.100',
        lastActive: new Date('2025-09-28T14:30:00Z'),
      },
      {
        id: 'session_456',
        device: 'Safari on iOS',
        location: 'Los Angeles, CA',
        ipAddress: '10.0.0.5',
        lastActive: new Date('2025-09-28T10:15:00Z'),
      },
    ],
  },
  account: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+15551234567',
    profilePictureUrl: 'https://example.com/profile.jpg',
    dateJoined: new Date('2023-01-15T08:00:00Z'),
  },
};
