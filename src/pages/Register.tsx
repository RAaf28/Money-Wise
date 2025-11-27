// ...new file...
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppStore } from '../store'
import { Eye, EyeOff } from 'lucide-react'

export function Register() {
  const register = useAppStore(s => s.register)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const res = await register(name, email, password)
    if (!res.success) {
      setError(res.error || 'Registration failed')
      return
    }
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-md p-6 shadow">
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="register-name" className="block mb-1 text-sm font-medium">Name</label>
          <input id="register-name" className="w-full border rounded p-2" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="register-email" className="block mb-1 text-sm font-medium">Email</label>
          <input id="register-email" type="email" className="w-full border rounded p-2" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="register-password" className="block mb-1 text-sm font-medium">Password</label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              className="w-full border rounded p-2 pr-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-2 top-2 text-gray-500"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex justify-between items-center">
          <div>
            <Link to="/login" className="text-sm text-blue-600 hover:underline">Already have an account? Sign in</Link>
          </div>
          <div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Register</button>
          </div>
        </div>
      </form>
    </div>
  )
}