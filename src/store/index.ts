import { create } from 'zustand'
import { Transaction, Budget, Goal, AICompanion, SocialCircle, User } from '../types'
import { apiRequest } from '../config/api'

interface AppState {
  // User data
  user: User | null
  setUser: (user: User) => void
  
  // Transactions
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id:string) => void
  
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
  fetchChatHistory: (userId: string) => Promise<void>
  
  // Social Circles
  socialCircles: SocialCircle[]
  addSocialCircle: (circle: Omit<SocialCircle, 'id'>) => void
  
  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Auth actions
  register: (name: string, email: string, password: string) => Promise<{ success: boolean, user?: User, error?: string }>
  login: (email: string, password: string) => Promise<{ success: boolean, user?: User, error?: string }>
  logout: () => void
}

type PersistedState = Pick<AppState, 'transactions' | 'budgets' | 'goals' | 'aiCompanion' | 'socialCircles'>

const USER_STORAGE_KEY = 'moneywise_user'
const getUserDataKey = (userId: string) => `moneywise_data_${userId}`
const isBrowser = typeof window !== 'undefined'
const getStorage = () => (isBrowser ? window.localStorage : null)
const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

const getDefaultUserData = (): PersistedState => ({
  transactions: [],
  budgets: [],
  goals: [],
  socialCircles: [],
  aiCompanion: {
    personality: 'supportive',
    messages: []
  }
})

const serializeUserData = (data: PersistedState) => ({
  transactions: data.transactions.map(transaction => ({
    ...transaction,
    date: transaction.date.toISOString()
  })),
  budgets: data.budgets,
  goals: data.goals.map(goal => ({
    ...goal,
    deadline: goal.deadline.toISOString()
  })),
  socialCircles: data.socialCircles.map(circle => ({
    ...circle,
    challenges: circle.challenges.map(challenge => ({
      ...challenge,
      startDate: challenge.startDate.toISOString(),
      endDate: challenge.endDate.toISOString()
    }))
  })),
  aiCompanion: {
    personality: data.aiCompanion.personality,
    messages: data.aiCompanion.messages.map(message => ({
      ...message,
      timestamp: message.timestamp.toISOString()
    }))
  }
})

const deserializeUserData = (raw: any): PersistedState => ({
  transactions: Array.isArray(raw?.transactions)
    ? raw.transactions.map((transaction: any) => ({
        ...transaction,
        date: transaction.date ? new Date(transaction.date) : new Date()
      }))
    : [],
  budgets: Array.isArray(raw?.budgets) ? raw.budgets : [],
  goals: Array.isArray(raw?.goals)
    ? raw.goals.map((goal: any) => ({
        ...goal,
        deadline: goal.deadline ? new Date(goal.deadline) : new Date()
      }))
    : [],
  socialCircles: Array.isArray(raw?.socialCircles)
    ? raw.socialCircles.map((circle: any) => ({
        ...circle,
        challenges: Array.isArray(circle?.challenges)
          ? circle.challenges.map((challenge: any) => ({
              ...challenge,
              startDate: challenge.startDate ? new Date(challenge.startDate) : new Date(),
              endDate: challenge.endDate ? new Date(challenge.endDate) : new Date()
            }))
          : []
      }))
    : [],
  aiCompanion: {
    personality: raw?.aiCompanion?.personality ?? 'supportive',
    messages: Array.isArray(raw?.aiCompanion?.messages)
      ? raw.aiCompanion.messages.map((message: any) => ({
          ...message,
          timestamp: message.timestamp ? new Date(message.timestamp) : new Date()
        }))
      : []
  }
})

const loadUserFromStorage = (): User | null => {
  try {
    const storage = getStorage()
    if (!storage) return null
    const stored = storage.getItem(USER_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as User
    }
  } catch {
    // ignore
  }
  return null
}

const saveUserToStorage = (user: User) => {
  const storage = getStorage()
  storage?.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

const clearUserStorage = () => {
  const storage = getStorage()
  storage?.removeItem(USER_STORAGE_KEY)
}

const loadUserData = (userId: string): PersistedState => {
  const storage = getStorage()
  if (!storage) return getDefaultUserData()

  const key = getUserDataKey(userId)
  const raw = storage.getItem(key)
  if (!raw) {
    const defaults = getDefaultUserData()
    storage.setItem(key, JSON.stringify(serializeUserData(defaults)))
    return defaults
  }

  try {
    const parsed = JSON.parse(raw)
    return deserializeUserData(parsed)
  } catch {
    const defaults = getDefaultUserData()
    storage.setItem(key, JSON.stringify(serializeUserData(defaults)))
    return defaults
  }
}

const saveUserData = (userId: string, data: PersistedState) => {
  const storage = getStorage()
  if (!storage) return
  storage.setItem(getUserDataKey(userId), JSON.stringify(serializeUserData(data)))
}

const mapServerUserToUser = (serverUser: {id: number, name: string}, email: string): User => ({
  id: serverUser.id.toString(),
  name: serverUser.name,
  email: email,
  financialHealthScore: 75, // Default value
  monthlyIncome: 0, // Default value
  preferences: {
    currency: 'IDR',
    notifications: true,
    darkMode: false,
    aiPersonality: 'supportive'
  }
})

export const useAppStore = create<AppState>((set, get) => {
  const initialUser = loadUserFromStorage()
  const initialData = initialUser ? loadUserData(initialUser.id) : getDefaultUserData()

  const persistUserData = (partial: Partial<PersistedState> = {}) => {
    const user = get().user
    if (!user) return
    const data: PersistedState = {
      transactions: partial.transactions ?? get().transactions,
      budgets: partial.budgets ?? get().budgets,
      goals: partial.goals ?? get().goals,
      socialCircles: partial.socialCircles ?? get().socialCircles,
      aiCompanion: partial.aiCompanion ?? get().aiCompanion
    }
    saveUserData(user.id, data)
  }

  const startUserSession = async (user: User) => {
    saveUserToStorage(user)
    const userData = loadUserData(user.id)
    set({
      user,
      ...userData
    })
    await get().fetchChatHistory(user.id)
  }

  const endUserSession = () => {
    clearUserStorage()
    set({
      user: null,
      ...getDefaultUserData()
    })
  }

  return {
    user: initialUser,
    transactions: initialData.transactions,
    budgets: initialData.budgets,
    goals: initialData.goals,
    socialCircles: initialData.socialCircles,
    aiCompanion: initialData.aiCompanion,
    sidebarOpen: true,

    setUser: (user) => {
      saveUserToStorage(user)
      set({ user })
    },

    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    fetchChatHistory: async (userId) => {
      try {
        const history = await apiRequest<any[]>('/chat.php?user_id=' + userId);
        const messages = history.map(item => ({
          id: generateId(),
          content: item.content,
          role: item.role,
          timestamp: new Date(item.timestamp),
        }));
        set(state => ({
          aiCompanion: {
            ...state.aiCompanion,
            messages,
          }
        }))
      } catch (error) {
        console.error("Failed to fetch chat history", error)
      }
    },

    addTransaction: (transaction) =>
      set((state) => {
        const newTransaction = { ...transaction, id: generateId() }
        const transactions = [...state.transactions, newTransaction]
        persistUserData({ transactions })
        return { transactions }
      }),

    updateTransaction: (id, updates) =>
      set((state) => {
        const transactions = state.transactions.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        )
        persistUserData({ transactions })
        return { transactions }
      }),

    deleteTransaction: (id) =>
      set((state) => {
        const transactions = state.transactions.filter((t) => t.id !== id)
        persistUserData({ transactions })
        return { transactions }
      }),

    addBudget: (budget) =>
      set((state) => {
        const budgets = [...state.budgets, { ...budget, id: generateId() }]
        persistUserData({ budgets })
        return { budgets }
      }),

    updateBudget: (id, updates) =>
      set((state) => {
        const budgets = state.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b))
        persistUserData({ budgets })
        return { budgets }
      }),

    addGoal: (goal) =>
      set((state) => {
        const goals = [...state.goals, { ...goal, id: generateId() }]
        persistUserData({ goals })
        return { goals }
      }),

    updateGoal: (id, updates) =>
      set((state) => {
        const goals = state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g))
        persistUserData({ goals })
        return { goals }
      }),

    deleteGoal: (id) =>
      set((state) => {
        const goals = state.goals.filter((g) => g.id !== id)
        persistUserData({ goals })
        return { goals }
      }),

    updateAIPersonality: (personality) =>
      set((state) => {
        const aiCompanion = { ...state.aiCompanion, personality }
        persistUserData({ aiCompanion })
        return { aiCompanion }
      }),

    addAIMessage: async (message) => {
      const user = get().user
      if (!user) return

      const newMessage = { ...message, id: generateId() }
      
      // Update local state immediately
      set((state) => ({
        aiCompanion: {
          ...state.aiCompanion,
          messages: [...state.aiCompanion.messages, newMessage]
        }
      }))
      
      // Persist to backend
      try {
        await apiRequest('/chat.php', {
          method: 'POST',
          body: JSON.stringify({
            user_id: user.id,
            role: message.role,
            content: message.content
          })
        })
      } catch (error) {
        console.error("Failed to save message", error)
        // Here you might want to handle the error, e.g. show a notification
        // or remove the message that failed to save.
      }
    },

    addSocialCircle: (circle) =>
      set((state) => {
        const socialCircles = [...state.socialCircles, { ...circle, id: generateId() }]
        persistUserData({ socialCircles })
        return { socialCircles }
      }),

    register: async (name, email, password) => {
      try {
        const response = await apiRequest<{ success: boolean; user?: { id: number; name: string }; error?: string }>('/register.php', {
          method: 'POST',
          body: JSON.stringify({ email, name, password }),
        });

        if (response.success && response.user) {
          const user = mapServerUserToUser(response.user, email);
          await startUserSession(user);
          return { success: true, user };
        }
        return { success: false, error: response.error };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    login: async (email, password) => {
      try {
        const response = await apiRequest<{ success: boolean; user?: { id: number; name: string }; error?: string }>('/login.php', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        if (response.success && response.user) {
          const user = mapServerUserToUser(response.user, email);
          await startUserSession(user);
          return { success: true, user };
        }
        return { success: false, error: response.error };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    logout: () => {
      endUserSession()
    }
  }
})
