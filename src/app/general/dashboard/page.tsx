'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Role } from '@prisma/client'

import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Navigation } from '@/components/navigation'
import { EmployeeMainDashboard } from '@/components/dashboards/employee-main-dashboard'
import { AdminMainDashboard } from '@/components/dashboards/admin-main-dashboard'
import { HrMainDashboard } from '@/components/hr/hr-main-dashboard'
import { HighPositionMainDashboard } from '@/components/dashboards/highPosition-main-dashboard copy'
import { PayrollMainDashboard } from '@/components/dashboards/payroll-main-dashboard'

// 🔹 Helper para roles de alto nivel
function isHighPosition(role: Role) {
  return role === Role.MANAGER || role === Role.DIRECTOR
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (!session) return null

  const role = session.user.role as Role

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/5 to-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <Navigation />
      <main className="py-8 relative z-10">
              {role === Role.ADMIN && <AdminMainDashboard />}
              {role === Role.HR && <HrMainDashboard />}
              {role === Role.MANAGER && <HighPositionMainDashboard />}
              {role === Role.EMPLOYEE && <EmployeeMainDashboard />}
              {role === Role.PAYROLL && <PayrollMainDashboard />}
            </main>
    </div>
  )
}
