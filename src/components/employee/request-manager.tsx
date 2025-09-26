'use client'

import { useState } from 'react'
import {
  Calendar,
  DollarSign,
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Building
} from 'lucide-react'
import { RequestStatus, FundType, Priority } from '@prisma/client'

interface VacationRequest {
  id: string
  startDate: string
  endDate: string
  daysRequested: number
  reason?: string
  status: RequestStatus
  createdAt: string
  approvedBy?: string
  approvedAt?: string
}

interface FundRequest {
  id: string
  fundType: FundType
  amount: number
  reason: string
  requestType: string
  status: RequestStatus
  createdAt: string
  approvedBy?: string
  approvedAt?: string
}

interface GeneralRequest {
  id: string
  requestType: string
  subject: string
  description: string
  priority: Priority
  status: RequestStatus
  createdAt: string
  assignedTo?: string
}

export function RequestManager() {
  const [activeTab, setActiveTab] = useState<'vacation' | 'fund' | 'general'>('vacation')
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  
  // Mock data
  const [vacationRequests] = useState<VacationRequest[]>([
    {
      id: '1',
      startDate: '2024-12-20',
      endDate: '2024-12-27',
      daysRequested: 8,
      reason: 'End of year holidays',
      status: RequestStatus.PENDING,
      createdAt: '2024-09-20T10:00:00Z'
    },
    {
      id: '2',
      startDate: '2024-10-15',
      endDate: '2024-10-17',
      daysRequested: 3,
      reason: 'Family event',
      status: RequestStatus.APPROVED,
      createdAt: '2024-09-10T14:30:00Z',
      approvedBy: 'Manager',
      approvedAt: '2024-09-12T09:15:00Z'
    }
  ])

  const [fundRequests] = useState<FundRequest[]>([
    {
      id: '1',
      fundType: FundType.EMERGENCY,
      amount: 2000,
      reason: 'Medical emergency - hospital bills',
      requestType: 'Emergency Fund',
      status: RequestStatus.APPROVED,
      createdAt: '2024-09-15T16:20:00Z',
      approvedBy: 'HR Manager',
      approvedAt: '2024-09-16T10:30:00Z'
    }
  ])

  const [generalRequests] = useState<GeneralRequest[]>([
    {
      id: '1',
      requestType: 'IT Support',
      subject: 'Laptop replacement needed',
      description: 'My current laptop is running very slowly and affecting my productivity.',
      priority: Priority.HIGH,
      status: RequestStatus.PENDING,
      createdAt: '2024-09-22T11:45:00Z'
    }
  ])

  // Form states
  const [vacationForm, setVacationForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  })
  const [fundForm, setFundForm] = useState({
    fundType: FundType.TRAVEL,
    amount: '',
    reason: '',
    requestType: ''
  })
  const [generalForm, setGeneralForm] = useState({
    requestType: '',
    subject: '',
    description: '',
    priority: Priority.MEDIUM
  })

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.APPROVED:
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case RequestStatus.REJECTED:
        return <XCircle className="h-4 w-4 text-red-500" />
      case RequestStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.APPROVED:
        return 'bg-green-100 text-green-800'
      case RequestStatus.REJECTED:
        return 'bg-red-100 text-red-800'
      case RequestStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const submitVacationRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would submit to API
    alert('Vacation request submitted successfully!')
    setShowNewRequestForm(false)
    setVacationForm({ startDate: '', endDate: '', reason: '' })
  }

  const submitFundRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would submit to API
    alert('Fund request submitted successfully!')
    setShowNewRequestForm(false)
    setFundForm({ fundType: FundType.TRAVEL, amount: '', reason: '', requestType: '' })
  }

  const submitGeneralRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would submit to API
    alert('General request submitted successfully!')
    setShowNewRequestForm(false)
    setGeneralForm({ requestType: '', subject: '', description: '', priority: Priority.MEDIUM })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Request Manager</h2>
          <p className="text-gray-600 mt-2">Submit and track your requests</p>
        </div>
        <button
          onClick={() => setShowNewRequestForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 p-1 bg-gray-50">
            {[
              { key: 'vacation', label: 'Vacation', icon: Calendar },
              { key: 'fund', label: 'Fund Requests', icon: DollarSign },
              { key: 'general', label: 'General', icon: FileText }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'vacation' && (
            <div className="space-y-6">
              {vacationRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(request.status)}
                        <h4 className="text-lg font-semibold text-gray-900">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {request.daysRequested} days • Submitted {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      {request.reason && (
                        <p className="text-sm text-gray-700 mt-3 bg-gray-50 rounded-lg p-3">{request.reason}</p>
                      )}
                      {request.approvedBy && (
                        <p className="text-xs text-green-600 mt-2">
                          Approved by {request.approvedBy} on {new Date(request.approvedAt!).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'fund' && (
            <div className="space-y-6">
              {fundRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(request.status)}
                        <h4 className="text-lg font-semibold text-gray-900">
                          {request.fundType} - ${request.amount.toLocaleString()}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {request.requestType} • Submitted {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700 mt-3 bg-gray-50 rounded-lg p-3">{request.reason}</p>
                      {request.approvedBy && (
                        <p className="text-xs text-green-600 mt-2">
                          Approved by {request.approvedBy} on {new Date(request.approvedAt!).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-6">
              {generalRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(request.status)}
                        <h4 className="text-lg font-semibold text-gray-900">{request.subject}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          request.priority === Priority.URGENT ? 'bg-red-100 text-red-800' :
                          request.priority === Priority.HIGH ? 'bg-orange-100 text-orange-800' :
                          request.priority === Priority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {request.requestType} • Submitted {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{request.description}</p>
                    </div>
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(request.status)} ml-4`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Request Form Modal */}
      {showNewRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Submit New Request</h3>
              <button
                onClick={() => setShowNewRequestForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {/* Request Type Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'vacation', label: 'Vacation', icon: Calendar },
                { key: 'fund', label: 'Fund', icon: DollarSign },
                { key: 'general', label: 'General', icon: FileText }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 flex-1 justify-center ${
                    activeTab === key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Forms */}
            {activeTab === 'vacation' && (
              <form onSubmit={submitVacationRequest} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={vacationForm.startDate}
                      onChange={(e) => setVacationForm({ ...vacationForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={vacationForm.endDate}
                      onChange={(e) => setVacationForm({ ...vacationForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                  <textarea
                    value={vacationForm.reason}
                    onChange={(e) => setVacationForm({ ...vacationForm, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Reason for vacation request..."
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewRequestForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'fund' && (
              <form onSubmit={submitFundRequest} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fund Type</label>
                    <select
                      value={fundForm.fundType}
                      onChange={(e) => setFundForm({ ...fundForm, fundType: e.target.value as FundType })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(FundType).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={fundForm.amount}
                      onChange={(e) => setFundForm({ ...fundForm, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                  <input
                    type="text"
                    value={fundForm.requestType}
                    onChange={(e) => setFundForm({ ...fundForm, requestType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Conference attendance, Equipment purchase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <textarea
                    value={fundForm.reason}
                    onChange={(e) => setFundForm({ ...fundForm, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Detailed reason for fund request..."
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewRequestForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'general' && (
              <form onSubmit={submitGeneralRequest} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                    <input
                      type="text"
                      value={generalForm.requestType}
                      onChange={(e) => setGeneralForm({ ...generalForm, requestType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., IT Support, Office Supplies"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={generalForm.priority}
                      onChange={(e) => setGeneralForm({ ...generalForm, priority: e.target.value as Priority })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(Priority).map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={generalForm.subject}
                    onChange={(e) => setGeneralForm({ ...generalForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief subject of your request"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={generalForm.description}
                    onChange={(e) => setGeneralForm({ ...generalForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Detailed description of your request..."
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewRequestForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}