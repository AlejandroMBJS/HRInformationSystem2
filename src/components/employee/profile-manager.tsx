'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase,
  Calendar,
  Edit,
  Save,
  X,
  Shield,
  Clock,
  DollarSign
} from 'lucide-react'

export function ProfileManager() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: session?.user.employee?.firstName || 'John',
    lastName: session?.user.employee?.lastName || 'Doe',
    email: session?.user.email || '',
    phone: session?.user.employee?.phone || '+1 (555) 123-4567',
    address: session?.user.employee?.address || '123 Main St, City, State 12345',
    emergencyContact: session?.user.employee?.emergencyContact || 'Jane Doe - +1 (555) 987-6543',
    position: session?.user.employee?.position || 'Software Developer',
    department: session?.user.employee?.department || 'Engineering',
    employeeCode: session?.user.employee?.employeeCode || 'EMP001',
    hireDate: session?.user.employee?.hireDate?.toISOString().split('T')[0] || '2023-01-15',
    salary: session?.user.employee?.salary || 75000
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Here you would update the profile via API
      alert('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      alert('Failed to update profile')
    }
  }

  const handleCancel = () => {
    // Reset form data
    setProfileData({
      firstName: session?.user.employee?.firstName || 'John',
      lastName: session?.user.employee?.lastName || 'Doe',
      email: session?.user.email || '',
      phone: session?.user.employee?.phone || '+1 (555) 123-4567',
      address: session?.user.employee?.address || '123 Main St, City, State 12345',
      emergencyContact: session?.user.employee?.emergencyContact || 'Jane Doe - +1 (555) 987-6543',
      position: session?.user.employee?.position || 'Software Developer',
      department: session?.user.employee?.department || 'Engineering',
      employeeCode: session?.user.employee?.employeeCode || 'EMP001',
      hireDate: session?.user.employee?.hireDate?.toISOString().split('T')[0] || '2023-01-15',
      salary: session?.user.employee?.salary || 75000
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Employee Profile</h2>
          <p className="text-gray-600 mt-2">Manage your personal information and employment details</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                <input
                  type="text"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-green-600" />
              Employment Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee Code</label>
                <input
                  type="text"
                  value={profileData.employeeCode}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <input
                  type="text"
                  value={profileData.position}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  value={profileData.department}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hire Date</label>
                <input
                  type="date"
                  value={profileData.hireDate}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={session?.user.role || 'EMPLOYEE'}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Salary</label>
                <input
                  type="text"
                  value={`$${profileData.salary.toLocaleString()}`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
              Employment Summary
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {Math.floor((new Date().getTime() - new Date(profileData.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365 * 100)) / 100}
                </p>
                <p className="text-sm text-gray-600">Years of Service</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">${(profileData.salary / 12).toFixed(0)}</p>
                <p className="text-sm text-gray-600">Monthly Salary</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{session?.user.role}</p>
                <p className="text-sm text-gray-600">Access Level</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}