import { useState } from 'react'
import { 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  DollarSign
} from 'lucide-react'
import { useAppStore } from '../store'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export function Budget() {
  const { budgets, addBudget, transactions } = useAppStore()
  const [showAddForm, setShowAddForm] = useState(false)

  const categories = ['Food', 'Transportation', 'Entertainment', 'Groceries', 'Healthcare', 'Utilities', 'Shopping', 'Other']

  // Calculate actual spending from transactions
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlySpending = transactions
    .filter(t => 
      t.type === 'expense' && 
      new Date(t.date).getMonth() === currentMonth &&
      new Date(t.date).getFullYear() === currentYear
    )
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  // Update budgets with actual spending
  const budgetsWithSpending = budgets.map(budget => ({
    ...budget,
    spent: monthlySpending[budget.category] || 0,
    percentage: ((monthlySpending[budget.category] || 0) / budget.limit) * 100,
    remaining: budget.limit - (monthlySpending[budget.category] || 0)
  }))

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgetsWithSpending.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = totalBudget - totalSpent
  const overallPercentage = (totalSpent / totalBudget) * 100

  // Chart data
  const budgetChartData = budgetsWithSpending.map(budget => ({
    category: budget.category,
    budget: budget.limit,
    spent: budget.spent,
    remaining: budget.remaining
  }))

  const spendingByCategory = Object.entries(monthlySpending).map(([category, amount]) => ({
    category,
    amount
  }))

  const handleAddBudget = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const budget = {
      category: formData.get('category') as string,
      limit: Number(formData.get('limit')),
      period: formData.get('period') as 'weekly' | 'monthly' | 'yearly',
      spent: 0
    }
    addBudget(budget)
    setShowAddForm(false)
    e.currentTarget.reset()
  }

  const getBudgetStatus = (percentage: number) => {
    if (percentage > 100) return { status: 'over', color: 'text-red-600', bgColor: 'bg-red-100' }
    if (percentage > 80) return { status: 'warning', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { status: 'good', color: 'text-green-600', bgColor: 'bg-green-100' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Budget</h1>
          <p className="text-gray-600">Manage your spending with intelligent budget tracking</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {totalBudget.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {totalSpent.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className={`text-2xl font-bold ${
                totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                Rp {totalRemaining.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Budget Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">Monthly Budget Usage</span>
            <span className="text-gray-600">{overallPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                overallPercentage > 100 ? 'bg-red-500' :
                overallPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Rp {totalSpent.toLocaleString('id-ID')} spent</span>
            <span>Rp {totalBudget.toLocaleString('id-ID')} budgeted</span>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Budget Categories</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {budgetsWithSpending.map((budget) => {
              const status = getBudgetStatus(budget.percentage)
              return (
                <div key={budget.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{budget.category}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.color}`}>
                        {budget.period}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        Rp {budget.spent.toLocaleString('id-ID')} / Rp {budget.limit.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-gray-500">{budget.percentage.toFixed(1)}% used</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        budget.percentage > 100 ? 'bg-red-500' :
                        budget.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Rp {budget.remaining.toLocaleString('id-ID')} remaining</span>
                    {budget.percentage > 100 && (
                      <span className="text-red-600 font-medium">
                        Rp {(budget.spent - budget.limit).toLocaleString('id-ID')} over budget
                      </span>
                    )}
                  </div>

                  {/* Status Message */}
                  {budget.percentage > 100 && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <p className="text-sm text-red-800">
                        You've exceeded your {budget.category.toLowerCase()} budget this month.
                      </p>
                    </div>
                  )}
                  {budget.percentage > 80 && budget.percentage <= 100 && (
                    <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        You're approaching your {budget.category.toLowerCase()} budget limit.
                      </p>
                    </div>
                  )}
                  {budget.percentage <= 80 && (
                    <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-sm text-green-800">
                        Great job staying within your {budget.category.toLowerCase()} budget!
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Spent */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Actual Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, '']} />
              <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
              <Bar dataKey="spent" fill="#EF4444" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Distribution</h3>
          {spendingByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {spendingByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No spending data available
            </div>
          )}
        </div>
      </div>

      {/* Add Budget Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Budget</h2>
            <form onSubmit={handleAddBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Limit</label>
                <input
                  type="number"
                  name="limit"
                  required
                  min="0"
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <select
                  name="period"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
