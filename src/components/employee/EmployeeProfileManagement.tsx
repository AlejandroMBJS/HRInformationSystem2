import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { Employee, Skill, Certification } from '../types/employee';
import { mockEmployees } from '../data/mockEmployees';
import { v4 as uuidv4 } from 'uuid';

// Radix UI components
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Select from '@radix-ui/react-select';
import * as Tooltip from '@radix-ui/react-tooltip';

const EmployeeProfileManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id' | 'skills' | 'certifications'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    hireDate: '',
    department: '',
    position: '',
    salary: 0,
    status: 'active',
    photoUrl: null,
  });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // Filtering, Searching, Sorting, Pagination states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'on_leave'>('all');
  const [sortBy, setSortBy] = useState<keyof Employee>('firstName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [employeesPerPage] = useState<number>(5); // Number of employees per page

  // Operation specific states for loading and error
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setEmployees(mockEmployees);
      } catch (err) {
        setError("Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email) {
      setAddError('Please fill in required fields: First Name, Last Name, Email.');
      return;
    }
    try {
      setIsAdding(true);
      setAddError(null);
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      const employeeToAdd: Employee = {
        ...newEmployee,
        id: uuidv4(),
        skills: [],
        certifications: [],
      };
      setEmployees((prev) => [...prev, employeeToAdd]);
      setIsAddModalOpen(false);
      setNewEmployee({
        firstName: '', lastName: '', email: '', phone: '', address: '',
        dateOfBirth: '', hireDate: '', department: '', position: '',
        salary: 0, status: 'active', photoUrl: null,
      });
      setSuccessMessage('Employee added successfully!');
    } catch (err) {
      setAddError('Failed to add employee.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        setIsDeleting(true);
        setDeleteError(null);
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        setSuccessMessage('Employee deleted successfully!');
      } catch (err) {
        setDeleteError('Failed to delete employee.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async () => {
    if (editingEmployee) {
      try {
        setIsUpdating(true);
        setUpdateError(null);
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === editingEmployee.id ? editingEmployee : emp))
        );
        setIsEditModalOpen(false);
        setEditingEmployee(null);
        setSuccessMessage('Employee updated successfully!');
      } catch (err) {
        setUpdateError('Failed to update employee.');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditingEmployee(prev => prev ? { ...prev, photoUrl: reader.result as string } : null);
        } else {
          setNewEmployee(prev => ({ ...prev, photoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Memoized filtered and sorted employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees;

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Department
    if (filterDepartment !== 'all') {
      filtered = filtered.filter((emp) => emp.department === filterDepartment);
    }

    // Filter by Status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((emp) => emp.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    return filtered;
  }, [employees, searchTerm, filterDepartment, filterStatus, sortBy, sortOrder]);

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredAndSortedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / employeesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const uniqueDepartments = useMemo(() => {
    const departments = new Set(mockEmployees.map(emp => emp.department));
    return ['all', ...Array.from(departments)];
  }, []);

  // Clear success message after a few seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) return <div className="flex justify-center items-center h-screen text-lg text-gray-700" role="status" aria-live="polite">Loading employees...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500 text-lg" role="alert" aria-live="assertive">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6" tabIndex={-1}>Employee Profile Management</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="status" aria-live="polite">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {successMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3 text-green-500 hover:text-green-700"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close success message"
          >
            <svg className="fill-current h-6 w-6" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.15a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.15 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </button>
        </div>
      )}

      {/* Search, Filter, Sort Controls */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4" role="region" aria-label="Employee list controls">
        <input
          type="text"
          placeholder="Search employees..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search employees by name, email, position, or department"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />

        <Select.Root value={filterDepartment} onValueChange={(value) => { setFilterDepartment(value); setCurrentPage(1); }}>
          <Select.Trigger className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center w-full sm:w-auto" aria-label="Filter by Department">
            <Select.Value placeholder="Filter by Department" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white rounded-md shadow-lg z-50" position="popper" sideOffset={5}>
              <Select.Viewport className="p-1">
                {uniqueDepartments.map(dept => (
                  <Select.Item key={dept} value={dept} className="p-2 hover:bg-gray-100 cursor-pointer rounded-md">
                    <Select.ItemText>{dept === 'all' ? 'All Departments' : dept}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <Select.Root value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive' | 'on_leave') => { setFilterStatus(value); setCurrentPage(1); }}>
          <Select.Trigger className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center w-full sm:w-auto" aria-label="Filter by Status">
            <Select.Value placeholder="Filter by Status" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white rounded-md shadow-lg z-50" position="popper" sideOffset={5}>
              <Select.Viewport className="p-1">
                <Select.Item value="all" className="p-2 hover:bg-gray-100 cursor-pointer rounded-md"><Select.ItemText>All Statuses</Select.ItemText></Select.Item>
                <Select.Item value="active" className="p-2 hover:bg-gray-100 cursor-pointer rounded-md"><Select.ItemText>Active</Select.ItemText></Select.Item>
                <Select.Item value="inactive" className="p-2 hover:bg-gray-100 cursor-pointer rounded-md"><Select.ItemText>Inactive</Select.ItemText></Select.Item>
                <Select.Item value="on_leave" className="p-2 hover:bg-gray-100 cursor-pointer rounded-md"><Select.ItemText>On Leave</Select.ItemText></Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto" aria-label={`Currently sorted by ${sortBy === 'firstName' ? 'Name' : sortBy === 'hireDate' ? 'Hire Date' : sortBy === 'salary' ? 'Salary' : 'First Name'} in ${sortOrder === 'asc' ? 'ascending' : 'descending'} order. Click to change sort options.`}>
              Sort By: {sortBy === 'firstName' ? 'Name' : sortBy === 'hireDate' ? 'Hire Date' : sortBy === 'salary' ? 'Salary' : 'First Name'} ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-white shadow-lg rounded-md p-2 mt-2 w-48 z-10" sideOffset={5}>
              <DropdownMenu.Item className="p-2 hover:bg-gray-100 cursor-pointer rounded-md" onSelect={() => { setSortBy('firstName'); setCurrentPage(1); }}>Name</DropdownMenu.Item>
              <DropdownMenu.Item className="p-2 hover:bg-gray-100 cursor-pointer rounded-md" onSelect={() => { setSortBy('hireDate'); setCurrentPage(1); }}>Hire Date</DropdownMenu.Item>
              <DropdownMenu.Item className="p-2 hover:bg-gray-100 cursor-pointer rounded-md" onSelect={() => { setSortBy('salary'); setCurrentPage(1); }}>Salary</DropdownMenu.Item>
              <DropdownMenu.Separator className="h-[1px] bg-gray-200 my-1" />
              <DropdownMenu.Item className="p-2 hover:bg-gray-100 cursor-pointer rounded-md" onSelect={() => { setSortOrder('asc'); setCurrentPage(1); }}>Ascending</DropdownMenu.Item>
              <DropdownMenu.Item className="p-2 hover:bg-gray-100 cursor-pointer rounded-md" onSelect={() => { setSortOrder('desc'); setCurrentPage(1); }}>Descending</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <Dialog.Trigger asChild>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full sm:w-auto" aria-label="Add new employee">
              Add New Employee
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="add-employee-title" aria-describedby="add-employee-description">
              <Dialog.Title id="add-employee-title" className="text-mauve12 m-0 text-[17px] font-medium">Add Employee</Dialog.Title>
              <Dialog.Description id="add-employee-description" className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                Fill in the details for the new employee.
              </Dialog.Description>
              <form onSubmit={(e) => { e.preventDefault(); handleAddEmployee(); }}>
                <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={newEmployee.firstName}
                      onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={newEmployee.lastName}
                      onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium block mb-1" htmlFor="address">Address</label>
                    <input
                      id="address"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={newEmployee.address}
                      onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={newEmployee.dateOfBirth}
                      onChange={(e) => setNewEmployee({ ...newEmployee, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="hireDate">Hire Date</label>
                    <input
                      id="hireDate"
                      type="date"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={newEmployee.hireDate}
                      onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="department">Department</label>
                    <input
                      id="department"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="position">Position</label>
                    <input
                      id="position"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="salary">Salary</label>
                    <input
                      id="salary"
                      type="number"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={newEmployee.salary}
                      onChange={(e) => setNewEmployee({ ...newEmployee, salary: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="status">Status</label>
                    <Select.Root value={newEmployee.status} onValueChange={(value: 'active' | 'inactive' | 'on_leave') => setNewEmployee({ ...newEmployee, status: value })}>
                      <Select.Trigger className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center w-full" aria-label="Employee Status">
                        <Select.Value placeholder="Select a status" />
                        <Select.Icon />
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="bg-white rounded-md shadow-lg z-50" position="popper" sideOffset={5}>
                          <Select.Viewport className="p-1">
                            <Select.Item value="active" className="p-2 hover:bg-gray-100 cursor-pointer rounded-md">
                              <Select.ItemText>Active</Select.ItemText>
                            </Select.Item>
                            <Select.Item value="inactive" className="p-2 hover:bg-gray-100 cursor-pointer rounded-md">
                              <Select.ItemText>Inactive</Select.ItemText>
                            </Select.Item>
                            <Select.Item value="on_leave" className="p-2 hover:bg-gray-100 cursor-pointer rounded-md">
                              <Select.ItemText>On Leave</Select.ItemText>
                            </Select.Item>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium block mb-1" htmlFor="photoUpload">Photo Upload</label>
                    <input
                      id="photoUpload"
                      type="file"
                      accept="image/*"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      onChange={(e) => handlePhotoUpload(e, false)}
                      aria-describedby="photo-upload-description"
                    />
                    <p id="photo-upload-description" className="sr-only">Upload an image file for the employee's profile picture.</p>
                    {newEmployee.photoUrl && (
                      <img src={newEmployee.photoUrl} alt="New Employee Photo Preview" className="h-20 w-20 rounded-full object-cover mt-2" />
                    )}
                  </div>
                </fieldset>
                {addError && <p className="text-red-500 text-sm mt-2" role="alert" aria-live="assertive">{addError}</p>}
                <div className="mt-[25px] flex justify-end gap-3">
                  <Dialog.Close asChild>
                    <button type="button" className="bg-gray-200 text-gray-700 hover:bg-gray-300 focus:shadow-gray-400 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none" aria-label="Cancel adding new employee">Cancel</button>
                  </Dialog.Close>
                  <button type="submit" className="bg-green-600 text-white hover:bg-green-700 focus:shadow-green-700 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none" disabled={isAdding} aria-label={isAdding ? 'Adding employee...' : 'Add employee'}>
                    {isAdding ? 'Adding...' : 'Add Employee'}
                  </button>
                </div>
              </form>
              <Dialog.Close asChild>
                <button
                  className="text-gray-500 hover:bg-gray-100 focus:shadow-gray-400 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                  aria-label="Close add employee dialog"
                >
                  X
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Employee List/Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden" role="region" aria-labelledby="employee-list-heading">
        <h2 id="employee-list-heading" className="sr-only">Employee List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" role="table" aria-live="polite" aria-atomic="true">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No employees found.</td>
                </tr>
              ) : (
                currentEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img className="h-10 w-10 rounded-full object-cover" src={employee.photoUrl || 'https://via.placeholder.com/40'} alt={`${employee.firstName} ${employee.lastName}'s profile picture`} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.firstName} {employee.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'active' ? 'bg-green-100 text-green-800' : employee.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {employee.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEditEmployee(employee)} className="text-blue-600 hover:text-blue-900 mr-4" aria-label={`Edit ${employee.firstName} ${employee.lastName}'s profile`}>Edit</button>
                      <button onClick={() => handleDeleteEmployee(employee.id)} className="text-red-600 hover:text-red-900" aria-label={`Delete ${employee.firstName} ${employee.lastName}'s profile`} disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {deleteError && <p className="text-red-500 text-sm mt-2 text-center" role="alert" aria-live="assertive">{deleteError}</p>}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2" role="navigation" aria-label="Pagination for employee list">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-4 py-2 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            aria-label={`Go to page ${i + 1}`}
            aria-current={currentPage === i + 1 ? 'page' : undefined}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Edit Employee Modal */}
      <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="edit-employee-title" aria-describedby="edit-employee-description">
            <Dialog.Title id="edit-employee-title" className="text-mauve12 m-0 text-[17px] font-medium">Edit Employee</Dialog.Title>
            <Dialog.Description id="edit-employee-description" className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
              Update the details for the employee.
            </Dialog.Description>
            {editingEmployee && (
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateEmployee(); }}>
                <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="editFirstName">First Name</label>
                    <input
                      id="editFirstName"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={editingEmployee.firstName}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, firstName: e.target.value })}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="editLastName">Last Name</label>
                    <input
                      id="editLastName"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={editingEmployee.lastName}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, lastName: e.target.value })}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="editEmail">Email</label>
                    <input
                      id="editEmail"
                      type="email"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={editingEmployee.email}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="editPhone">Phone</label>
                    <input
                      id="editPhone"
                      type="tel"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={editingEmployee.phone}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium block mb-1" htmlFor="editAddress">Address</label>
                    <input
                      id="editAddress"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={editingEmployee.address}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="editDateOfBirth">Date of Birth</label>
                    <input
                      id="editDateOfBirth"
                      type="date"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={editingEmployee.dateOfBirth}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="editHireDate">Hire Date</label>
                    <input
                      id="editHireDate"
                      type="date"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={editingEmployee.hireDate}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, hireDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="editDepartment">Department</label>
                    <input
                      id="editDepartment"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={editingEmployee.department}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="editPosition">Position</label>
                    <input
                      id="editPosition"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={editingEmployee.position}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="editSalary">Salary</label>
                    <input
                      id="editSalary"
                      type="number"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={editingEmployee.salary}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, salary: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" htmlFor="editStatus">Status</label>
                    <Select.Root value={editingEmployee.status} onValueChange={(value: 'active' | 'inactive' | 'on_leave') => setEditingEmployee({ ...editingEmployee, status: value })}>
                      <Select.Trigger className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center w-full" aria-label="Employee Status">
                        <Select.Value placeholder="Select a status" />
                        <Select.Icon />
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="bg-white rounded-md shadow-lg z-50" position="popper" sideOffset={5}>
                          <Select.Viewport className="p-1">
                            <Select.Item value="active" className="p-2 hover:bg-gray-100 cursor-pointer rounded-md">
                              <Select.ItemText>Active</Select.ItemText>
                            </Select.Item>
                            <Select.Item value="inactive" className="p-2 hover:bg-gray-100 cursor-pointer rounded-md">
                              <Select.ItemText>Inactive</Select.ItemText>
                            </Select.Item>
                            <Select.Item value="on_leave" className="p-2 hover:bg-gray-100 cursor-pointer rounded-md">
                              <Select.ItemText>On Leave</Select.ItemText>
                            </Select.Item>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium block mb-1" htmlFor="editPhotoUpload">Photo Upload</label>
                    <input
                      id="editPhotoUpload"
                      type="file"
                      accept="image/*"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      onChange={(e) => handlePhotoUpload(e, true)}
                      aria-describedby="edit-photo-upload-description"
                    />
                    <p id="edit-photo-upload-description" className="sr-only">Upload an image file for the employee's profile picture.</p>
                    {editingEmployee.photoUrl && (
                      <img src={editingEmployee.photoUrl} alt="Employee Photo Preview" className="h-20 w-20 rounded-full object-cover mt-2" />
                    )}
                  </div>
                </fieldset>
                {updateError && <p className="text-red-500 text-sm mt-2" role="alert" aria-live="assertive">{updateError}</p>}
                <div className="mt-[25px] flex justify-end gap-3">
                  <Dialog.Close asChild>
                    <button type="button" className="bg-gray-200 text-gray-700 hover:bg-gray-300 focus:shadow-gray-400 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none" aria-label="Cancel editing employee">Cancel</button>
                  </Dialog.Close>
                  <button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 focus:shadow-blue-700 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none" disabled={isUpdating} aria-label={isUpdating ? 'Saving changes...' : 'Save changes'}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
            <Dialog.Close asChild>
              <button
                className="text-gray-500 hover:bg-gray-100 focus:shadow-gray-400 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close edit employee dialog"
              >
                X
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default EmployeeProfileManagement;