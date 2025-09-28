import React, { useState, useEffect, useMemo } from 'react';
import { mockEmployees, mockEmployeeSummaries } from './lib/mockData';
import { Employee, PerformanceMetric, EmployeePerformanceSummary, FilterOptions, SortOptions } from './lib/types';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Label } from './components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpDown, PlusCircle, Search, Edit, Trash2 } from 'lucide-react';

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const EmployeeAnalyticsDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeSummaries, setEmployeeSummaries] = useState<EmployeePerformanceSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOptions>({ key: 'firstName', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEmployees(mockEmployees);
        setEmployeeSummaries(mockEmployeeSummaries);
      } catch (err) {
        setError('Failed to fetch employee data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (key: keyof FilterOptions, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const handleSort = (key: SortOptions['key']) => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(emp =>
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.department) {
      filtered = filtered.filter(emp => emp.department === filters.department);
    }
    if (filters.role) {
      filtered = filtered.filter(emp => emp.role === filters.role);
    }
    if (filters.status) {
      filtered = filtered.filter(emp => emp.status === filters.status);
    }
    if (filters.minPerformanceScore !== undefined) {
      filtered = filtered.filter(emp => emp.performanceScore >= (filters.minPerformanceScore || 0));
    }
    if (filters.maxPerformanceScore !== undefined) {
      filtered = filtered.filter(emp => emp.performanceScore <= (filters.maxPerformanceScore || 100));
    }

    return filtered.sort((a, b) => {
      const aValue = (a as any)[sort.key] !== undefined ? (a as any)[sort.key] : (employeeSummaries.find(s => s.employeeId === a.id)?.[sort.key as keyof EmployeePerformanceSummary] || 0);
      const bValue = (b as any)[sort.key] !== undefined ? (b as any)[sort.key] : (employeeSummaries.find(s => s.employeeId === b.id)?.[sort.key as keyof EmployeePerformanceSummary] || 0);

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [employees, employeeSummaries, filters, sort, searchTerm]);

  const handleAddEditEmployee = (employeeData: Employee) => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(emp => (emp.id === employeeData.id ? employeeData : emp)));
    } else {
      setEmployees(prev => [...prev, { ...employeeData, id: generateUUID() }]);
    }
    setIsAddEditModalOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setEmployeeSummaries(prev => prev.filter(summary => summary.employeeId !== id));
  };

  const getEmployeeSummary = (employeeId: string) => {
    return employeeSummaries.find(summary => summary.employeeId === employeeId);
  };

  if (loading) return <div className="p-4 text-center">Loading employee data...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  const departments = Array.from(new Set(mockEmployees.map(emp => emp.department)));
  const roles = Array.from(new Set(mockEmployees.map(emp => emp.role)));

  return (
    <div className="container mx-auto p-4 space-y-6" aria-label="Employee Analytics Dashboard">
      <h1 className="text-3xl font-bold mb-6">Employee Analytics Dashboard</h1>

      {/* Dashboard Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search employees..."
            className="pl-9 pr-3 py-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search employees by name, email, department, or role"
          />
        </div>
        <div className="flex gap-4 w-full md:w-2/3 justify-end">
          <Select onValueChange={(value) => handleFilterChange('department', value)} value={filters.department || ''}>
            <SelectTrigger className="w-[180px]" aria-label="Filter by Department">
              <SelectValue placeholder="Filter by Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange('status', value)} value={filters.status || ''}>
            <SelectTrigger className="w-[180px]" aria-label="Filter by Status">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => { setEditingEmployee(null); setIsAddEditModalOpen(true); }}
            className="flex items-center gap-2"
            aria-label="Add New Employee"
          >
            <PlusCircle className="h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('firstName')} aria-sort={sort.key === 'firstName' ? sort.direction : 'none'}>
                Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('department')} aria-sort={sort.key === 'department' ? sort.direction : 'none'}>
                Department <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('role')} aria-sort={sort.key === 'role' ? sort.direction : 'none'}>
                Role <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')} aria-sort={sort.key === 'status' ? sort.direction : 'none'}>
                Status <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('performanceScore')} aria-sort={sort.key === 'performanceScore' ? sort.direction : 'none'}>
                Score <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">No employees found.</TableCell>
              </TableRow>
            ) : (
              filteredAndSortedEmployees.map(employee => {
                const summary = getEmployeeSummary(employee.id);
                return (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.firstName} {employee.lastName}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.status}</TableCell>
                    <TableCell>{employee.performanceScore}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setEditingEmployee(employee); setIsAddEditModalOpen(true); }}
                        className="mr-2"
                        aria-label={`Edit ${employee.firstName} ${employee.lastName}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEmployee(employee.id)}
                        aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Performance Trends Chart */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Performance Trends</h2>
      <div className="bg-white p-4 rounded-md shadow-sm h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={employeeSummaries.flatMap(s => s.trends.map(t => ({ ...t, employeeId: s.employeeId }))).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {/* Dynamically add lines for each employee or a representative average */}
            {/* For simplicity, let's just show a general trend or first few employees */}
            {employeeSummaries.slice(0, 3).map((summary, index) => (
              <Line
                key={summary.employeeId}
                type="monotone"
                dataKey="score"
                data={summary.trends}
                name={`${employees.find(e => e.id === summary.employeeId)?.firstName} ${employees.find(e => e.id === summary.employeeId)?.lastName}`}
                stroke={['#8884d8', '#82ca9d', '#ffc658'][index % 3]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Add/Edit Employee Modal */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
            <DialogDescription>
              {editingEmployee ? 'Make changes to employee details here.' : 'Fill in the details for the new employee.'}
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
            initialData={editingEmployee}
            onSubmit={handleAddEditEmployee}
            onCancel={() => setIsAddEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface EmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (data: Employee) => void;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Employee>(initialData || {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: '',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'active',
    performanceScore: 75,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'performanceScore' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const departments = Array.from(new Set(mockEmployees.map(emp => emp.department)));
  const roles = Array.from(new Set(mockEmployees.map(emp => emp.role)));

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="firstName" className="text-right">First Name</Label>
        <Input id="firstName" value={formData.firstName} onChange={handleChange} className="col-span-3" required aria-label="First Name" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="lastName" className="text-right">Last Name</Label>
        <Input id="lastName" value={formData.lastName} onChange={handleChange} className="col-span-3" required aria-label="Last Name" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">Email</Label>
        <Input id="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" required aria-label="Email" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="department" className="text-right">Department</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))} value={formData.department}>
          <SelectTrigger className="col-span-3" aria-label="Department">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">Role</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))} value={formData.role}>
          <SelectTrigger className="col-span-3" aria-label="Role">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="hireDate" className="text-right">Hire Date</Label>
        <Input id="hireDate" type="date" value={formData.hireDate} onChange={handleChange} className="col-span-3" required aria-label="Hire Date" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">Status</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' | 'on_leave' }))} value={formData.status}>
          <SelectTrigger className="col-span-3" aria-label="Status">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="performanceScore" className="text-right">Performance Score</Label>
        <Input id="performanceScore" type="number" value={formData.performanceScore} onChange={handleChange} className="col-span-3" min={0} max={100} aria-label="Performance Score" />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{editingEmployee ? 'Save Changes' : 'Add Employee'}</Button>
      </div>
    </form>
  );
};

export default EmployeeAnalyticsDashboard;
