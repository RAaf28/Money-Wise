// no default React import needed
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Wallet, 
  AlertCircle,
  CheckCircle,
  Bot
} from 'lucide-react'
import { useAppStore } from '../store'
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export function Dashboard() {
  const { transactions, budgets, goals, user, aiCompanion } = useAppStore()

  const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`

  // Calculate financial metrics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netWorth = totalIncome - totalExpenses

  // Monthly spending by category
  const monthlySpending = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const spendingData = Object.entries(monthlySpending).map(([category, amount]) => ({
    category,
    amount
  }))

  // Recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Budget status
  const budgetStatus = budgets.map(budget => ({
    ...budget,
    percentage: (budget.spent / budget.limit) * 100,
    remaining: budget.limit - budget.spent
  }))

  // Goals progress
  const goalsProgress = goals.map(goal => ({
    ...goal,
    percentage: (goal.currentAmount / goal.targetAmount) * 100
  }))

  // Financial Health Score calculation
  const calculateHealthScore = () => {
    let score = 100
    
    // Deduct points for overspending
    budgetStatus.forEach(budget => {
      if (budget.percentage > 100) {
        score -= 10
      } else if (budget.percentage > 80) {
        score -= 5
      }
    })
    
    // Deduct points for low savings rate
    const savingsRate = (totalIncome - totalExpenses) / totalIncome
    if (savingsRate < 0.1) score -= 20
    else if (savingsRate < 0.2) score -= 10
    
    // Add points for goal progress
    goalsProgress.forEach(goal => {
      if (goal.percentage > 50) score += 5
    })
    
    return Math.max(0, Math.min(100, score))
  }

  const healthScore = calculateHealthScore()

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 truncate">Welcome back, {user?.name}. Here's your financial overview.</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Financial Health Score</div>
          <div className={`text-2xl font-semibold leading-tight ${
            healthScore >= 80 ? 'text-green-600' : 
            healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {healthScore}/100
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Worth</p>
              <p className={`text-2xl font-bold ${
                netWorth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(netWorth)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Spending by Category */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Spending by Category</h3>
          {spendingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {spendingData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              No spending data yet for this month
            </div>
          )}
        </div>

        {/* Budget Status */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Budget Status</h3>
          <div className="space-y-4">
            {budgetStatus.map((budget) => (
              <div key={budget.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{budget.category}</span>
                  <span className="text-gray-600">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                  </span>
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
                  <span>{budget.percentage.toFixed(1)}% used</span>
                  <span>{formatCurrency(budget.remaining)} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Goals Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goalsProgress.map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{goal.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                  goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {goal.priority}
                </span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span>{formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {goal.percentage.toFixed(1)}% complete • Due {goal.deadline.toLocaleDateString('id-ID')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Recent Transactions</h3>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-gray-500">
                  {transaction.date.toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Companion Messages */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-3">
          <Bot className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Financial Companion</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            aiCompanion.personality === 'supportive' ? 'bg-green-100 text-green-800' :
            aiCompanion.personality === 'strict' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {aiCompanion.personality}
          </span>
        </div>
        <div className="space-y-3">
          {aiCompanion.messages.slice(0, 2).map((message) => (
            <div key={message.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-start space-x-2">
                <div className={`p-1 rounded-full ${
                  message.type === 'celebration' ? 'bg-green-100' :
                  message.type === 'warning' ? 'bg-red-100' :
                  message.type === 'suggestion' ? 'bg-blue-100' :
                  'bg-yellow-100'
                }`}>
                  {message.type === 'celebration' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : message.type === 'warning' ? (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    <Target className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{message.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
