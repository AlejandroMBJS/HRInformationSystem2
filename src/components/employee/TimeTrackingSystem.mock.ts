import { TimeEntry, Break, User } from './types';

// Helper function to generate UUIDs
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Mock Users
export const mockUsers: User[] = [
  {
    id: generateUUID(),
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    role: 'employee',
  },
  {
    id: generateUUID(),
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'employee',
  },
  {
    id: generateUUID(),
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'manager',
  },
  {
    id: generateUUID(),
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    role: 'admin',
  },
];

// Mock Breaks
const mockBreaks1: Break[] = [
  {
    id: generateUUID(),
    timeEntryId: '', // Will be filled by TimeEntry
    breakStartTime: '2025-09-27T12:00:00Z',
    breakEndTime: '2025-09-27T12:30:00Z',
    duration: 30,
  },
  {
    id: generateUUID(),
    timeEntryId: '', // Will be filled by TimeEntry
    breakStartTime: '2025-09-27T15:00:00Z',
    breakEndTime: '2025-09-27T15:15:00Z',
    duration: 15,
  },
];

const mockBreaks2: Break[] = [
  {
    id: generateUUID(),
    timeEntryId: '', // Will be filled by TimeEntry
    breakStartTime: '2025-09-26T13:00:00Z',
    breakEndTime: '2025-09-26T13:45:00Z',
    duration: 45,
  },
];

// Mock Time Entries
export const mockTimeEntries: TimeEntry[] = [
  {
    id: generateUUID(),
    userId: mockUsers[0].id,
    date: '2025-09-27',
    clockInTime: '2025-09-27T09:00:00Z',
    clockOutTime: '2025-09-27T17:30:00Z',
    status: 'approved',
    notes: 'Completed daily tasks and attended team meeting.',
    breaks: mockBreaks1,
    overtimeHours: 0.5,
    regularHours: 8,
  },
  {
    id: generateUUID(),
    userId: mockUsers[0].id,
    date: '2025-09-26',
    clockInTime: '2025-09-26T08:30:00Z',
    clockOutTime: '2025-09-26T18:00:00Z',
    status: 'pending',
    notes: 'Worked on project X, some overtime due to urgent deadline.',
    breaks: mockBreaks2,
    overtimeHours: 1,
    regularHours: 8.5,
  },
  {
    id: generateUUID(),
    userId: mockUsers[1].id,
    date: '2025-09-27',
    clockInTime: '2025-09-27T09:15:00Z',
    clockOutTime: '2025-09-27T17:45:00Z',
    status: 'approved',
    notes: 'Standard work day.',
    breaks: [],
    overtimeHours: 0,
    regularHours: 8.5,
  },
  {
    id: generateUUID(),
    userId: mockUsers[1].id,
    date: '2025-09-25',
    clockInTime: '2025-09-25T09:00:00Z',
    clockOutTime: '2025-09-25T17:00:00Z',
    status: 'rejected',
    notes: 'Forgot to clock out on time, adjusted by manager.',
    breaks: [],
    overtimeHours: 0,
    regularHours: 8,
  },
  {
    id: generateUUID(),
    userId: mockUsers[0].id,
    date: '2025-09-28',
    clockInTime: '2025-09-28T08:00:00Z',
    status: 'clocked_in',
    notes: 'Currently working.',
    breaks: [],
    overtimeHours: 0,
    regularHours: 0,
  },
  {
    id: generateUUID(),
    userId: mockUsers[2].id,
    date: '2025-09-27',
    clockInTime: '2025-09-27T08:00:00Z',
    clockOutTime: '2025-09-27T16:00:00Z',
    status: 'approved',
    notes: 'Managerial duties.',
    breaks: [],
    overtimeHours: 0,
    regularHours: 8,
  },
];

// Update timeEntryId for breaks
mockTimeEntries.forEach(entry => {
  if (entry.breaks) {
    entry.breaks.forEach(b => b.timeEntryId = entry.id);
  }
});

// Mock API functions (simulating backend calls)
export const fetchTimeEntries = async (
  filter: any = {},
  searchTerm: string = '',
  page: number = 1,
  limit: number = 10
): Promise<{ entries: TimeEntry[]; totalPages: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredEntries = mockTimeEntries.filter(entry => {
        const matchesSearch = searchTerm ? entry.notes?.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        const matchesStatus = filter.status ? entry.status === filter.status : true;
        const matchesUserId = filter.userId ? entry.userId === filter.userId : true;
        const matchesStartDate = filter.startDate ? entry.date >= filter.startDate : true;
        const matchesEndDate = filter.endDate ? entry.date <= filter.endDate : true;
        return matchesSearch && matchesStatus && matchesUserId && matchesStartDate && matchesEndDate;
      });

      // Sort by date descending
      filteredEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const totalEntries = filteredEntries.length;
      const totalPages = Math.ceil(totalEntries / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const entries = filteredEntries.slice(startIndex, endIndex);

      resolve({ entries, totalPages: totalPages, meta: { currentPage: page, totalPages: totalPages, totalEntries: totalEntries, entriesPerPage: limit } });
    }, 500);
  });
};

export const createTimeEntry = async (newEntry: Partial<TimeEntry>): Promise<TimeEntry> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entry: TimeEntry = {
        id: generateUUID(),
        userId: newEntry.userId || mockUsers[0].id, // Default to first user if not provided
        date: newEntry.date || new Date().toISOString().split('T')[0],
        clockInTime: newEntry.clockInTime || new Date().toISOString(),
        status: newEntry.status || 'pending',
        notes: newEntry.notes || '',
        breaks: newEntry.breaks || [],
        overtimeHours: newEntry.overtimeHours || 0,
        regularHours: newEntry.regularHours || 0,
        ...newEntry,
      };
      mockTimeEntries.unshift(entry); // Add to the beginning
      resolve(entry);
    }, 300);
  });
};

export const updateTimeEntry = async (id: string, updatedEntry: Partial<TimeEntry>): Promise<TimeEntry | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockTimeEntries.findIndex(entry => entry.id === id);
      if (index > -1) {
        mockTimeEntries[index] = { ...mockTimeEntries[index], ...updatedEntry };
        resolve(mockTimeEntries[index]);
      } else {
        resolve(null);
      }
    }, 300);
  });
};

export const deleteTimeEntry = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = mockTimeEntries.length;
      const updatedEntries = mockTimeEntries.filter(entry => entry.id !== id);
      mockTimeEntries.splice(0, mockTimeEntries.length, ...updatedEntries); // Replace array content
      resolve(mockTimeEntries.length < initialLength);
    }, 300);
  });
};

export const clockIn = async (userId: string): Promise<TimeEntry> => {
  return createTimeEntry({
    userId,
    date: new Date().toISOString().split('T')[0],
    clockInTime: new Date().toISOString(),
    status: 'clocked_in',
    notes: 'Clocked in.',
  });
};

export const clockOut = async (timeEntryId: string): Promise<TimeEntry | null> => {
  const entry = mockTimeEntries.find(e => e.id === timeEntryId);
  if (!entry || entry.status !== 'clocked_in') {
    return Promise.resolve(null);
  }

  const clockOutTime = new Date().toISOString();
  const clockInDate = new Date(entry.clockInTime);
  const clockOutDate = new Date(clockOutTime);

  // Calculate total work duration in milliseconds, accounting for breaks
  let totalWorkDurationMs = clockOutDate.getTime() - clockInDate.getTime();
  let totalBreakDurationMs = 0;

  entry.breaks?.forEach(b => {
    if (b.breakStartTime && b.breakEndTime) {
      totalBreakDurationMs += new Date(b.breakEndTime).getTime() - new Date(b.breakStartTime).getTime();
    }
  });

  totalWorkDurationMs -= totalBreakDurationMs;

  const totalHours = totalWorkDurationMs / (1000 * 60 * 60);
  let regularHours = Math.min(totalHours, 8); // Assuming 8 hours is regular
  let overtimeHours = Math.max(0, totalHours - 8);

  return updateTimeEntry(timeEntryId, {
    clockOutTime,
    status: 'pending',
    regularHours: parseFloat(regularHours.toFixed(2)),
    overtimeHours: parseFloat(overtimeHours.toFixed(2)),
  });
};

export const startBreak = async (timeEntryId: string): Promise<TimeEntry | null> => {
  const entry = mockTimeEntries.find(e => e.id === timeEntryId);
  if (!entry || entry.status !== 'clocked_in') {
    return Promise.resolve(null);
  }

  const newBreak: Break = {
    id: generateUUID(),
    timeEntryId: entry.id,
    breakStartTime: new Date().toISOString(),
  };

  const updatedBreaks = [...(entry.breaks || []), newBreak];
  return updateTimeEntry(timeEntryId, { breaks: updatedBreaks });
};

export const endBreak = async (timeEntryId: string, breakId: string): Promise<TimeEntry | null> => {
  const entry = mockTimeEntries.find(e => e.id === timeEntryId);
  if (!entry || !entry.breaks) {
    return Promise.resolve(null);
  }

  const breakIndex = entry.breaks.findIndex(b => b.id === breakId);
  if (breakIndex === -1 || entry.breaks[breakIndex].breakEndTime) {
    return Promise.resolve(null);
  }

  const updatedBreaks = [...entry.breaks];
  const endedBreak = updatedBreaks[breakIndex];
  endedBreak.breakEndTime = new Date().toISOString();
  endedBreak.duration = Math.round((new Date(endedBreak.breakEndTime).getTime() - new Date(endedBreak.breakStartTime).getTime()) / (1000 * 60));

  return updateTimeEntry(timeEntryId, { breaks: updatedBreaks });
};