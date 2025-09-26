'use client'

import { useState } from 'react'
import { PiggyBank, TrendingUp, DollarSign, Calendar, Target, ChartBar as BarChart3, Plus, Minus, Eye, Download } from 'lucide-react'

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

interface SavingsTrackerProps {
  stats: EmployeeStats
}

interface SavingsTransaction {
  id: string
  date: string
  type: 'contribution' | 'withdrawal' | 'interest'
  amount: number
  description: string
  balance: number
  source: 'employee' | 'company'
}

export function SavingsTracker({ stats }: SavingsTrackerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('6months')
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false)
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [withdrawalReason, setWithdrawalReason] = useState('')

  // Mock transaction history
  const transactions: SavingsTransaction[] = [
    {
      id: '1',
      date: '2024-09-15',
      type: 'contribution',
      amount: 625,
      description: 'Monthly contribution - Employee',
      balance: 12500,
      source: 'employee'
    },
    {
      id: '2',
      date: '2024-09-15',
      type: 'contribution',
      amount: 625,
      description: 'Monthly contribution - Company (10%)',
      balance: 25000,
      source: 'company'
    },
    {
      id: '3',
      date: '2024-08-15',
      type: 'contribution',
      amount: 625,
      description: 'Monthly contribution - Employee',
      balance: 11875,
      source: 'employee'
    },
    {
      id: '4',
      date: '2024-08-15',
      type: 'contribution',
      amount: 625,
      description: 'Monthly contribution - Company (10%)',
      balance: 24375,
      source: 'company'
    },
    {
      id: '5',
      date: '2024-07-20',
      type: 'withdrawal',
      amount: -2000,
      description: 'Emergency withdrawal - Medical expenses',
      balance: 11250,
      source: 'employee'
    }
  ]

  const handleWithdrawalRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!withdrawalAmount || !withdrawalReason) {
      alert('Please fill in all fields')
      return
    }
    
    // Here you would submit the withdrawal request
    alert(`Withdrawal request submitted for $${withdrawalAmount}`)
    setShowWithdrawalForm(false)
    setWithdrawalAmount('')
    setWithdrawalReason('')
  }

  const totalSavings = stats.savingsBox + stats.savingsFund
  const monthlyContribution = 625
  const projectedAnnualSavings = monthlyContribution * 12 * 2 // Employee + Company

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Savings Tracker</h2>
        <p className="text-gray-600 mt-2">Monitor your personal and company savings funds</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Personal Savings Box</h3>
                <p className="text-sm text-gray-600">Your contributions</p>
              </div>
              <PiggyBank className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">${stats.savingsBox.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">Available for withdrawal</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monthly contribution:</span>
                <span className="font-medium">${monthlyContribution}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Company Savings Fund</h3>
                <p className="text-sm text-gray-600">10% company match</p>
              </div>
              <TrendingUp className="h-8 w-8 text-teal-600" />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-600">${stats.savingsFund.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">Company contribution</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monthly contribution:</span>
                <span className="font-medium">${monthlyContribution}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Savings</h3>
                <p className="text-sm text-gray-600">Combined funds</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">${totalSavings.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">Total accumulated</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Projected annual:</span>
                <span className="font-medium">${projectedAnnualSavings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowWithdrawalForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Minus className="h-4 w-4" />
            <span>Request Withdrawal</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Download Statement</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Target className="h-4 w-4" />
            <span>Set Savings Goal</span>
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'contribution' ? 'bg-green-100' :
                    transaction.type === 'withdrawal' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    {transaction.type === 'contribution' && <Plus className="h-5 w-5 text-green-600" />}
                    {transaction.type === 'withdrawal' && <Minus className="h-5 w-5 text-red-600" />}
                    {transaction.type === 'interest' && <TrendingUp className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Balance: ${transaction.balance.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Withdrawal Form Modal */}
      {showWithdrawalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Withdrawal</h3>
            <form onSubmit={handleWithdrawalRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={stats.savingsBox}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: ${stats.savingsBox.toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Withdrawal
                </label>
                <textarea
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Please explain the reason for this withdrawal..."
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawalForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}