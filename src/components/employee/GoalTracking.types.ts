export const GoalStatus = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  CANCELLED: 'Cancelled',
} as const;

export type GoalStatus = typeof GoalStatus[keyof typeof GoalStatus];

export const GoalPriority = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
} as const;

export type GoalPriority = typeof GoalPriority[keyof typeof GoalPriority];

export interface Milestone {
  id: string;
  goalId: string;
  name: string;
  description: string;
  dueDate: string; // ISO date string
  status: GoalStatus;
  progress: number; // Percentage from 0 to 100
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ProgressUpdate {
  id: string;
  goalId: string;
  milestoneId?: string; // Optional, if update is specific to a milestone
  date: string; // ISO date string
  notes: string;
  progressPercentage: number; // Overall progress of the goal/milestone
  attachments?: string[]; // URLs to attachments
  createdAt: string; // ISO date string
}

export interface Goal {
  id: string;
  employeeId: string; // Assuming an employee module context
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: GoalStatus;
  priority: GoalPriority;
  category: string; // e.g., 'Professional Development', 'Project Delivery', 'Personal'
  smartCriteria: {
    specific: boolean;
    measurable: boolean;
    achievable: boolean;
    relevant: boolean;
    timeBound: boolean;
  };
  milestones: Milestone[];
  progressUpdates: ProgressUpdate[];
  targetValue?: number; // e.g., for measurable goals (sales targets, lines of code)
  currentValue?: number;
  tags?: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface GoalFilter {
  status?: GoalStatus[];
  priority?: GoalPriority[];
  category?: string[];
  employeeId?: string;
  startDateRange?: { start: string; end: string };
  endDateRange?: { start: string; end: string };
}

export interface GoalSort {
  field: 'title' | 'startDate' | 'endDate' | 'status' | 'priority' | 'createdAt' | 'updatedAt';
  order: 'asc' | 'desc';
}

export interface Pagination {
  page: number;
  pageSize: number;
}

export interface GoalQueryParams {
  filters?: GoalFilter;
  sort?: GoalSort;
  search?: string; // Full-text search across title, description, notes
  pagination?: Pagination;
}

export interface GoalApiResponse {
  data: Goal[];
  total: number;
  page: number;
  pageSize: number;
}
