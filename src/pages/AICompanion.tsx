import { useState } from 'react'
import { 
  Bot, 
  Send, 
  Settings, 
  MessageCircle, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Target,
  Brain,
  Zap,
  Heart
} from 'lucide-react'
import { useAppStore } from '../store'

const personalityConfig = {
  supportive: {
    name: 'Supportive',
    description: 'Encouraging and gentle guidance',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: Heart,
    traits: ['Encouraging', 'Patient', 'Celebrates small wins', 'Gentle reminders']
  },
  strict: {
    name: 'Strict',
    description: 'Direct and disciplined approach',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: AlertTriangle,
    traits: ['Direct', 'Disciplined', 'No-nonsense', 'Tough love']
  },
  analytical: {
    name: 'Analytical',
    description: 'Data-driven insights and recommendations',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Brain,
    traits: ['Data-driven', 'Detailed analysis', 'Pattern recognition', 'Strategic planning']
  }
}

const messageTypes = {
  suggestion: { icon: Target, color: 'text-blue-600', bg: 'bg-blue-100' },
  warning: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  celebration: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  reminder: { icon: MessageCircle, color: 'text-yellow-600', bg: 'bg-yellow-100' }
}

export function AICompanion() {
  const { aiCompanion, updateAIPersonality, addAIMessage, transactions, budgets, goals } = useAppStore()
  const [newMessage, setNewMessage] = useState('')
  const [showPersonalitySettings, setShowPersonalitySettings] = useState(false)

  const currentPersonality = personalityConfig[aiCompanion.personality]

  const generateAIMessage = () => {
    const recentTransactions = transactions.slice(-5)
    const overspentBudgets = budgets.filter(b => b.spent > b.limit)
    const goalsProgress = goals.map(g => ({ ...g, progress: (g.currentAmount / g.targetAmount) * 100 }))

    let message = ''
    let type: keyof typeof messageTypes = 'suggestion'

    // Analyze spending patterns
    const totalSpent = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const avgSpending = totalSpent / recentTransactions.filter(t => t.type === 'expense').length

    if (aiCompanion.personality === 'supportive') {
      if (goalsProgress.some(g => g.progress > 50)) {
        message = "Great progress on your goals! You're doing amazing. Keep up the consistent effort! 🌟"
        type = 'celebration'
      } else if (avgSpending < 100000) {
        message = "I noticed you've been spending wisely lately. Your financial discipline is really paying off! 💪"
        type = 'celebration'
      } else {
        message = "Every small step counts! Consider setting a daily spending limit to help reach your goals faster."
        type = 'suggestion'
      }
    } else if (aiCompanion.personality === 'strict') {
      if (overspentBudgets.length > 0) {
        message = `You've overspent on ${overspentBudgets.length} budget categories. Time to tighten up and get back on track.`
        type = 'warning'
      } else if (goalsProgress.some(g => g.progress < 20)) {
        message = "Your goals are barely progressing. You need to increase your savings rate immediately."
        type = 'warning'
      } else {
        message = "Good discipline. Now push harder - you can save even more than you think."
        type = 'suggestion'
      }
    } else { // analytical
      const spendingByCategory = recentTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        }, {} as Record<string, number>)

      const topCategory = Object.entries(spendingByCategory)
        .sort(([,a], [,b]) => b - a)[0]

      if (topCategory) {
        message = `Analysis: ${topCategory[0]} accounts for ${((topCategory[1] / totalSpent) * 100).toFixed(1)}% of your spending. Consider optimizing this category for better financial efficiency.`
        type = 'suggestion'
      } else {
        message = "Insufficient data for analysis. Please add more transactions to get personalized insights."
        type = 'reminder'
      }
    }

    addAIMessage({
      text: message,
      timestamp: new Date(),
      type
    })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    addAIMessage({
      text: newMessage,
      timestamp: new Date(),
      type: 'suggestion'
    })
    setNewMessage('')
  }

  const getPersonalityMessage = (personality: keyof typeof personalityConfig) => {
    switch (personality) {
      case 'supportive':
        return "I'm here to cheer you on every step of the way! Let's celebrate your wins together. 🎉"
      case 'strict':
        return "No excuses. Let's get serious about your financial goals and make real progress. 💪"
      case 'analytical':
        return "Let me analyze your financial data and provide data-driven insights for optimal decision making. 📊"
      default:
        return "I'm here to help you manage your finances better!"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Financial Companion</h1>
          <p className="text-gray-600">Your personalized financial assistant with adaptive personality</p>
        </div>
        <button
          onClick={() => setShowPersonalitySettings(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Personality Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${currentPersonality.bgColor}`}>
            <currentPersonality.icon className={`h-8 w-8 ${currentPersonality.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{currentPersonality.name} Mode</h3>
            <p className="text-gray-600">{currentPersonality.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentPersonality.traits.map((trait, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Conversation</h3>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {/* Welcome Message */}
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 p-3 rounded-lg max-w-md">
              <p className="text-gray-800">{getPersonalityMessage(aiCompanion.personality)}</p>
              <p className="text-xs text-gray-500 mt-1">AI Companion</p>
            </div>
          </div>

          {/* AI Messages */}
          {aiCompanion.messages.map((message) => {
            const messageType = messageTypes[message.type]
            return (
              <div key={message.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${messageType.bg}`}>
                  <messageType.icon className={`h-4 w-4 ${messageType.color}`} />
                </div>
                <div className="bg-blue-50 p-3 rounded-lg max-w-md">
                  <p className="text-gray-800">{message.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask me anything about your finances..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={generateAIMessage}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Generate Insight</h4>
              <p className="text-sm text-gray-600">Get personalized financial advice</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => addAIMessage({
            text: "Let me analyze your spending patterns and suggest optimizations.",
            timestamp: new Date(),
            type: 'suggestion'
          })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Spending Analysis</h4>
              <p className="text-sm text-gray-600">Review your spending patterns</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => addAIMessage({
            text: "Based on your current progress, here are some goal optimization strategies...",
            timestamp: new Date(),
            type: 'suggestion'
          })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Goal Strategy</h4>
              <p className="text-sm text-gray-600">Optimize your savings goals</p>
            </div>
          </div>
        </button>
      </div>

      {/* Personality Settings Modal */}
      {showPersonalitySettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Personality Settings</h2>
            <p className="text-gray-600 mb-6">Choose how your AI companion communicates with you</p>
            
            <div className="space-y-4">
              {Object.entries(personalityConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    updateAIPersonality(key as keyof typeof personalityConfig)
                    setShowPersonalitySettings(false)
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    aiCompanion.personality === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                      <config.icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">{config.name}</h4>
                      <p className="text-sm text-gray-600">{config.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowPersonalitySettings(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
