export interface Transaction {
  id: string
  amount: number
  description: string
  category: string
  date: Date
  type: 'income' | 'expense'
  emotion?: 'happy' | 'stressed' | 'bored' | 'sad' | 'excited' | 'anxious'
  tags?: string[]
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: 'weekly' | 'monthly' | 'yearly'
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  category: string
  priority: 'low' | 'medium' | 'high'
}

export interface AICompanion {
  personality: 'supportive' | 'strict' | 'analytical'
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    type?: 'suggestion' | 'warning' | 'celebration' | 'reminder'
  }>
}

export interface SocialCircle {
  id: string
  name: string
  members: Array<{
    id: string
    name: string
    avatar?: string
  }>
  challenges: Array<{
    id: string
    title: string
    description: string
    startDate: Date
    endDate: Date
    participants: string[]
  }>
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  financialHealthScore: number
  monthlyIncome: number
  preferences: {
    currency: string
    notifications: boolean
    darkMode: boolean
    aiPersonality: 'supportive' | 'strict' | 'analytical'
  }
}
