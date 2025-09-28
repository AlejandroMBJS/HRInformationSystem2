'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Users, Plus, Search, Edit, Trash2, Eye, Filter, Download,
  Building, Mail, Phone, Calendar, DollarSign, UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EnterpriseSidebar } from '@/components/hr/enterprise-sidebar'
import { Navigation } from '@/components/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface Employee {
  id: string
  employeeCode: string
  firstName: string
  lastName: string
  position?: string
  department?: string
  hireDate?: string
  salary?: number
  phone?: string
  address?: string
  emergencyContact?: string
  user: {
    id: string
    email: string
    name?: string
    role: Role
  }
}

export default function EmployeesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Form state
  const [employeeForm, setEmployeeForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    phone: '',
    address: '',
    emergencyContact: '',
    salary: '',
    role: 'EMPLOYEE' as Role
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== Role.HR) {
      router.push('/general/dashboard')
      return
    }
    fetchEmployees()
  }, [session, status, router])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to fetch from API, fallback to mock data
      try {
        const response = await fetch('/api/employees')
        if (response.ok) {
          const data = await response.json()
          setEmployees(data.employees)
          return
        }
      } catch (apiError) {
        console.log('API not available, using mock data')
      }
      
      // Mock data fallback
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockEmployees: Employee[] = [
        {
          id: '1',
          employeeCode: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          position: 'Software Developer',
          department: 'Engineering',
          hireDate: '2023-01-15',
          salary: 75000,
          phone: '+1-555-0123',
          address: '123 Main St, City, State 12345',
          emergencyContact: 'Jane Doe - +1-555-0124',
          user: {
            id: '1',
            email: 'john.doe@company.com',
            name: 'John Doe',
            role: Role.EMPLOYEE
          }
        },
        {
          id: '2',
          employeeCode: 'EMP002',
          firstName: 'Jane',
          lastName: 'Smith',
          position: 'UX Designer',
          department: 'Design',
          hireDate: '2023-03-20',
          salary: 70000,
          phone: '+1-555-0125',
          address: '456 Oak Ave, City, State 12345',
          emergencyContact: 'Bob Smith - +1-555-0126',
          user: {
            id: '2',
            email: 'jane.smith@company.com',
            name: 'Jane Smith',
            role: Role.EMPLOYEE
          }
        },
        {
          id: '3',
          employeeCode: 'MGR001',
          firstName: 'Michael',
          lastName: 'Johnson',
          position: 'Engineering Manager',
          department: 'Engineering',
          hireDate: '2022-06-10',
          salary: 95000,
          phone: '+1-555-0127',
          address: '789 Pine St, City, State 12345',
          emergencyContact: 'Lisa Johnson - +1-555-0128',
          user: {
            id: '3',
            email: 'michael.johnson@company.com',
            name: 'Michael Johnson',
            role: Role.MANAGER
          }
        }
      ]
      setEmployees(mockEmployees)
      
    } catch (err) {
      setError('Failed to fetch employees')
      console.error('Error fetching employees:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const newEmployee: Employee = {
        id: `emp-${Date.now()}`,
        employeeCode: `EMP${String(employees.length + 1).padStart(3, '0')}`,
        firstName: employeeForm.firstName,
        lastName: employeeForm.lastName,
        position: employeeForm.position,
        department: employeeForm.department,
        phone: employeeForm.phone,
        address: employeeForm.address,
        emergencyContact: employeeForm.emergencyContact,
        salary: employeeForm.salary ? parseFloat(employeeForm.salary) : undefined,
        hireDate: new Date().toISOString().split('T')[0],
        user: {
          id: `user-${Date.now()}`,
          email: employeeForm.email,
          name: `${employeeForm.firstName} ${employeeForm.lastName}`,
          role: employeeForm.role
        }
      }

      setEmployees(prev => [...prev, newEmployee])
      setEmployeeForm({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        department: '',
        phone: '',
        address: '',
        emergencyContact: '',
        salary: '',
        role: 'EMPLOYEE'
      })
      setIsAddDialogOpen(false)
      
    } catch (err) {
      setError('Failed to add employee')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id))
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter
    const matchesRole = roleFilter === 'all' || employee.user.role === roleFilter
    
    return matchesSearch && matchesDepartment && matchesRole
  })

  const departments = Array.from(new Set(employees.map(emp => emp.department).filter(Boolean)))
  const roles = Array.from(new Set(employees.map(emp => emp.user.role)))

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session || session.user.role !== Role.HR) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 flex-shrink-0 bg-white min-h-screen">
        <EnterpriseSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8">
        <Navigation />
        
        <div className="mt-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
              <p className="text-gray-600 mt-2">Manage company employees and their information</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>Fill in the employee details</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddEmployee} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <Input
                        value={employeeForm.firstName}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <Input
                        value={employeeForm.lastName}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Position</label>
                      <Input
                        value={employeeForm.position}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Department</label>
                      <Input
                        value={employeeForm.department}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={employeeForm.phone}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <Select value={employeeForm.role} onValueChange={(value: Role) => setEmployeeForm({ ...employeeForm, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMPLOYEE">Employee</SelectItem>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      Add Employee
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                    <p className="text-sm text-gray-600">Total Employees</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Building className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                    <p className="text-sm text-gray-600">Departments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {employees.filter(emp => emp.user.role === Role.MANAGER).length}
                    </p>
                    <p className="text-sm text-gray-600">Managers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      ${Math.round(employees.reduce((sum, emp) => sum + (emp.salary || 0), 0) / 1000)}K
                    </p>
                    <p className="text-sm text-gray-600">Total Payroll</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Employees Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
              <CardDescription>Manage your company employees</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
              
              <div className="space-y-4">
                {filteredEmployees.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No employees found</p>
                    <p className="text-gray-400 text-sm mt-1">Add your first employee to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredEmployees.map((employee) => (
                      <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>
                                {getInitials(employee.firstName, employee.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {employee.firstName} {employee.lastName}
                              </h3>
                              <p className="text-sm text-gray-600">{employee.position || 'No position'}</p>
                              <p className="text-sm text-gray-500">{employee.employeeCode}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant={
                                  employee.user.role === Role.ADMIN ? 'destructive' :
                                  employee.user.role === Role.HR ? 'default' :
                                  employee.user.role === Role.MANAGER ? 'secondary' :
                                  'outline'
                                }>
                                  {employee.user.role}
                                </Badge>
                                {employee.department && (
                                  <Badge variant="outline">{employee.department}</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span className="truncate">{employee.user.email}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedEmployee(employee)
                                  setIsViewDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedEmployee(employee)
                                  setEmployeeForm({
                                    firstName: employee.firstName,
                                    lastName: employee.lastName,
                                    email: employee.user.email,
                                    position: employee.position || '',
                                    department: employee.department || '',
                                    phone: employee.phone || '',
                                    address: employee.address || '',
                                    emergencyContact: employee.emergencyContact || '',
                                    salary: employee.salary?.toString() || '',
                                    role: employee.user.role
                                  })
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteEmployee(employee.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* View Employee Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Employee Details</DialogTitle>
                <DialogDescription>Complete employee information</DialogDescription>
              </DialogHeader>
              {selectedEmployee && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedEmployee.firstName} {selectedEmployee.lastName}
                      </h3>
                      <p className="text-gray-600">{selectedEmployee.position}</p>
                      <Badge variant="outline">{selectedEmployee.user.role}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedEmployee.user.email}</span>
                      </div>
                      {selectedEmployee.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{selectedEmployee.phone}</span>
                        </div>
                      )}
                      {selectedEmployee.hireDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Hired: {new Date(selectedEmployee.hireDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {selectedEmployee.department && (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span>{selectedEmployee.department}</span>
                        </div>
                      )}
                      {selectedEmployee.salary && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span>${selectedEmployee.salary.toLocaleString()}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Employee Code:</span>
                        <span className="ml-2">{selectedEmployee.employeeCode}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedEmployee.address && (
                    <div>
                      <span className="font-medium text-sm">Address:</span>
                      <p className="text-sm text-gray-600 mt-1">{selectedEmployee.address}</p>
                    </div>
                  )}
                  
                  {selectedEmployee.emergencyContact && (
                    <div>
                      <span className="font-medium text-sm">Emergency Contact:</span>
                      <p className="text-sm text-gray-600 mt-1">{selectedEmployee.emergencyContact}</p>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Employee Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Employee</DialogTitle>
                <DialogDescription>Update employee information</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      value={employeeForm.firstName}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      value={employeeForm.lastName}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Position</label>
                    <Input
                      value={employeeForm.position}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Department</label>
                    <Input
                      value={employeeForm.department}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}