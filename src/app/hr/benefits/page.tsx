'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { 
  Heart, Plus, Search, Edit, Trash2, Eye, Users, 
  DollarSign, Calendar, Shield, Activity, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EnterpriseSidebar } from '@/components/hr/enterprise-sidebar'
import { Navigation } from '@/components/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface BenefitPlan {
  id: string
  name: string
  description: string
  type: 'health' | 'dental' | 'vision' | 'life' | 'retirement' | 'other'
  provider: string
  monthlyCost: number
  employeeContribution: number
  companyContribution: number
  coverage: string[]
  eligibility: string[]
  enrolledEmployees: number
  maxEnrollment?: number
  status: 'active' | 'inactive' | 'pending'
  effectiveDate: string
  renewalDate: string
}

interface BenefitEnrollment {
  id: string
  employeeId: string
  employeeName: string
  planId: string
  planName: string
  enrollmentDate: string
  status: 'active' | 'pending' | 'cancelled'
  dependents: number
  monthlyCost: number
}

export default function BenefitsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [benefitPlans, setBenefitPlans] = useState<BenefitPlan[]>([])
  const [enrollments, setEnrollments] = useState<BenefitEnrollment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPlan, setSelectedPlan] = useState<BenefitPlan | null>(null)
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('plans')

  // Form state
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    type: 'health' as const,
    provider: '',
    monthlyCost: '',
    employeeContribution: '',
    companyContribution: '',
    coverage: '',
    eligibility: '',
    maxEnrollment: '',
    effectiveDate: '',
    renewalDate: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== Role.HR) {
      router.push('/general/dashboard')
      return
    }
    fetchBenefitsData()
  }, [session, status, router])

  const fetchBenefitsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock data - replace with real API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockBenefitPlans: BenefitPlan[] = [
        {
          id: '1',
          name: 'Premium Health Insurance',
          description: 'Comprehensive health coverage with low deductibles',
          type: 'health',
          provider: 'HealthCorp Insurance',
          monthlyCost: 450,
          employeeContribution: 150,
          companyContribution: 300,
          coverage: ['Medical consultations', 'Hospitalization', 'Emergency care', 'Prescription drugs'],
          eligibility: ['Full-time employees', 'Minimum 90 days employment'],
          enrolledEmployees: 85,
          maxEnrollment: 100,
          status: 'active',
          effectiveDate: '2024-01-01',
          renewalDate: '2024-12-31'
        },
        {
          id: '2',
          name: 'Dental Care Plan',
          description: 'Complete dental coverage including orthodontics',
          type: 'dental',
          provider: 'DentalPlus',
          monthlyCost: 75,
          employeeContribution: 25,
          companyContribution: 50,
          coverage: ['Cleanings', 'Fillings', 'Root canals', 'Orthodontics'],
          eligibility: ['All employees', 'Immediate coverage'],
          enrolledEmployees: 92,
          maxEnrollment: 120,
          status: 'active',
          effectiveDate: '2024-01-01',
          renewalDate: '2024-12-31'
        },
        {
          id: '3',
          name: 'Vision Care',
          description: 'Eye care and vision correction benefits',
          type: 'vision',
          provider: 'VisionCare Inc',
          monthlyCost: 35,
          employeeContribution: 15,
          companyContribution: 20,
          coverage: ['Eye exams', 'Glasses', 'Contact lenses', 'Laser surgery discount'],
          eligibility: ['All employees'],
          enrolledEmployees: 67,
          status: 'active',
          effectiveDate: '2024-01-01',
          renewalDate: '2024-12-31'
        },
        {
          id: '4',
          name: 'Life Insurance',
          description: 'Term life insurance coverage',
          type: 'life',
          provider: 'LifeSecure',
          monthlyCost: 25,
          employeeContribution: 0,
          companyContribution: 25,
          coverage: ['$100,000 coverage', 'Accidental death benefit'],
          eligibility: ['Full-time employees'],
          enrolledEmployees: 78,
          status: 'active',
          effectiveDate: '2024-01-01',
          renewalDate: '2024-12-31'
        }
      ]

      const mockEnrollments: BenefitEnrollment[] = [
        {
          id: '1',
          employeeId: 'emp1',
          employeeName: 'John Doe',
          planId: '1',
          planName: 'Premium Health Insurance',
          enrollmentDate: '2024-01-15',
          status: 'active',
          dependents: 2,
          monthlyCost: 450
        },
        {
          id: '2',
          employeeId: 'emp2',
          employeeName: 'Jane Smith',
          planId: '2',
          planName: 'Dental Care Plan',
          enrollmentDate: '2024-02-01',
          status: 'active',
          dependents: 1,
          monthlyCost: 75
        }
      ]

      setBenefitPlans(mockBenefitPlans)
      setEnrollments(mockEnrollments)
      
    } catch (err) {
      setError('Failed to fetch benefits data')
      console.error('Error fetching benefits data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const newPlan: BenefitPlan = {
        id: `plan-${Date.now()}`,
        name: planForm.name,
        description: planForm.description,
        type: planForm.type,
        provider: planForm.provider,
        monthlyCost: parseFloat(planForm.monthlyCost),
        employeeContribution: parseFloat(planForm.employeeContribution),
        companyContribution: parseFloat(planForm.companyContribution),
        coverage: planForm.coverage.split(',').map(c => c.trim()).filter(Boolean),
        eligibility: planForm.eligibility.split(',').map(e => e.trim()).filter(Boolean),
        enrolledEmployees: 0,
        maxEnrollment: planForm.maxEnrollment ? parseInt(planForm.maxEnrollment) : undefined,
        status: 'pending',
        effectiveDate: planForm.effectiveDate,
        renewalDate: planForm.renewalDate
      }

      setBenefitPlans(prev => [...prev, newPlan])
      setPlanForm({
        name: '',
        description: '',
        type: 'health',
        provider: '',
        monthlyCost: '',
        employeeContribution: '',
        companyContribution: '',
        coverage: '',
        eligibility: '',
        maxEnrollment: '',
        effectiveDate: '',
        renewalDate: ''
      })
      setIsAddPlanDialogOpen(false)
      
    } catch (err) {
      setError('Failed to add benefit plan')
    } finally {
      setLoading(false)
    }
  }

  const filteredPlans = benefitPlans.filter(plan => {
    const matchesSearch = 
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.provider.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || plan.type === typeFilter
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const types = Array.from(new Set(benefitPlans.map(plan => plan.type)))
  const totalEnrolled = benefitPlans.reduce((sum, plan) => sum + plan.enrolledEmployees, 0)
  const totalMonthlyCost = benefitPlans.reduce((sum, plan) => sum + (plan.monthlyCost * plan.enrolledEmployees), 0)
  const activePlans = benefitPlans.filter(plan => plan.status === 'active').length

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'health':
        return <Heart className="h-5 w-5 text-red-500" />
      case 'dental':
        return <Shield className="h-5 w-5 text-blue-500" />
      case 'vision':
        return <Eye className="h-5 w-5 text-purple-500" />
      case 'life':
        return <Users className="h-5 w-5 text-green-500" />
      case 'retirement':
        return <TrendingUp className="h-5 w-5 text-orange-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Benefits Management</h1>
              <p className="text-gray-600 mt-2">Manage employee benefit plans and enrollments</p>
            </div>
            <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benefit Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Benefit Plan</DialogTitle>
                  <DialogDescription>Create a new employee benefit plan</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPlan} className="space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <label className="text-sm font-medium">Plan Name</label>
                    <Input
                      value={planForm.name}
                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={planForm.description}
                      onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select value={planForm.type} onValueChange={(value: any) => setPlanForm({ ...planForm, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="dental">Dental</SelectItem>
                          <SelectItem value="vision">Vision</SelectItem>
                          <SelectItem value="life">Life Insurance</SelectItem>
                          <SelectItem value="retirement">Retirement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Provider</label>
                      <Input
                        value={planForm.provider}
                        onChange={(e) => setPlanForm({ ...planForm, provider: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Monthly Cost</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={planForm.monthlyCost}
                        onChange={(e) => setPlanForm({ ...planForm, monthlyCost: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Employee Share</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={planForm.employeeContribution}
                        onChange={(e) => setPlanForm({ ...planForm, employeeContribution: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Company Share</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={planForm.companyContribution}
                        onChange={(e) => setPlanForm({ ...planForm, companyContribution: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Coverage (comma-separated)</label>
                    <Textarea
                      value={planForm.coverage}
                      onChange={(e) => setPlanForm({ ...planForm, coverage: e.target.value })}
                      placeholder="Medical consultations, Hospitalization, Emergency care..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Eligibility (comma-separated)</label>
                    <Textarea
                      value={planForm.eligibility}
                      onChange={(e) => setPlanForm({ ...planForm, eligibility: e.target.value })}
                      placeholder="Full-time employees, Minimum 90 days employment..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Effective Date</label>
                      <Input
                        type="date"
                        value={planForm.effectiveDate}
                        onChange={(e) => setPlanForm({ ...planForm, effectiveDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Renewal Date</label>
                      <Input
                        type="date"
                        value={planForm.renewalDate}
                        onChange={(e) => setPlanForm({ ...planForm, renewalDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddPlanDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      Add Plan
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
                  <Heart className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{benefitPlans.length}</p>
                    <p className="text-sm text-gray-600">Total Plans</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Activity className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{activePlans}</p>
                    <p className="text-sm text-gray-600">Active Plans</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalEnrolled}</p>
                    <p className="text-sm text-gray-600">Total Enrolled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">${totalMonthlyCost.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Monthly Cost</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="plans">Benefit Plans</TabsTrigger>
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search benefit plans..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {types.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                  <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(plan.type)}
                          <div>
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <CardDescription>{plan.provider}</CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">{plan.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Enrolled:</span>
                            <span className="font-medium">
                              {plan.enrolledEmployees}{plan.maxEnrollment ? `/${plan.maxEnrollment}` : ''}
                            </span>
                          </div>
                          {plan.maxEnrollment && (
                            <Progress 
                              value={(plan.enrolledEmployees / plan.maxEnrollment) * 100} 
                              className="h-2"
                            />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Monthly Cost:</span>
                            <p className="font-medium">${plan.monthlyCost}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Employee Share:</span>
                            <p className="font-medium">${plan.employeeContribution}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPlan(plan)
                              setIsViewDialogOpen(true)
                            }}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="enrollments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Enrollments</CardTitle>
                  <CardDescription>Current benefit plan enrollments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-semibold">{enrollment.employeeName}</h4>
                          <p className="text-sm text-gray-600">{enrollment.planName}</p>
                          <p className="text-xs text-gray-500">
                            Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(enrollment.status)}>
                            {enrollment.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            {enrollment.dependents} dependents
                          </p>
                          <p className="text-sm font-medium">${enrollment.monthlyCost}/month</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* View Plan Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Benefit Plan Details</DialogTitle>
                <DialogDescription>Complete plan information</DialogDescription>
              </DialogHeader>
              {selectedPlan && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    {getTypeIcon(selectedPlan.type)}
                    <div>
                      <h3 className="text-xl font-semibold">{selectedPlan.name}</h3>
                      <p className="text-gray-600">{selectedPlan.provider}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="font-medium text-sm">Description:</span>
                        <p className="text-sm text-gray-600 mt-1">{selectedPlan.description}</p>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Type:</span>
                        <p className="text-sm text-gray-600 mt-1 capitalize">{selectedPlan.type}</p>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Enrollment:</span>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedPlan.enrolledEmployees} enrolled
                          {selectedPlan.maxEnrollment && ` of ${selectedPlan.maxEnrollment} max`}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="font-medium text-sm">Monthly Cost:</span>
                        <p className="text-sm text-gray-600 mt-1">${selectedPlan.monthlyCost}</p>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Employee Contribution:</span>
                        <p className="text-sm text-gray-600 mt-1">${selectedPlan.employeeContribution}</p>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Company Contribution:</span>
                        <p className="text-sm text-gray-600 mt-1">${selectedPlan.companyContribution}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-sm">Coverage:</span>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {selectedPlan.coverage.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <span className="font-medium text-sm">Eligibility Requirements:</span>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {selectedPlan.eligibility.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Effective Date:</span>
                      <p className="text-gray-600">{new Date(selectedPlan.effectiveDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Renewal Date:</span>
                      <p className="text-gray-600">{new Date(selectedPlan.renewalDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}