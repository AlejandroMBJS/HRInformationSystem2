'use client'

import { useState } from 'react'
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Eye,
  Trash2,
  Filter,
  Search
} from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'info' | 'error'
  date: string
  read: boolean
}

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
}

export function NotificationCenter({ notifications, onMarkAsRead }: NotificationCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <X className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'read' && notification.read) || 
      (filter === 'unread' && !notification.read)
    
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Notification Center</h2>
        <p className="text-gray-600 mt-2">Stay updated with important information and alerts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <Bell className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              <p className="text-sm text-gray-600">Total Notifications</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              <p className="text-sm text-gray-600">Unread</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{notifications.length - unreadCount}</p>
              <p className="text-sm text-gray-600">Read</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'read', label: 'Read' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Notifications ({filteredNotifications.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No notifications found</p>
              <p className="text-gray-400 text-sm mt-1">Check back later for updates</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                        )}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Mark as read"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.date).toLocaleDateString()} at {new Date(notification.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}