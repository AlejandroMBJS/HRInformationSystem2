export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  hireDate: string; // ISO date string
  status: 'active' | 'inactive' | 'on_leave';
  performanceScore: number; // 0-100
  managerId?: string;
}

export interface PerformanceMetric {
  id: string;
  employeeId: string;
  date: string; // ISO date string
  metricName: string;
  value: number;
  unit: string;
  notes?: string;
}

export interface PerformanceTrend {
  date: string; // ISO date string
  score: number;
}

export interface EmployeePerformanceSummary {
  employeeId: string;
  averageScore: number;
  totalReviews: number;
  lastReviewDate: string; // ISO date string
  trends: PerformanceTrend[];
}

export interface FilterOptions {
  department?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'on_leave';
  minPerformanceScore?: number;
  maxPerformanceScore?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  searchQuery?: string;
}

export interface SortOptions {
  key: keyof Employee | keyof EmployeePerformanceSummary | 'averageScore' | 'lastReviewDate';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  pageIndex: number;
  pageSize: number;
}

export interface DashboardState {
  employees: Employee[];
  performanceMetrics: PerformanceMetric[];
  employeeSummaries: EmployeePerformanceSummary[];
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  sort: SortOptions;
  pagination: PaginationOptions;
  selectedEmployeeId: string | null;
  isModalOpen: boolean;
}
