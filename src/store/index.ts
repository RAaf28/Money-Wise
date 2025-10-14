import { create } from 'zustand'
import { Transaction, Budget, Goal, AICompanion, SocialCircle, User } from '../types'

interface AppState {
  // User data
  user: User | null
  setUser: (user: User) => void
  
  // Transactions
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  
  // Budgets
  budgets: Budget[]
  addBudget: (budget: Omit<Budget, 'id'>) => void
  updateBudget: (id: string, updates: Partial<Budget>) => void
  
  // Goals
  goals: Goal[]
  addGoal: (goal: Omit<Goal, 'id'>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  
  // AI Companion
  aiCompanion: AICompanion
  updateAIPersonality: (personality: 'supportive' | 'strict' | 'analytical') => void
  addAIMessage: (message: Omit<AICompanion['messages'][0], 'id'>) => void
  
  // Social Circles
  socialCircles: SocialCircle[]
  addSocialCircle: (circle: Omit<SocialCircle, 'id'>) => void
  
  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // User data
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    financialHealthScore: 75,
    monthlyIncome: 10000000,
    preferences: {
      currency: 'IDR',
      notifications: true,
      darkMode: false,
      aiPersonality: 'supportive'
    }
  },
  setUser: (user) => set({ user }),
  
  // Transactions
  transactions: [
    {
      id: '1',
      amount: 50000,
      description: 'Lunch at Warung',
      category: 'Food',
      date: new Date(),
      type: 'expense',
      emotion: 'happy'
    },
    {
      id: '2',
      amount: 150000,
      description: 'Grocery Shopping',
      category: 'Groceries',
      date: new Date(Date.now() - 86400000),
      type: 'expense',
      emotion: 'stressed'
    },
    {
      id: '3',
      amount: 10000000,
      description: 'Salary',
      category: 'Income',
      date: new Date(Date.now() - 172800000),
      type: 'income'
    }
  ],
  addTransaction: (transaction) => set((state) => ({
    transactions: [...state.transactions, { ...transaction, id: Date.now().toString() }]
  })),
  updateTransaction: (id, updates) => set((state) => ({
    transactions: state.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(t => t.id !== id)
  })),
  
  // Budgets
  budgets: [
    {
      id: '1',
      category: 'Food',
      limit: 2000000,
      spent: 1200000,
      period: 'monthly'
    },
    {
      id: '2',
      category: 'Transportation',
      limit: 1000000,
      spent: 750000,
      period: 'monthly'
    }
  ],
  addBudget: (budget) => set((state) => ({
    budgets: [...state.budgets, { ...budget, id: Date.now().toString() }]
  })),
  updateBudget: (id, updates) => set((state) => ({
    budgets: state.budgets.map(b => b.id === id ? { ...b, ...updates } : b)
  })),
  
  // Goals
  goals: [
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000000,
      currentAmount: 3500000,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      category: 'Emergency',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Vacation to Japan',
      targetAmount: 15000000,
      currentAmount: 5000000,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      category: 'Travel',
      priority: 'medium'
    }
  ],
  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, { ...goal, id: Date.now().toString() }]
  })),
  updateGoal: (id, updates) => set((state) => ({
    goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
  })),
  deleteGoal: (id) => set((state) => ({
    goals: state.goals.filter(g => g.id !== id)
  })),
  
  // AI Companion
  aiCompanion: {
    personality: 'supportive',
    messages: [
      {
        id: '1',
        text: 'Great job on tracking your expenses today! I noticed you spent 20% less on food compared to last week. Keep it up! 🎉',
        timestamp: new Date(),
        type: 'celebration'
      },
      {
        id: '2',
        text: 'Your emergency fund is 35% complete. Consider setting up automatic transfers to reach your goal faster.',
        timestamp: new Date(Date.now() - 3600000),
        type: 'suggestion'
      }
    ]
  },
  updateAIPersonality: (personality) => set((state) => ({
    aiCompanion: { ...state.aiCompanion, personality }
  })),
  addAIMessage: (message) => set((state) => ({
    aiCompanion: {
      ...state.aiCompanion,
      messages: [...state.aiCompanion.messages, { ...message, id: Date.now().toString() }]
    }
  })),
  
  // Social Circles
  socialCircles: [
    {
      id: '1',
      name: 'Financial Goals Squad',
      members: [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
        { id: '3', name: 'Mike Johnson' }
      ],
      challenges: [
        {
          id: '1',
          title: 'No-Spend Weekend',
          description: 'Try to spend nothing on entertainment this weekend',
          startDate: new Date(),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          participants: ['1', '2', '3']
        }
      ]
    }
  ],
  addSocialCircle: (circle) => set((state) => ({
    socialCircles: [...state.socialCircles, { ...circle, id: Date.now().toString() }]
  })),
  
  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open })
}))
