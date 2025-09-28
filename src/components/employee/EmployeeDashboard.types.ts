export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  salary: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  managerId?: string;
  skills: string[];
  performanceScore: number;
  lastReviewDate: string;
}

export interface Activity {
  id: string;
  employeeId: string;
  type: 'login' | 'task_completed' | 'leave_request' | 'performance_review' | 'update_profile';
  description: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  employeeId: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  timestamp: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  newHiresLastMonth: number;
  averagePerformanceScore: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: string; // e.g., 'add_employee', 'view_reports', 'manage_leave'
}

export interface EmployeeFilter {
  status?: 'active' | 'inactive' | 'on_leave' | 'all';
  department?: string;
  position?: string;
  minSalary?: number;
  maxSalary?: number;
}

export interface EmployeeSort {
  field: keyof Employee;
  order: 'asc' | 'desc';
}
