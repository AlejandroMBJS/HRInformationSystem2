'use client'

import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, CircleCheck as CheckCircle, Circle as XCircle, Clock, TrendingUp, Users, CircleAlert as AlertCircle } from 'lucide-react'

interface AttendanceData {
  date: string
  status: 'present' | 'absent' | 'late' | 'weekend' | 'holiday'
  checkIn?: string
  checkOut?: string
  hoursWorked?: number
  notes?: string
}

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

interface AttendanceCalendarProps {
  stats: EmployeeStats
}

export function AttendanceCalendar({ stats }: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const generateCalendarData = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    
    const calendarData: AttendanceData[] = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      calendarData.push({
        date: '',
        status: 'weekend'
      })
    }
    
    // Generate days with attendance data
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayOfWeek = date.getDay()
      const dateString = date.toISOString().split('T')[0]
      
      // Skip Sundays (6-day work week)
      if (dayOfWeek === 0) {
        calendarData.push({
          date: dateString,
          status: 'weekend'
        })
        continue
      }
      
      // Mock attendance data
      const rand = Math.random()
      let status: AttendanceData['status'] = 'present'
      let checkIn = '09:00'
      let checkOut = '18:00'
      let hoursWorked = 9
      
      if (rand < 0.05) {
        status = 'absent'
        checkIn = undefined
        checkOut = undefined
        hoursWorked = 0
      } else if (rand < 0.1) {
        status = 'late'
        checkIn = '09:15'
        hoursWorked = 8.75
      }
      
      calendarData.push({
        date: dateString,
        status,
        checkIn,
        checkOut,
        hoursWorked,
        notes: status === 'late' ? 'Traffic delay' : status === 'absent' ? 'Sick leave' : undefined
      })
    }
    
    return calendarData
  }

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const getStatusColor = (status: AttendanceData['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
      case 'weekend':
        return 'bg-gray-100 text-gray-400 border-gray-200'
      case 'holiday':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-50 text-gray-400 border-gray-200'
    }
  }

  const getStatusIcon = (status: AttendanceData['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-3 h-3" />
      case 'late':
        return <Clock className="w-3 h-3" />
      case 'absent':
        return <XCircle className="w-3 h-3" />
      default:
        return null
    }
  }

  const calendarData = generateCalendarData()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const selectedAttendance = selectedDate 
    ? calendarData.find(data => data.date === selectedDate)
    : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Attendance Calendar</h2>
        <p className="text-gray-600 mt-2">Track your daily attendance and work hours</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.presentDays}</p>
              <p className="text-sm text-gray-600">Present Days</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.lateDays}</p>
              <p className="text-sm text-gray-600">Late Arrivals</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <XCircle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.absentDays}</p>
              <p className="text-sm text-gray-600">Absent Days</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</p>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((dayData, index) => {
              const day = dayData.date ? new Date(dayData.date).getDate() : null
              
              return (
                <div key={index} className="aspect-square">
                  {day ? (
                    <button
                      onClick={() => setSelectedDate(dayData.date)}
                      className={`w-full h-full border rounded-lg flex flex-col items-center justify-center text-xs cursor-pointer transition-all duration-200 ${getStatusColor(dayData.status)} ${
                        selectedDate === dayData.date ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                      }`}
                    >
                      <span className="font-medium">{day}</span>
                      {dayData.status !== 'weekend' && dayData.status !== 'holiday' && (
                        <div className="flex items-center space-x-1 mt-1">
                          {getStatusIcon(dayData.status)}
                        </div>
                      )}
                    </button>
                  ) : (
                    <div className="w-full h-full"></div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Legend */}
          <div className="flex justify-center space-x-6 text-xs pt-6 border-t border-gray-200 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span>Late</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
              <span>Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
              <span>Weekend</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedAttendance && selectedAttendance.date && (
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Details for {new Date(selectedAttendance.date).toLocaleDateString()}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Status</p>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon(selectedAttendance.status)}
                <span className="capitalize font-medium">{selectedAttendance.status}</span>
              </div>
            </div>
            
            {selectedAttendance.checkIn && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Check In</p>
                <p className="text-lg font-bold text-gray-900">{selectedAttendance.checkIn}</p>
              </div>
            )}
            
            {selectedAttendance.checkOut && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Check Out</p>
                <p className="text-lg font-bold text-gray-900">{selectedAttendance.checkOut}</p>
              </div>
            )}
            
            {selectedAttendance.hoursWorked !== undefined && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Hours Worked</p>
                <p className="text-lg font-bold text-gray-900">{selectedAttendance.hoursWorked}</p>
              </div>
            )}
          </div>
          
          {selectedAttendance.notes && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">Notes</p>
              <p className="text-sm text-yellow-700 mt-1">{selectedAttendance.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}