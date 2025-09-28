import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import * as Select from '@radix-ui/react-select';
import * as Switch from '@radix-ui/react-switch';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Cross2Icon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'; // Radix Icons for better UI

import {
  Employee,
  Activity,
  Notification,
  DashboardStats,
  QuickAction,
  EmployeeFilter,
  EmployeeSort
} from '../types/employeeDashboard';
import {
  mockEmployees,
  mockActivities,
  mockNotifications,
  mockDashboardStats,
  mockQuickActions
} from '../data/mockData';

// Icons (using Radix Icons or simple SVG for now)
const PlusIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const SearchIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const FilterIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>;
const SortIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h16m-16 4h9m-9 4h16"></path></svg>;
const InfoIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const BellIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const ActivityIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></path></svg>;
const ChartIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>;
const CalendarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const StarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.329 1.176l1.519 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.519-4.674a1 1 0 00-.329-1.176l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"></path></svg>;

interface EmployeeDashboardProps {
  // Props can be added here if the component needs to receive data or callbacks from a parent
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(mockDashboardStats);
  const [quickActions, setQuickActions] = useState<QuickAction[]>(mockQuickActions);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for CRUD operations
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState<boolean>(false);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState<boolean>(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState<boolean>(false);
  const [employeeToDeleteId, setEmployeeToDeleteId] = useState<string | null>(null);

  // State for filters, search, and sorting
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<EmployeeFilter>({ status: 'all', department: '', position: '', minSalary: undefined, maxSalary: undefined });
  const [sort, setSort] = useState<EmployeeSort>({ field: 'firstName', order: 'asc' });

  // --- Data Fetching (Mocked) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setEmployees(mockEmployees);
        setActivities(mockActivities);
        setNotifications(mockNotifications);
        setDashboardStats(mockDashboardStats);
        setQuickActions(mockQuickActions);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Filter, Search, Sort Logic ---
  const filteredAndSortedEmployees = useMemo(() => {
    let result = [...employees];

    // Search
    if (searchTerm) {
      result = result.filter(employee =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter(employee => employee.status === filters.status);
    }
    if (filters.department) {
      result = result.filter(employee => employee.department?.toLowerCase().includes(filters.department!.toLowerCase()));
    }
    if (filters.position) {
      result = result.filter(employee => employee.position?.toLowerCase().includes(filters.position!.toLowerCase()));
    }
    if (filters.minSalary !== undefined && filters.minSalary !== null) {
      result = result.filter(employee => employee.salary >= filters.minSalary!);
    }
    if (filters.maxSalary !== undefined && filters.maxSalary !== null) {
      result = result.filter(employee => employee.salary <= filters.maxSalary!);
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    return result;
  }, [employees, searchTerm, filters, sort]);

  // --- CRUD Operations (Mocked) ---
  const handleAddEmployee = useCallback((newEmployee: Omit<Employee, 'id' | 'hireDate' | 'lastReviewDate'>) => {
    setEmployees(prev => [
      ...prev,
      { ...newEmployee, id: `emp-${Date.now()}`, hireDate: new Date().toISOString().split('T')[0], lastReviewDate: new Date().toISOString().split('T')[0] } as Employee,
    ]);
    setIsAddEmployeeDialogOpen(false);
  }, []);

  const handleUpdateEmployee = useCallback((updatedEmployee: Employee) => {
    setEmployees(prev => prev.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp)));
    setIsEditEmployeeDialogOpen(false);
    setEmployeeToEdit(null);
  }, []);

  const handleDeleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setIsDeleteConfirmDialogOpen(false);
    setEmployeeToDeleteId(null);
  }, []);

  // --- UI Rendering ---
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg font-semibold" role="status" aria-live="polite">Loading Employee Dashboard...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-red-600" role="alert">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans" aria-label="Employee Dashboard">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 sr-only">Employee Dashboard</h1>

      {/* Header Section */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome, Admin!</h2>
          <p className="text-gray-600">Here's an overview of your employee data.</p>
        </div>
        <Dialog.Root open={isAddEmployeeDialogOpen} onOpenChange={setIsAddEmployeeDialogOpen}>
          <Dialog.Trigger asChild>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Add New Employee"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Employee
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">Add New Employee</Dialog.Title>
              <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                Fill in the details for the new employee.
              </Dialog.Description>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newEmployeeData: Omit<Employee, 'id' | 'hireDate' | 'lastReviewDate'> = {
                  firstName: formData.get('firstName') as string,
                  lastName: formData.get('lastName') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  position: formData.get('position') as string,
                  department: formData.get('department') as string,
                  status: formData.get('status') as 'active' | 'inactive' | 'on_leave',
                  salary: parseFloat(formData.get('salary') as string),
                  address: {
                    street: formData.get('street') as string,
                    city: formData.get('city') as string,
                    state: formData.get('state') as string,
                    zip: formData.get('zip') as string,
                  },
                  skills: (formData.get('skills') as string).split(',').map(s => s.trim()),
                  performanceScore: parseInt(formData.get('performanceScore') as string),
                };
                handleAddEmployee(newEmployeeData);
              }}>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="firstName">First Name</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="firstName" name="firstName" required aria-required="true" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="lastName">Last Name</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="lastName" name="lastName" required aria-required="true" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="email">Email</label>
                  <input type="email" className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="email" name="email" required aria-required="true" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="phone">Phone</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="phone" name="phone" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="position">Position</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="position" name="position" required aria-required="true" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="department">Department</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="department" name="department" required aria-required="true" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="salary">Salary</label>
                  <input type="number" className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="salary" name="salary" defaultValue={0} required aria-required="true" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="status">Status</label>
                  <Select.Root defaultValue="active" name="status">
                    <Select.Trigger className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500" aria-label="Employee Status">
                      <Select.Value />
                      <Select.Icon><ChevronDownIcon /></Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white rounded-md shadow-lg z-20" position="popper" sideOffset={5}>
                        <Select.Viewport className="p-1">
                          <Select.Item value="active" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md">Active</Select.Item>
                          <Select.Item value="inactive" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md">Inactive</Select.Item>
                          <Select.Item value="on_leave" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md">On Leave</Select.Item>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="street">Street</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="street" name="street" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="city">City</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="city" name="city" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="state">State</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="state" name="state" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="zip">Zip</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="zip" name="zip" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="skills">Skills (comma-separated)</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="skills" name="skills" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="performanceScore">Performance Score</label>
                  <input type="number" className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="performanceScore" name="performanceScore" defaultValue={0} />
                </fieldset>
                <div className="mt-[25px] flex justify-end">
                  <Dialog.Close asChild>
                    <button type="button" className="bg-gray-200 text-gray-700 hover:bg-gray-300 focus:shadow-gray-400 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none mr-2">Cancel</button>
                  </Dialog.Close>
                  <button type="submit" className="bg-green-500 text-white hover:bg-green-600 focus:shadow-green-700 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">Add Employee</button>
                </div>
              </form>
              <Dialog.Close asChild>
                <button
                  className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                  aria-label="Close"
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </header>

      {/* Dashboard Stats and Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" aria-labelledby="dashboard-summary-heading">
        <h2 id="dashboard-summary-heading" className="sr-only">Dashboard Summary</h2>
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between" role="status">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalEmployees}</p>
          </div>
          <InfoIcon className="h-8 w-8 text-indigo-500" aria-hidden="true" />
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between" role="status">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Employees</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.activeEmployees}</p>
          </div>
          <InfoIcon className="h-8 w-8 text-green-500" aria-hidden="true" />
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between" role="status">
          <div>
            <p className="text-sm font-medium text-gray-500">On Leave</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.onLeaveEmployees}</p>
          </div>
          <InfoIcon className="h-8 w-8 text-yellow-500" aria-hidden="true" />
        </div>
        <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between" role="status">
          <div>
            <p className="text-sm font-medium text-gray-500">Avg. Performance</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.averagePerformanceScore}%</p>
          </div>
          <StarIcon className="h-8 w-8 text-purple-500" aria-hidden="true" />
        </div>
      </section>

      {/* Quick Actions, Recent Activities, Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <section className="lg:col-span-1 bg-white rounded-lg shadow p-6" aria-labelledby="quick-actions-heading">
          <h3 id="quick-actions-heading" className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map(action => (
              <button
                key={action.id}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                aria-label={action.label}
              >
                {action.icon === 'plus' && <PlusIcon className="h-6 w-6 text-indigo-600 mb-2" aria-hidden="true" />}
                {action.icon === 'chart' && <ChartIcon className="h-6 w-6 text-indigo-600 mb-2" aria-hidden="true" />}
                {action.icon === 'calendar' && <CalendarIcon className="h-6 w-6 text-indigo-600 mb-2" aria-hidden="true" />}
                {action.icon === 'star' && <StarIcon className="h-6 w-6 text-indigo-600 mb-2" aria-hidden="true" />}
                <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activities */}
        <section className="lg:col-span-1 bg-white rounded-lg shadow p-6" aria-labelledby="recent-activities-heading">
          <h3 id="recent-activities-heading" className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
          <ul className="divide-y divide-gray-200" role="list">
            {activities.slice(0, 5).map(activity => (
              <li key={activity.id} className="py-3 flex items-center space-x-3">
                <ActivityIcon className="h-5 w-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.description}</p>
                  <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Notifications */}
        <section className="lg:col-span-1 bg-white rounded-lg shadow p-6" aria-labelledby="notifications-heading">
          <h3 id="notifications-heading" className="text-xl font-semibold text-gray-800 mb-4">Notifications</h3>
          <ul className="divide-y divide-gray-200" role="list">
            {notifications.slice(0, 5).map(notification => (
              <li key={notification.id} className="py-3 flex items-center space-x-3">
                <BellIcon className={`h-5 w-5 flex-shrink-0 ${notification.type === 'warning' ? 'text-yellow-500' : notification.type === 'alert' ? 'text-red-500' : 'text-blue-500'}`} aria-hidden="true" />
                <div className="flex-1">
                  <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>{notification.message}</p>
                  <p className="text-xs text-gray-500">{new Date(notification.timestamp).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Employee List Section */}
      <section className="bg-white rounded-lg shadow p-6" aria-labelledby="employee-list-heading">
        <h3 id="employee-list-heading" className="text-xl font-semibold text-gray-800 mb-4">Employee List</h3>

        {/* Search, Filter, Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search employees"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>

          {/* Filter Dropdown (Radix UI Popover for complex filters) */}
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Filter employees"
              >
                <FilterIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Filter
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="bg-white rounded-lg shadow-lg p-4 w-64 z-10" sideOffset={5}>
                <div className="grid gap-4">
                  <label htmlFor="filter-status" className="text-sm font-medium text-gray-700">Status</label>
                  <Select.Root value={filters.status} onValueChange={(value: 'active' | 'inactive' | 'on_leave' | 'all') => setFilters(prev => ({ ...prev, status: value }))}>
                    <Select.Trigger id="filter-status" className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500" aria-label="Filter by status">
                      <Select.Value />
                      <Select.Icon><ChevronDownIcon /></Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white rounded-md shadow-lg z-20" position="popper" sideOffset={5}>
                        <Select.Viewport className="p-1">
                          <Select.Item value="all" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md">All</Select.Item>
                          <Select.Item value="active" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md">Active</Select.Item>
                          <Select.Item value="inactive" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md">Inactive</Select.Item>
                          <Select.Item value="on_leave" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md">On Leave</Select.Item>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>

                  <label htmlFor="filter-department" className="text-sm font-medium text-gray-700">Department</label>
                  <input
                    id="filter-department"
                    type="text"
                    placeholder="e.g., Engineering"
                    className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                    aria-label="Filter by department"
                  />

                  <label htmlFor="filter-position" className="text-sm font-medium text-gray-700">Position</label>
                  <input
                    id="filter-position"
                    type="text"
                    placeholder="e.g., Software Engineer"
                    className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
                    value={filters.position}
                    onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
                    aria-label="Filter by position"
                  />

                  <label htmlFor="filter-min-salary" className="text-sm font-medium text-gray-700">Min Salary</label>
                  <input
                    id="filter-min-salary"
                    type="number"
                    placeholder="e.g., 50000"
                    className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
                    value={filters.minSalary || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, minSalary: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    aria-label="Filter by minimum salary"
                  />

                  <label htmlFor="filter-max-salary" className="text-sm font-medium text-gray-700">Max Salary</label>
                  <input
                    id="filter-max-salary"
                    type="number"
                    placeholder="e.g., 100000"
                    className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
                    value={filters.maxSalary || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxSalary: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    aria-label="Filter by maximum salary"
                  />
                </div>
                <Popover.Arrow className="fill-white" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          {/* Sort Dropdown (Radix UI DropdownMenu) */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Sort employees"
              >
                <SortIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Sort
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white rounded-lg shadow-lg p-1 w-48 z-10" sideOffset={5}>
                <DropdownMenu.RadioGroup value={sort.field} onValueChange={(value: keyof Employee) => setSort(prev => ({ ...prev, field: value }))}>
                  <DropdownMenu.RadioItem value="firstName" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md" aria-label="Sort by First Name">Sort by First Name</DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="lastName" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md" aria-label="Sort by Last Name">Sort by Last Name</DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="hireDate" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md" aria-label="Sort by Hire Date">Sort by Hire Date</DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="performanceScore" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md" aria-label="Sort by Performance Score">Sort by Performance Score</DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="salary" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md" aria-label="Sort by Salary">Sort by Salary</DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
                <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                <DropdownMenu.RadioGroup value={sort.order} onValueChange={(value: 'asc' | 'desc') => setSort(prev => ({ ...prev, order: value }))}>
                  <DropdownMenu.RadioItem value="asc" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md" aria-label="Sort ascending">Ascending</DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="desc" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md" aria-label="Sort descending">Descending</DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="Employee List">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hire Date</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No employees found.</td>
                </tr>
              ) : (
                filteredAndSortedEmployees.map(employee => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'active' ? 'bg-green-100 text-green-800' : employee.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {employee.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.hireDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        onClick={() => { setEmployeeToEdit(employee); setIsEditEmployeeDialogOpen(true); }}
                        aria-label={`Edit ${employee.firstName} ${employee.lastName}`}
                      >
                        <EditIcon className="inline-block h-5 w-5" aria-hidden="true" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => { setEmployeeToDeleteId(employee.id); setIsDeleteConfirmDialogOpen(true); }}
                        aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
                      >
                        <TrashIcon className="inline-block h-5 w-5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Employee Dialog */}
      <Dialog.Root open={isEditEmployeeDialogOpen} onOpenChange={setIsEditEmployeeDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">Edit Employee</Dialog.Title>
            <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
              Make changes to the employee details.
            </Dialog.Description>
            {employeeToEdit && (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedEmployeeData: Employee = {
                  ...employeeToEdit,
                  firstName: formData.get('firstName') as string,
                  lastName: formData.get('lastName') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  position: formData.get('position') as string,
                  department: formData.get('department') as string,
                  status: formData.get('status') as 'active' | 'inactive' | 'on_leave',
                  salary: parseFloat(formData.get('salary') as string),
                  address: {
                    street: formData.get('street') as string,
                    city: formData.get('city') as string,
                    state: formData.get('state') as string,
                    zip: formData.get('zip') as string,
                  },
                  skills: (formData.get('skills') as string).split(',').map(s => s.trim()),
                  performanceScore: parseInt(formData.get('performanceScore') as string),
                };
                handleUpdateEmployee(updatedEmployeeData);
              }}>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-firstName">First Name</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="edit-firstName" name="firstName" defaultValue={employeeToEdit.firstName} required aria-required="true" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-lastName">Last Name</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="edit-lastName" name="lastName" defaultValue={employeeToEdit.lastName} required aria-required="true" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-email">Email</label>
                  <input type="email" className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="edit-email" name="email" defaultValue={employeeToEdit.email} required aria-required="true" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-phone">Phone</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="edit-phone" name="phone" defaultValue={employeeToEdit.phone} />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-position">Position</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="edit-position" name="position" defaultValue={employeeToEdit.position} required aria-required="true" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-department">Department</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="edit-department" name="department" defaultValue={employeeToEdit.department} required aria-required="true" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-salary">Salary</label>
                  <input type="number" className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="edit-salary" name="salary" defaultValue={employeeToEdit.salary} required aria-required="true" />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-status">Status</label>
                  <Select.Root defaultValue={employeeToEdit.status} name="status">
                    <Select.Trigger className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500" aria-label="Employee Status">
                      <Select.Value />
                      <Select.Icon><ChevronDownIcon /></Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white rounded-md shadow-lg z-20" position="popper" sideOffset={5}>
                        <Select.Viewport className="p-1">
                          <Select.Item value="active" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md">Active</Select.Item>
                          <Select.Item value="inactive" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md">Inactive</Select.Item>
                          <Select.Item value="on_leave" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md">On Leave</Select.Item>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-street">Street</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="edit-street" name="street" defaultValue={employeeToEdit.address.street} />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-city">City</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="edit-city" name="city" defaultValue={employeeToEdit.address.city} />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-state">State</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="edit-state" name="state" defaultValue={employeeToEdit.address.state} />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-zip">Zip</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="edit-zip" name="zip" defaultValue={employeeToEdit.address.zip} />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-skills">Skills (comma-separated)</label>
                  <input className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="edit-skills" name="skills" defaultValue={employeeToEdit.skills.join(', ')} />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="edit-performanceScore">Performance Score</label>
                  <input type="number" className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" id="edit-performanceScore" name="performanceScore" defaultValue={employeeToEdit.performanceScore} />
                </fieldset>
                <div className="mt-[25px] flex justify-end">
                  <Dialog.Close asChild>
                    <button type="button" className="bg-gray-200 text-gray-700 hover:bg-gray-300 focus:shadow-gray-400 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none mr-2">Cancel</button>
                  </Dialog.Close>
                  <button type="submit" className="bg-indigo-500 text-white hover:bg-indigo-600 focus:shadow-indigo-700 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">Save Changes</button>
                </div>
              </form>
            )}
            <Dialog.Close asChild>
              <button
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={isDeleteConfirmDialogOpen} onOpenChange={setIsDeleteConfirmDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">Confirm Deletion</Dialog.Title>
            <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
              Are you sure you want to delete this employee? This action cannot be undone.
            </Dialog.Description>
            <div className="mt-[25px] flex justify-end">
              <Dialog.Close asChild>
                <button type="button" className="bg-gray-200 text-gray-700 hover:bg-gray-300 focus:shadow-gray-400 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none mr-2">Cancel</button>
              </Dialog.Close>
              <button
                type="button"
                className="bg-red-500 text-white hover:bg-red-600 focus:shadow-red-700 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                onClick={() => employeeToDeleteId && handleDeleteEmployee(employeeToDeleteId)}
              >
                Delete
              </button>
            </div>
            <Dialog.Close asChild>
              <button
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default EmployeeDashboard;
