export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string; // Computed property
  email: string;
  phone: string;
  title: string;
  department: string;
  managerId?: string; // Optional, for organizational chart
  hireDate: string; // ISO date string
  photoUrl?: string;
  address: Address;
  skills: string[];
  bio?: string;
  // Additional fields for org chart or other specific needs
  subordinates?: string[]; // Array of employee IDs who report to this employee
}

export interface EmployeeDirectoryProps {
  // Props for the main component, if any are passed from a parent
}

export interface EmployeeDirectoryState {
  employees: Employee[];
  filteredEmployees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filters: { department: string | null; title: string | null };
  sortConfig: { key: keyof Employee; direction: 'asc' | 'desc' } | null;
}

export interface SortConfig {
  key: keyof Employee;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  department: string | null;
  title: string | null;
}
