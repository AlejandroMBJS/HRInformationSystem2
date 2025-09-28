'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Calendar, DollarSign, FileText, Plus, Clock, CheckCircle, 
  XCircle, AlertCircle, Send, Eye, Edit, Trash2, Filter, Search 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface VacationRequest {
  id: string
  startDate: string
  endDate: string
  daysRequested: number
  reason?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  approvedBy?: string
  approvedAt?: string
}

interface FundRequest {
  id: string
  fundType: 'TRAVEL' | 'TRAINING' | 'EQUIPMENT' | 'MEDICAL' | 'EMERGENCY' | 'OTHER'
  amount: number
  reason: string
  requestType: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  approvedBy?: string
  approvedAt?: string
}

interface GeneralRequest {
  id: string
  requestType: string
  subject: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED'
  createdAt: string
  assignedTo?: string
}

export function RequestManager() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Request states
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([])
  const [fundRequests, setFundRequests] = useState<FundRequest[]>([])
  const [generalRequests, setGeneralRequests] = useState<GeneralRequest[]>([])
  
  // Form states
  const [vacationForm, setVacationForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  })
  const [fundForm, setFundForm] = useState({
    fundType: 'TRAVEL' as const,
    amount: '',
    reason: '',
    requestType: ''
  })
  const [generalForm, setGeneralForm] = useState({
    requestType: '',
    subject: '',
    description: '',
    priority: 'MEDIUM' as const
  })

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('vacation')

  // Dialog states
  const [isVacationDialogOpen, setIsVacationDialogOpen] = useState(false)
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false)
  const [isGeneralDialogOpen, setIsGeneralDialogOpen] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock data - replace with real API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockVacationRequests: VacationRequest[] = [
        {
          id: 'v1',
          startDate: '2024-12-20',
          endDate: '2024-12-27',
          daysRequested: 6,
          reason: 'End of year holidays',
          status: 'PENDING',
          createdAt: '2024-09-20T10:00:00Z'
        },
        {
          id: 'v2',
          startDate: '2024-11-15',
          endDate: '2024-11-17',
          daysRequested: 3,
          reason: 'Family event',
          status: 'APPROVED',
          createdAt: '2024-09-15T14:30:00Z',
          approvedBy: 'Manager',
          approvedAt: '2024-09-16T09:00:00Z'
        }
      ]

      const mockFundRequests: FundRequest[] = [
        {
          id: 'f1',
          fundType: 'EQUIPMENT',
          amount: 1500,
          reason: 'New laptop for development work',
          requestType: 'Equipment Purchase',
          status: 'PENDING',
          createdAt: '2024-09-22T11:00:00Z'
        }
      ]

      const mockGeneralRequests: GeneralRequest[] = [
        {
          id: 'g1',
          requestType: 'IT Support',
          subject: 'Network connectivity issues',
          description: 'Having trouble connecting to the company VPN from home office',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          createdAt: '2024-09-21T16:00:00Z',
          assignedTo: 'IT Team'
        }
      ]

      setVacationRequests(mockVacationRequests)
      setFundRequests(mockFundRequests)
      setGeneralRequests(mockGeneralRequests)
      
    } catch (err) {
      setError('Failed to fetch requests')
      console.error('Error fetching requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const submitVacationRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      // Calculate days requested
      const start = new Date(vacationForm.startDate)
      const end = new Date(vacationForm.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const daysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

      const newRequest: VacationRequest = {
        id: `v${Date.now()}`,
        ...vacationForm,
        daysRequested,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }

      setVacationRequests(prev => [newRequest, ...prev])
      setVacationForm({ startDate: '', endDate: '', reason: '' })
      setIsVacationDialogOpen(false)
      
    } catch (err) {
      setError('Failed to submit vacation request')
    } finally {
      setLoading(false)
    }
  }

  const submitFundRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const newRequest: FundRequest = {
        id: `f${Date.now()}`,
        ...fundForm,
        amount: parseFloat(fundForm.amount),
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }

      setFundRequests(prev => [newRequest, ...prev])
      setFundForm({ fundType: 'TRAVEL', amount: '', reason: '', requestType: '' })
      setIsFundDialogOpen(false)
      
    } catch (err) {
      setError('Failed to submit fund request')
    } finally {
      setLoading(false)
    }
  }

  const submitGeneralRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const newRequest: GeneralRequest = {
        id: `g${Date.now()}`,
        ...generalForm,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }

      setGeneralRequests(prev => [newRequest, ...prev])
      setGeneralForm({ requestType: '', subject: '', description: '', priority: 'MEDIUM' })
      setIsGeneralDialogOpen(false)
      
    } catch (err) {
      setError('Failed to submit general request')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'IN_PROGRESS':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const allRequests = [
    ...vacationRequests.map(req => ({ ...req, type: 'vacation' })),
    ...fundRequests.map(req => ({ ...req, type: 'fund' })),
    ...generalRequests.map(req => ({ ...req, type: 'general' }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const filteredRequests = allRequests.filter(request => {
    const matchesSearch = 
      (request.type === 'vacation' && request.reason?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.type === 'fund' && (request.reason.toLowerCase().includes(searchTerm.toLowerCase()) || request.requestType.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (request.type === 'general' && (request.subject.toLowerCase().includes(searchTerm.toLowerCase()) || request.description.toLowerCase().includes(searchTerm.toLowerCase())))
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const pendingCount = allRequests.filter(req => req.status === 'PENDING').length
  const approvedCount = allRequests.filter(req => req.status === 'APPROVED').length
  const totalCount = allRequests.length

  if (loading && allRequests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Request Manager</h2>
        <p className="text-gray-600 mt-2">Submit and track your requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                <p className="text-sm text-gray-600">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
                <p className="text-sm text-gray-600">Approved Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Submit new requests quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Dialog open={isVacationDialogOpen} onOpenChange={setIsVacationDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-20 flex flex-col space-y-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                  <Calendar className="h-6 w-6" />
                  <span>Request Vacation</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Vacation Days</DialogTitle>
                  <DialogDescription>Submit a new vacation request</DialogDescription>
                </DialogHeader>
                <form onSubmit={submitVacationRequest} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input
                        type="date"
                        value={vacationForm.startDate}
                        onChange={(e) => setVacationForm({ ...vacationForm, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input
                        type="date"
                        value={vacationForm.endDate}
                        onChange={(e) => setVacationForm({ ...vacationForm, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reason (Optional)</label>
                    <Textarea
                      value={vacationForm.reason}
                      onChange={(e) => setVacationForm({ ...vacationForm, reason: e.target.value })}
                      placeholder="Reason for vacation..."
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsVacationDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isFundDialogOpen} onOpenChange={setIsFundDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-20 flex flex-col space-y-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                  <DollarSign className="h-6 w-6" />
                  <span>Request Funds</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Funds</DialogTitle>
                  <DialogDescription>Submit a new fund request</DialogDescription>
                </DialogHeader>
                <form onSubmit={submitFundRequest} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Fund Type</label>
                      <Select value={fundForm.fundType} onValueChange={(value: any) => setFundForm({ ...fundForm, fundType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TRAVEL">Travel</SelectItem>
                          <SelectItem value="TRAINING">Training</SelectItem>
                          <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                          <SelectItem value="MEDICAL">Medical</SelectItem>
                          <SelectItem value="EMERGENCY">Emergency</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Amount</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={fundForm.amount}
                        onChange={(e) => setFundForm({ ...fundForm, amount: e.target.value })}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Request Type</label>
                    <Input
                      value={fundForm.requestType}
                      onChange={(e) => setFundForm({ ...fundForm, requestType: e.target.value })}
                      placeholder="e.g., Conference attendance, Equipment purchase"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reason</label>
                    <Textarea
                      value={fundForm.reason}
                      onChange={(e) => setFundForm({ ...fundForm, reason: e.target.value })}
                      placeholder="Detailed reason for fund request..."
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsFundDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isGeneralDialogOpen} onOpenChange={setIsGeneralDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-20 flex flex-col space-y-2 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
                  <FileText className="h-6 w-6" />
                  <span>General Request</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>General Request</DialogTitle>
                  <DialogDescription>Submit a general request</DialogDescription>
                </DialogHeader>
                <form onSubmit={submitGeneralRequest} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Request Type</label>
                      <Input
                        value={generalForm.requestType}
                        onChange={(e) => setGeneralForm({ ...generalForm, requestType: e.target.value })}
                        placeholder="e.g., IT Support"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select value={generalForm.priority} onValueChange={(value: any) => setGeneralForm({ ...generalForm, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      value={generalForm.subject}
                      onChange={(e) => setGeneralForm({ ...generalForm, subject: e.target.value })}
                      placeholder="Brief subject"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={generalForm.description}
                      onChange={(e) => setGeneralForm({ ...generalForm, description: e.target.value })}
                      placeholder="Detailed description..."
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsGeneralDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests ({filteredRequests.length})</CardTitle>
          <CardDescription>Your submitted requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No requests found</p>
                <p className="text-gray-400 text-sm mt-1">Submit your first request using the quick actions above</p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div key={`${request.type}-${request.id}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(request.status)}
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {request.type} Request
                        </h4>
                        <Badge variant="outline" className="capitalize">
                          {request.type}
                        </Badge>
                      </div>
                      
                      {request.type === 'vacation' && (
                        <div>
                          <p className="text-sm text-gray-600">
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">{request.daysRequested} days requested</p>
                          {request.reason && <p className="text-sm text-gray-700 mt-1">{request.reason}</p>}
                        </div>
                      )}
                      
                      {request.type === 'fund' && (
                        <div>
                          <p className="text-sm text-gray-600">{request.fundType} - ${request.amount}</p>
                          <p className="text-sm text-gray-600">{request.requestType}</p>
                          <p className="text-sm text-gray-700 mt-1">{request.reason}</p>
                        </div>
                      )}
                      
                      {request.type === 'general' && (
                        <div>
                          <p className="text-sm text-gray-600">{request.requestType}</p>
                          <p className="font-medium text-gray-900">{request.subject}</p>
                          <p className="text-sm text-gray-700 mt-1">{request.description}</p>
                          <Badge variant="outline" className={`mt-2 ${
                            request.priority === 'URGENT' ? 'border-red-200 text-red-700' :
                            request.priority === 'HIGH' ? 'border-orange-200 text-orange-700' :
                            request.priority === 'MEDIUM' ? 'border-yellow-200 text-yellow-700' :
                            'border-gray-200 text-gray-700'
                          }`}>
                            {request.priority}
                          </Badge>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === 'PENDING' && (
                          <>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}