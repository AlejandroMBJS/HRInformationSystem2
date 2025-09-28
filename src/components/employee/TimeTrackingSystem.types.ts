/**
 * Represents a single time entry for a user, including clock-in/out times, breaks, and overtime.
 */
export interface TimeEntry {
  id: string;
  userId: string;
  date: string; // ISO 8601 date string (YYYY-MM-DD)
  clockInTime: string; // ISO 8601 datetime string
  clockOutTime?: string; // ISO 8601 datetime string, optional
  status: 'clocked_in' | 'clocked_out' | 'approved' | 'pending' | 'rejected';
  notes?: string; // Max 255 characters, optional
  breaks?: Break[]; // Array of Break objects, optional
  overtimeHours?: number; // Non-negative float, optional
  regularHours?: number; // Non-negative float, optional
}

/**
 * Represents a break taken within a TimeEntry.
 */
export interface Break {
  id: string;
  timeEntryId: string;
  breakStartTime: string; // ISO 8601 datetime string
  breakEndTime?: string; // ISO 8601 datetime string, optional
  duration?: number; // Duration of the break in minutes, non-negative integer, optional
}

/**
 * Represents a user in the system (simplified for Time Tracking Context).
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager' | 'admin';
}

/**
 * Interface for filter parameters for time entries.
 */
export interface TimeEntryFilter {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  status?: 'clocked_in' | 'clocked_out' | 'approved' | 'pending' | 'rejected';
  userId?: string;
}

/**
 * Interface for pagination metadata.
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  entriesPerPage: number;
}

/**
 * Interface for API response containing time entries and pagination metadata.
 */
export interface TimeEntriesApiResponse {
  entries: TimeEntry[];
  meta: PaginationMeta;
}

/**
 * Interface for the props of the main TimeTrackingSystem component.
 */
export interface TimeTrackingSystemProps {
  currentUser: User;
}

/**
 * Interface for the props of the TimeEntryList component.
 */
export interface TimeEntryListProps {
  timeEntries: TimeEntry[];
  onEdit: (entry: TimeEntry) => void;
  onDelete: (id: string) => void;
}

/**
 * Interface for the props of the TimeEntryForm component.
 */
export interface TimeEntryFormProps {
  onSubmit: (entry: Partial<TimeEntry>, id?: string) => void;
  initialData?: TimeEntry; // For editing existing entries
  onClose: () => void;
}

/**
 * Interface for the props of the ClockInOutButton component.
 */
export interface ClockInOutButtonProps {
  onClockIn: () => void;
  onClockOut: () => void;
  isClockedIn: boolean;
  onStartBreak?: () => void;
  onEndBreak?: () => void;
  isBreakActive?: boolean;
}

/**
 * Interface for the props of the TimeTrackingDashboard component.
 */
export interface TimeTrackingDashboardProps {
  currentUser: User;
  timeEntries: TimeEntry[];
}

/**
 * Interface for the props of the FilterAndSearch component.
 */
export interface FilterAndSearchProps {
  onFilterChange: (filter: TimeEntryFilter) => void;
  onSearchChange: (searchTerm: string) => void;
}

/**
 * Interface for the props of the Pagination component.
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
