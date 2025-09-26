'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, DollarSign, PiggyBank, TrendingUp, User, Building, Phone, Mail, MapPin, Briefcase, CircleCheck as CheckCircle, Circle as XCircle, TriangleAlert as AlertTriangle, Plus, Eye, FileText, Settings, Bell, ChevronLeft, ChevronRight, Hop as Home } from 'lucide-react'
import { AttendanceCalendar } from './attendance-calendar'
import { SavingsTracker } from './savings-tracker'
import { RequestManager } from './request-manager'
import { ProfileManager } from './profile-manager'
import { NotificationCenter } from './notification-center'

interface EmployeeStats {
  attendanceRate: number
  presentDays: number
  totalDays: number
  lateDays: number
  absentDays: number
  dailySalary: number
  monthlySalary: number
  savingsBox: number
  savingsFund: number
  pendingRequests: number
  totalRequests: number
  approvedRequests: number
  rejectedRequests: number
  vacationDaysRemaining: number
  vacationDaysUsed: number
  vacationDaysTotal: number
}

export function EmployeePortal() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeView, setActiveView] = useState<'dashboard' | 'calendar' | 'savings' | 'requests' | 'profile' | 'notifications'>('dashboard')
  const [stats, setStats] = useState<EmployeeStats>({
    attendanceRate: 0,
    presentDays: 0,
    totalDays: 0,
    lateDays: 0,
    absentDays: 0,
    dailySalary: 0,
    monthlySalary: 0,
    savingsBox: 0,
    savingsFund: 0,
    pendingRequests: 0,
    totalRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    vacationDaysRemaining: 0,
    vacationDaysUsed: 0,
    vacationDaysTotal: 0
  })
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Vacation Request Approved',
      message: 'Your vacation request for October 15-17 has been approved.',
      type: 'success' as const,
      date: new Date().toISOString(),
      read: false
    },
    {
      id: '2',
      title: 'Payroll Processed',
      message: 'Your September payroll has been processed and deposited.',
      type: 'info' as const,
      date: new Date(Date.now() - 86400000).toISOString(),
      read: false
    },
    {
      id: '3',
      title: 'Savings Milestone',
      message: 'Congratulations! You have reached $25,000 in total savings.',
      type: 'success' as const,
      date: new Date(Date.now() - 172800000).toISOString(),
      read: true
    }
  ])

  useEffect(() => {
    fetchEmployeeData()
  }, [])

  const fetchEmployeeData = async () => {
    try {
      // Simulate API calls - replace with real data
      const monthlySalary = 75000 / 12 // Assuming annual salary of 75k
      const dailySalary = monthlySalary / 26 // 6-day work week
      
      setStats({
        attendanceRate: 94.2,
        presentDays: 24,
        totalDays: 26,
        lateDays: 2,
        absentDays: 2,
        dailySalary: dailySalary,
        monthlySalary: monthlySalary,
        savingsBox: 12500,
        savingsFund: 12500,
        pendingRequests: 3,
        totalRequests: 15,
        approvedRequests: 10,
        rejectedRequests: 2,
        vacationDaysRemaining: 12,
        vacationDaysUsed: 8,
        vacationDaysTotal: 20
      })
    } catch (error) {
      console.error('Error fetching employee data:', error)
    } finally {
      setLoading(false)
    }
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const unreadNotifications = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Employee Portal</h1>
                  <p className="text-sm text-gray-600">Welcome, {session?.user.name}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveView('notifications')}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <button
                onClick={() => router.push('/general/dashboard')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Main Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-4">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: Home },
              { key: 'calendar', label: 'Attendance', icon: Calendar },
              { key: 'savings', label: 'Savings', icon: PiggyBank },
              { key: 'requests', label: 'Requests', icon: FileText },
              { key: 'profile', label: 'Profile', icon: User },
              { key: 'notifications', label: 'Notifications', icon: Bell }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeView === key
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {key === 'notifications' && unreadNotifications > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 card-hover">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">
                          Attendance Rate
                        </dt>
                        <dd className="text-2xl font-bold text-gray-900 mt-1">
                          {stats.attendanceRate}%
                        </dd>
                        <dd className="text-xs text-gray-500">
                          {stats.presentDays}/{stats.totalDays} days
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 card-hover">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">
                          Monthly Salary
                        </dt>
                        <dd className="text-2xl font-bold text-gray-900 mt-1">
                          ${stats.monthlySalary.toFixed(0)}
                        </dd>
                        <dd className="text-xs text-gray-500">
                          ${stats.dailySalary.toFixed(2)} daily
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 card-hover">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <PiggyBank className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">
                          Total Savings
                        </dt>
                        <dd className="text-2xl font-bold text-gray-900 mt-1">
                          ${(stats.savingsBox + stats.savingsFund).toLocaleString()}
                        </dd>
                        <dd className="text-xs text-gray-500">
                          Personal + Company
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 card-hover">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">
                          Vacation Days
                        </dt>
                        <dd className="text-2xl font-bold text-gray-900 mt-1">
                          {stats.vacationDaysRemaining}
                        </dd>
                        <dd className="text-xs text-gray-500">
                          {stats.vacationDaysUsed} used
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
              <div className="px-6 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveView('calendar')}
                    className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-200 text-left group"
                  >
                    <Calendar className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-blue-900">View Calendar</p>
                    <p className="text-xs text-blue-700">Check attendance</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveView('savings')}
                    className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-200 text-left group"
                  >
                    <PiggyBank className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-green-900">Savings Tracker</p>
                    <p className="text-xs text-green-700">Track your savings</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveView('requests')}
                    className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-200 text-left group"
                  >
                    <FileText className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-purple-900">Submit Request</p>
                    <p className="text-xs text-purple-700">Vacation, funds, etc.</p>
                  </button>
                  
                  <button
                    onClick={() => router.push('/incidentDashboard')}
                    className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 hover:shadow-lg transition-all duration-200 text-left group"
                  >
                    <AlertTriangle className="h-8 w-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-red-900">Report Incident</p>
                    <p className="text-xs text-red-700">Safety reports</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
                <div className="px-6 py-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Perfect attendance this week</p>
                        <p className="text-xs text-green-700">6 days worked (Mon-Sat)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <DollarSign className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Payroll processed</p>
                        <p className="text-xs text-blue-700">September salary deposited</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <PiggyBank className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-purple-900">Savings milestone reached</p>
                        <p className="text-xs text-purple-700">$25,000 total savings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
                <div className="px-6 py-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Request Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-6 w-6 text-yellow-600" />
                        <div>
                          <p className="text-sm font-medium text-yellow-900">Pending Requests</p>
                          <p className="text-xs text-yellow-700">Awaiting approval</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-yellow-800">{stats.pendingRequests}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Approved Requests</p>
                          <p className="text-xs text-green-700">This year</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-800">{stats.approvedRequests}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-6 w-6 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Total Requests</p>
                          <p className="text-xs text-gray-700">All time</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-gray-800">{stats.totalRequests}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'calendar' && (
          <AttendanceCalendar stats={stats} />
        )}

        {activeView === 'savings' && (
          <SavingsTracker stats={stats} />
        )}

        {activeView === 'requests' && (
          <RequestManager />
        )}

        {activeView === 'profile' && (
          <ProfileManager />
        )}

        {activeView === 'notifications' && (
          <NotificationCenter 
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
          />
        )}
      </div>
    </div>
  )
}