// ...new file...
export interface ClientUser {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
  financialHealthScore?: number
}

const STORAGE_KEY = 'moneywise_users'

function getUsersFromStorage(): ClientUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ClientUser[]
  } catch {
    return []
  }
}

function saveUsersToStorage(users: ClientUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export async function createUser(user: Omit<ClientUser, 'id' | 'createdAt'>): Promise<ClientUser> {
  const users = getUsersFromStorage()
  const exists = users.find(u => u.email.toLowerCase() === user.email.toLowerCase())
  if (exists) throw new Error('Email already registered')
  const newUser: ClientUser = {
    ...user,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    financialHealthScore: user.financialHealthScore ?? 75,
  }
  users.push(newUser)
  saveUsersToStorage(users)
  return newUser
}

export async function getUserByEmail(email: string): Promise<ClientUser | undefined> {
  const users = getUsersFromStorage()
  return users.find(u => u.email.toLowerCase() === email.toLowerCase())
}

export async function validateCredentials(email: string, passwordHash: string): Promise<ClientUser | null> {
  const user = await getUserByEmail(email)
  if (!user) return null
  if (user.passwordHash !== passwordHash) return null
  return user
}