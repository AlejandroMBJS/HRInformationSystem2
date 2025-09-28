import React, { useState, useEffect, useMemo } from 'react';
import { mockEmployees } from '../lib/mockEmployees';
import { Employee, EmployeeDirectoryState, SortConfig, FilterConfig } from '../lib/employee.types';
import '../App.css'; // Import global styles including Tailwind

// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowUpDown, UserPlus, UserMinus, UserPen } from 'lucide-react';
import OrgChart from './OrgChart';

const EmployeeDirectory = () => {
  const [state, setState] = useState<EmployeeDirectoryState>({
    employees: [],
    filteredEmployees: [],
    selectedEmployee: null,
    isLoading: true,
    error: null,
    searchTerm: '',
    filters: { department: null, title: null },
    sortConfig: null,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prevState => ({ ...prevState, isLoading: true, error: null }));
        await new Promise(resolve => setTimeout(resolve, 500));
        const employeesWithFullName = mockEmployees.map(emp => ({
          ...emp,
          fullName: `${emp.firstName} ${emp.lastName}`,
        }));
        setState(prevState => ({
          ...prevState,
          employees: employeesWithFullName,
          filteredEmployees: employeesWithFullName,
          isLoading: false,
        }));
      } catch (err) {
        setState(prevState => ({
          ...prevState,
          error: 'Failed to fetch employees.',
          isLoading: false,
        }));
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setState(prevState => ({ ...prevState, searchTerm }));
  };

  const handleFilterChange = (type: keyof FilterConfig, value: string) => {
    setState(prevState => ({
      ...prevState,
      filters: { ...prevState.filters, [type]: value === 'All' ? null : value },
    }));
  };

  const handleSort = (key: keyof Employee) => {
    setState(prevState => {
      let direction: SortConfig['direction'] = 'asc';
      if (prevState.sortConfig && prevState.sortConfig.key === key && prevState.sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      return { ...prevState, sortConfig: { key, direction } };
    });
  };

  const sortedAndFilteredEmployees = useMemo(() => {
    let currentEmployees = [...state.employees];

    if (state.searchTerm) {
      currentEmployees = currentEmployees.filter(emp =>
        emp.fullName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        emp.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }

    if (state.filters.department) {
      currentEmployees = currentEmployees.filter(emp => emp.department === state.filters.department);
    }
    if (state.filters.title) {
      currentEmployees = currentEmployees.filter(emp => emp.title === state.filters.title);
    }

    if (state.sortConfig) {
      const { key, direction } = state.sortConfig;
      currentEmployees.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }

    return currentEmployees;
  }, [state.employees, state.searchTerm, state.filters, state.sortConfig]);

  const uniqueDepartments = useMemo(() => {
    const departments = new Set(state.employees.map(emp => emp.department));
    return ['All', ...Array.from(departments).sort()];
  }, [state.employees]);

  const uniqueTitles = useMemo(() => {
    const titles = new Set(state.employees.map(emp => emp.title));
    return ['All', ...Array.from(titles).sort()];
  }, [state.employees]);

  const departmentsForFilter = useMemo(() => {
    return uniqueDepartments.map(dept => ({ value: dept, label: dept }));
  }, [uniqueDepartments]);

  const titlesForFilter = useMemo(() => {
    return uniqueTitles.map(title => ({ value: title, label: title }));
  }, [uniqueTitles]);

  const handleViewDetails = (employee: Employee) => {
    setState(prevState => ({ ...prevState, selectedEmployee: employee }));
  };

  const handleCloseDetails = () => {
    setState(prevState => ({ ...prevState, selectedEmployee: null }));
  };

  const handleAddEmployee = (newEmployee: Omit<Employee, 'id' | 'fullName'>) => {
    const id = `emp-${Date.now()}`;
    const fullName = `${newEmployee.firstName} ${newEmployee.lastName}`;
    const employeeToAdd: Employee = { ...newEmployee, id, fullName };
    setState(prevState => ({
      ...prevState,
      employees: [...prevState.employees, employeeToAdd],
      filteredEmployees: [...prevState.employees, employeeToAdd],
    }));
    setIsAddDialogOpen(false);
  };

  const handleEditEmployee = (updatedEmployee: Employee) => {
    setState(prevState => {
      const updatedEmployees = prevState.employees.map(emp =>
        emp.id === updatedEmployee.id ? { ...updatedEmployee, fullName: `${updatedEmployee.firstName} ${updatedEmployee.lastName}` } : emp
      );
      return {
        ...prevState,
        employees: updatedEmployees,
        filteredEmployees: updatedEmployees,
        selectedEmployee: prevState.selectedEmployee?.id === updatedEmployee.id ? updatedEmployee : prevState.selectedEmployee,
      };
    });
    setIsEditDialogOpen(false);
    setEmployeeToEdit(null);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setState(prevState => {
      const remainingEmployees = prevState.employees.filter(emp => emp.id !== employeeId);
      return {
        ...prevState,
        employees: remainingEmployees,
        filteredEmployees: remainingEmployees,
        selectedEmployee: prevState.selectedEmployee?.id === employeeId ? null : prevState.selectedEmployee,
      };
    });
    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading employee data...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md p-6 text-center border-red-500 border-2">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{state.error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-center text-gray-800">Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Search by name, title, or department..."
              value={state.searchTerm}
              onChange={handleSearch}
              aria-label="Search employees"
              className="col-span-full md:col-span-1"
            />
            <Select
              onValueChange={(value) => handleFilterChange('department', value)}
              value={state.filters.department || 'All'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                {departmentsForFilter.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => handleFilterChange('title', value)}
              value={state.filters.title || 'All'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Title" />
              </SelectTrigger>
              <SelectContent>
                {titlesForFilter.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center"><UserPlus className="mr-2 h-4 w-4" /> Add Employee</Button>
            <Button onClick={() => { if (state.selectedEmployee) { setEmployeeToEdit(state.selectedEmployee); setIsEditDialogOpen(true); } }} variant="outline" className="flex items-center" disabled={!state.selectedEmployee}><UserPen className="mr-2 h-4 w-4" /> Edit Employee</Button>
            <Button onClick={() => { if (state.selectedEmployee) { setEmployeeToDelete(state.selectedEmployee); setIsDeleteDialogOpen(true); } }} variant="destructive" className="flex items-center" disabled={!state.selectedEmployee}><UserMinus className="mr-2 h-4 w-4" /> Delete Employee</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-700">Employee List ({sortedAndFilteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort('fullName')}>
                    <div className="flex items-center">
                      Name {state.sortConfig?.key === 'fullName' && (<ArrowUpDown className="ml-2 h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort('title')}>
                    <div className="flex items-center">
                      Title {state.sortConfig?.key === 'title' && (<ArrowUpDown className="ml-2 h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort('department')}>
                    <div className="flex items-center">
                      Department {state.sortConfig?.key === 'department' && (<ArrowUpDown className="ml-2 h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredEmployees.length > 0 ? (
                  sortedAndFilteredEmployees.map(employee => (
                    <TableRow key={employee.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium flex items-center">
                        {employee.photoUrl && <img src={employee.photoUrl} alt={employee.fullName} className="w-8 h-8 rounded-full mr-2 object-cover" />}
                        {employee.fullName}
                      </TableCell>
                      <TableCell>{employee.title}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.phone}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(employee)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No employees found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <OrgChart employees={state.employees} />

      {/* Employee Details Dialog */}
      {state.selectedEmployee && (
        <Dialog open={!!state.selectedEmployee} onOpenChange={handleCloseDetails}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Employee Details</DialogTitle>
              <DialogDescription>
                Detailed information about {state.selectedEmployee.fullName}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-4">
                {state.selectedEmployee.photoUrl && (
                  <img src={state.selectedEmployee.photoUrl} alt={state.selectedEmployee.fullName} className="w-20 h-20 rounded-full object-cover" />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{state.selectedEmployee.fullName}</h3>
                  <p className="text-gray-600">{state.selectedEmployee.title} - {state.selectedEmployee.department}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Label htmlFor="email" className="text-right">Email:</Label>
                <Input id="email" value={state.selectedEmployee.email} readOnly className="col-span-1" />
                <Label htmlFor="phone" className="text-right">Phone:</Label>
                <Input id="phone" value={state.selectedEmployee.phone} readOnly className="col-span-1" />
                <Label htmlFor="hireDate" className="text-right">Hire Date:</Label>
                <Input id="hireDate" value={state.selectedEmployee.hireDate} readOnly className="col-span-1" />
                <Label htmlFor="address" className="text-right">Address:</Label>
                <Input id="address" value={`${state.selectedEmployee.address.street}, ${state.selectedEmployee.address.city}, ${state.selectedEmployee.address.state} ${state.selectedEmployee.address.zip}`} readOnly className="col-span-1" />
                {state.selectedEmployee.bio && (
                  <>
                    <Label htmlFor="bio" className="text-right">Bio:</Label>
                    <Input id="bio" value={state.selectedEmployee.bio} readOnly className="col-span-1" />
                  </>
                )}
                {state.selectedEmployee.skills.length > 0 && (
                  <>
                    <Label htmlFor="skills" className="text-right">Skills:</Label>
                    <Input id="skills" value={state.selectedEmployee.skills.join(', ')} readOnly className="col-span-1" />
                  </>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCloseDetails}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Fill in the details for the new employee.</DialogDescription>
          </DialogHeader>
          <AddEditEmployeeForm onSubmit={handleAddEmployee} departments={uniqueDepartments.filter(d => d !== 'All')} titles={uniqueTitles.filter(t => t !== 'All')} />
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      {employeeToEdit && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>Update the details for {employeeToEdit.fullName}.</DialogDescription>
            </DialogHeader>
            <AddEditEmployeeForm employee={employeeToEdit} onSubmit={handleEditEmployee} departments={uniqueDepartments.filter(d => d !== 'All')} titles={uniqueTitles.filter(t => t !== 'All')} />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Employee Dialog */}
      {employeeToDelete && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Employee</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {employeeToDelete.fullName}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDeleteEmployee(employeeToDelete.id)}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Add/Edit Employee Form Component
interface AddEditEmployeeFormProps {
  employee?: Employee;
  onSubmit: (employee: Omit<Employee, 'id' | 'fullName'> | Employee) => void;
  departments: string[];
  titles: string[];
}

const AddEditEmployeeForm: React.FC<AddEditEmployeeFormProps> = ({ employee, onSubmit, departments, titles }) => {
  const [formData, setFormData] = useState<Omit<Employee, 'id' | 'fullName'>>({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    title: employee?.title || '',
    department: employee?.department || '',
    managerId: employee?.managerId || undefined,
    hireDate: employee?.hireDate || new Date().toISOString().split('T')[0],
    photoUrl: employee?.photoUrl || '',
    address: employee?.address || { street: '', city: '', state: '', zip: '' },
    skills: employee?.skills || [],
    bio: employee?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id.startsWith('address.')) {
      const addressField = id.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else if (id === 'skills') {
      setFormData(prev => ({ ...prev, skills: value.split(',').map(s => s.trim()) }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employee) {
      // Editing existing employee
      onSubmit({ ...employee, ...formData });
    } else {
      // Adding new employee
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="firstName" className="text-right">First Name</Label>
        <Input id="firstName" value={formData.firstName} onChange={handleChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="lastName" className="text-right">Last Name</Label>
        <Input id="lastName" value={formData.lastName} onChange={handleChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">Email</Label>
        <Input id="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">Phone</Label>
        <Input id="phone" value={formData.phone} onChange={handleChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">Title</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, title: value }))} value={formData.title}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a title" />
          </SelectTrigger>
          <SelectContent>
            {titles.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="department" className="text-right">Department</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))} value={formData.department}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="hireDate" className="text-right">Hire Date</Label>
        <Input id="hireDate" type="date" value={formData.hireDate} onChange={handleChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="photoUrl" className="text-right">Photo URL</Label>
        <Input id="photoUrl" value={formData.photoUrl || ''} onChange={handleChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address.street" className="text-right">Street</Label>
        <Input id="address.street" value={formData.address.street} onChange={handleChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address.city" className="text-right">City</Label>
        <Input id="address.city" value={formData.address.city} onChange={handleChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address.state" className="text-right">State</Label>
        <Input id="address.state" value={formData.address.state} onChange={handleChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address.zip" className="text-right">Zip</Label>
        <Input id="address.zip" value={formData.address.zip} onChange={handleChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="skills" className="text-right">Skills (comma-separated)</Label>
        <Input id="skills" value={formData.skills.join(', ')} onChange={handleChange} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="bio" className="text-right">Bio</Label>
        <Input id="bio" value={formData.bio || ''} onChange={handleChange} className="col-span-3" />
      </div>
      <DialogFooter>
        <Button type="submit">Save Employee</Button>
      </DialogFooter>
    </form>
  );
};

export default EmployeeDirectory;
