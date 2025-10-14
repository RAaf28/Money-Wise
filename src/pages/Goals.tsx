import { useState } from 'react'
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Edit,
  Trash2,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useAppStore } from '../store'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const priorityColors = {
  high: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' }
}

export function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useAppStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<any>(null)

  const categories = ['Emergency Fund', 'Travel', 'Education', 'Home', 'Car', 'Investment', 'Wedding', 'Other']

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const goal = {
      name: formData.get('name') as string,
      targetAmount: Number(formData.get('targetAmount')),
      currentAmount: Number(formData.get('currentAmount')),
      deadline: new Date(formData.get('deadline') as string),
      category: formData.get('category') as string,
      priority: formData.get('priority') as 'low' | 'medium' | 'high'
    }
    addGoal(goal)
    setShowAddForm(false)
    e.currentTarget.reset()
  }

  const handleUpdateGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingGoal) return
    
    const formData = new FormData(e.currentTarget)
    const updates = {
      name: formData.get('name') as string,
      targetAmount: Number(formData.get('targetAmount')),
      currentAmount: Number(formData.get('currentAmount')),
      deadline: new Date(formData.get('deadline') as string),
      category: formData.get('category') as string,
      priority: formData.get('priority') as 'low' | 'medium' | 'high'
    }
    updateGoal(editingGoal.id, updates)
    setEditingGoal(null)
  }

  const handleDeleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id)
    }
  }

  const addToGoal = (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId)
    if (goal) {
      updateGoal(goalId, { currentAmount: goal.currentAmount + amount })
    }
  }

  const getGoalProgress = (goal: any) => {
    return (goal.currentAmount / goal.targetAmount) * 100
  }

  const getDaysRemaining = (deadline: Date) => {
    const now = new Date()
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getGoalStatus = (goal: any) => {
    const progress = getGoalProgress(goal)
    const daysRemaining = getDaysRemaining(goal.deadline)
    
    if (progress >= 100) return { status: 'completed', color: 'text-green-600', bg: 'bg-green-100' }
    if (daysRemaining < 0) return { status: 'overdue', color: 'text-red-600', bg: 'bg-red-100' }
    if (daysRemaining < 30) return { status: 'urgent', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { status: 'on-track', color: 'text-blue-600', bg: 'bg-blue-100' }
  }

  // Calculate total goals value
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const overallProgress = (totalCurrentAmount / totalTargetAmount) * 100

  // Mock progress data for charts
  const progressData = goals.map(goal => ({
    name: goal.name,
    progress: getGoalProgress(goal),
    target: 100,
    current: getGoalProgress(goal)
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Goals</h1>
          <p className="text-gray-600">Track and achieve your financial objectives</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Target</p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {totalTargetAmount.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Saved</p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {totalCurrentAmount.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-900">{overallProgress.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = getGoalProgress(goal)
          const daysRemaining = getDaysRemaining(goal.deadline)
          const status = getGoalStatus(goal)
          const priorityStyle = priorityColors[goal.priority]

          return (
            <div key={goal.id} className={`bg-white p-6 rounded-lg shadow-sm border ${priorityStyle.border}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityStyle.bg} ${priorityStyle.text}`}>
                      {goal.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.bg} ${status.color}`}>
                      {status.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{goal.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingGoal(goal)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="text-gray-600">{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Rp {goal.currentAmount.toLocaleString('id-ID')}</span>
                  <span>Rp {goal.targetAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Goal Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Deadline</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {goal.deadline.toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Days Remaining</span>
                  </div>
                  <span className={`font-medium ${
                    daysRemaining < 0 ? 'text-red-600' :
                    daysRemaining < 30 ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Remaining</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    Rp {(goal.targetAmount - goal.currentAmount).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Quick Add Amount */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Quick add:</span>
                <button
                  onClick={() => addToGoal(goal.id, 100000)}
                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  +100k
                </button>
                <button
                  onClick={() => addToGoal(goal.id, 500000)}
                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  +500k
                </button>
                <button
                  onClick={() => addToGoal(goal.id, 1000000)}
                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  +1M
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress Chart */}
      {goals.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals Progress Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Progress']} />
              <Line type="monotone" dataKey="progress" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Financial Goal</h2>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., Emergency Fund"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                  <input
                    type="number"
                    name="targetAmount"
                    required
                    min="0"
                    placeholder="10000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount</label>
                  <input
                    type="number"
                    name="currentAmount"
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Goal</h2>
            <form onSubmit={handleUpdateGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingGoal.name}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                  <input
                    type="number"
                    name="targetAmount"
                    defaultValue={editingGoal.targetAmount}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount</label>
                  <input
                    type="number"
                    name="currentAmount"
                    defaultValue={editingGoal.currentAmount}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={editingGoal.category}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    defaultValue={editingGoal.priority}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  defaultValue={editingGoal.deadline.toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingGoal(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
