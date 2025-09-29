'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, User, Calendar, DollarSign, FileText, Users, 
  GraduationCap, MessageSquare, Target, Clock, Settings,
  Heart, BarChart3, ChevronRight, PanelLeft
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  {
    name: 'Dashboard',
    href: '/employee/dashboard',
    icon: Home,
    description: 'Employee main dashboard'
  },
  {
    name: 'My Profile',
    href: '/employee/profile',
    icon: User,
    description: 'Manage personal information'
  },
  {
    name: 'Time & Attendance',
    icon: Clock,
    children: [
      { name: 'Time Tracking', href: '/employee/time-tracking', icon: Clock, description: 'Track work hours' },
      { name: 'Leave Management', href: '/employee/leave', icon: Calendar, description: 'Request time off' }
    ]
  },
  {
    name: 'Payroll & Benefits',
    icon: DollarSign,
    children: [
      { name: 'Payroll Information', href: '/employee/payroll', icon: DollarSign, description: 'View pay stubs and tax documents' },
      { name: 'Benefits Enrollment', href: '/employee/benefits', icon: Heart, description: 'Manage benefit plans' }
    ]
  },
  {
    name: 'Performance & Goals',
    icon: Target,
    children: [
      { name: 'Goal Tracking', href: '/employee/goals', icon: Target, description: 'Set and track goals' },
      { name: 'Feedback System', href: '/employee/feedback', icon: MessageSquare, description: 'Give and receive feedback' },
      { name: 'Analytics Dashboard', href: '/employee/analytics', icon: BarChart3, description: 'View performance metrics' }
    ]
  },
  {
    name: 'Learning & Development',
    icon: GraduationCap,
    children: [
      { name: 'Training Center', href: '/employee/training', icon: GraduationCap, description: 'Access training courses' }
    ]
  },
  {
    name: 'Company Resources',
    icon: Users,
    children: [
      { name: 'Employee Directory', href: '/employee/directory', icon: Users, description: 'Find colleagues' },
      { name: 'Document Management', href: '/employee/documents', icon: FileText, description: 'Access company documents' }
    ]
  },
  {
    name: 'Settings',
    href: '/employee/settings',
    icon: Settings,
    description: 'Personal preferences and account settings'
  }
]

export function EmployeeSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    // If the active route is a child, expand the parent menu on load
    const activeSection = navigation.find(item =>
      item.children?.some(child => pathname === child.href)
    )
    if (activeSection) {
      setActiveMenu(activeSection.name)
    }
  }, [pathname])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
    if (!isCollapsed) {
      setActiveMenu(null)
    }
  }

  const isNavLinkActive = (href: string) => pathname === href

  const isParentActive = (children: any[]) => children.some(child => pathname === child.href)

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col bg-white border-r border-gray-200 h-screen overflow-hidden"
    >
      {/* Header */}
      <div className="h-16 flex items-center p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-gray-900 truncate mr-auto">
            Employee Portal
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          <PanelLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-2">
        {navigation.map((item) => {
          const isActive = isNavLinkActive(item.href || '')
          const isActiveParent = item.children && isParentActive(item.children)

          return (
            <div key={item.name} className="relative">
              {!item.children ? (
                // Regular link
                <Link
                  href={item.href || ''}
                  className={cn(
                    "flex items-center rounded-md text-sm font-medium transition-colors duration-200",
                    isCollapsed ? 'p-2 justify-center' : 'p-2',
                    isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  title={item.description}
                >
                  <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              ) : (
                // Dropdown menu element
                <div
                  onMouseEnter={() => isCollapsed && setActiveMenu(item.name)}
                  onMouseLeave={() => isCollapsed && setActiveMenu(null)}
                >
                  <button
                    onClick={() => !isCollapsed && setActiveMenu(activeMenu === item.name ? null : item.name)}
                    className={cn(
                      "flex items-center w-full rounded-md text-sm font-medium transition-colors duration-200",
                      isCollapsed ? 'p-2 justify-center' : 'p-2 justify-between',
                      (isActiveParent || activeMenu === item.name) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                      {!isCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <ChevronRight
                        className={cn("h-4 w-4 transition-transform duration-200", activeMenu === item.name && "rotate-90")}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {isCollapsed && activeMenu === item.name && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-full top-0 ml-2 z-50 w-60 bg-white rounded-md shadow-lg p-2 border border-gray-200"
                      >
                        <h4 className="text-xs font-semibold text-gray-500 p-2 border-b border-gray-200 mb-2">
                          {item.name}
                        </h4>
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                              isNavLinkActive(child.href)
                                ? 'bg-blue-200 text-blue-800'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            )}
                            title={child.description}
                          >
                            <child.icon className="mr-3 h-4 w-4" />
                            <span className="truncate">{child.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}

                    {!isCollapsed && activeMenu === item.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="py-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                'flex items-center pl-10 pr-2 py-2 text-sm font-medium rounded-md transition-colors',
                                isNavLinkActive(child.href)
                                  ? 'bg-blue-200 text-blue-800'
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              )}
                              title={child.description}
                            >
                              <child.icon className="mr-3 h-4 w-4" />
                              <span className="truncate">{child.name}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer / Back to Main */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/general/dashboard"
          className={cn(
            "flex items-center p-2 text-sm font-medium rounded-md transition-colors",
            isCollapsed ? 'justify-center' : '',
            'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )}
          title="Back to Main Dashboard"
        >
          <Home className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && (
            <span>Main Dashboard</span>
          )}
        </Link>
      </div>
    </motion.div>
  )
}