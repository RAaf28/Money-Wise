import { useState, useEffect, useRef } from 'react'
import { 
  Bot, 
  Send, 
  Settings, 
  MessageCircle, 
  TrendingUp, 
  Target,
  Zap,
  Loader2,
  Heart,
  AlertTriangle,
  Brain
} from 'lucide-react'
import { useAppStore } from '../store'
import { AICompanion as AICompanionType } from '../types'

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

function getPersonalityMessage(personality: keyof typeof personalityConfig): string {
  switch (personality) {
    case 'supportive':
      return "I'm here to cheer you on every step of the way! Let's celebrate your wins together. 🎉 How can I help you with your finances today?"
    case 'strict':
      return "No excuses. Let's get serious about your financial goals and make real progress. 💪 What financial challenge can we tackle together?"
    case 'analytical':
      return "Let me analyze your financial data and provide data-driven insights for optimal decision making. 📊 What would you like me to analyze?"
    default:
      return "I'm here to help you manage your finances better! Ask me anything about budgeting, saving, or financial planning."
  }
}

export function AICompanion() {
  const { aiCompanion, updateAIPersonality, addAIMessage, user } = useAppStore()
  const [newMessage, setNewMessage] = useState('')
  const [showPersonalitySettings, setShowPersonalitySettings] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:3001/chat'

  const currentPersonality = personalityConfig[aiCompanion.personality]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiCompanion.messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading || !user) return

    const userMessageContent = newMessage.trim()
    setNewMessage('')
    setIsLoading(true)

    const userMessage: Omit<AICompanionType['messages'][0], 'id'> = {
      role: 'user',
      content: userMessageContent,
      timestamp: new Date()
    }
    addAIMessage(userMessage)

    try {
      const history = aiCompanion.messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        content: msg.content
      }))

      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageContent,
          history: history.slice(-10)
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.details || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const assistantMessage: Omit<AICompanionType['messages'][0], 'id'> = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        type: 'suggestion' // default type
      }
      addAIMessage(assistantMessage)
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      const errorMsg: Omit<AICompanionType['messages'][0], 'id'> = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please check if the backend server is running on port 3001.`,
        timestamp: new Date(),
        type: 'warning'
      }
      addAIMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = async (message: string) => {
    if (isLoading || !user) return
    
    setIsLoading(true)

    const userMessage: Omit<AICompanionType['messages'][0], 'id'> = {
      role: 'user',
      content: message,
      timestamp: new Date()
    }
    addAIMessage(userMessage)

    try {
      const history = aiCompanion.messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        content: msg.content
      }))

      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          history: history.slice(-10)
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.details || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const assistantMessage: Omit<AICompanionType['messages'][0], 'id'> = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        type: 'suggestion'
      }
      addAIMessage(assistantMessage)
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      const errorMsg: Omit<AICompanionType['messages'][0], 'id'> = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}.`,
        timestamp: new Date(),
        type: 'warning'
      }
      addAIMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const displayedMessages = aiCompanion.messages.length > 0 
    ? aiCompanion.messages 
    : [{
        id: 'welcome-1',
        role: 'assistant',
        content: getPersonalityMessage(aiCompanion.personality),
        timestamp: new Date()
      }]

  return (
    <div className="space-y-6">
      {/* header + controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Financial Companion</h1>
          <p className="text-gray-600">Your personalized financial assistant with adaptive personality</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPersonalitySettings(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Personality overview unchanged */}
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

      {/* Chat Interface container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Conversation</h3>
          </div>
        </div>

        {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
          {displayedMessages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}
              <div
                className={`p-3 rounded-lg max-w-md ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="p-2 bg-gray-200 rounded-full flex-shrink-0">
                  <MessageCircle className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
          </div>

        {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask me anything about your finances..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading || !user}
              />
              <button
                type="submit"
              disabled={isLoading || !newMessage.trim() || !user}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
                <span>Send</span>
              </button>
            </form>
          </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleQuickAction("Can you analyze my spending patterns and give me advice?")}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          disabled={!user}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Spending Analysis</h4>
              <p className="text-sm text-gray-600">Get personalized financial advice</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleQuickAction("How can I improve my budgeting strategy?")}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          disabled={!user}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Budget Tips</h4>
              <p className="text-sm text-gray-600">Get budgeting strategies</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleQuickAction("What are some ways to save more money?")}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          disabled={!user}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Savings Tips</h4>
              <p className="text-sm text-gray-600">Learn how to save more</p>
            </div>
          </div>
        </button>
      </div>

      {/* Personality Settings Modal unchanged */}
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
