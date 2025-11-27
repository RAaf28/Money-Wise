import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, 
  CreditCard, 
  Target, 
  Users, 
  Settings,
  X,
  TrendingUp,
  Wallet,
  Menu,
  Bot
} from 'lucide-react'
import { useAppStore } from '../store'

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Budget', href: '/budget', icon: TrendingUp },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'AI Companion', href: '/ai-companion', icon: Bot },
  { name: 'Social Circles', href: '/social', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { sidebarOpen, setSidebarOpen, user, logout } = useAppStore()
  const sidebarId = 'mobile-sidebar'
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  // Lock body scroll when mobile sidebar open (only on mobile)
  useEffect(() => {
    const isMobile = window.innerWidth < 1024 // lg breakpoint
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { 
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) setSidebarOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [sidebarOpen, setSidebarOpen])


  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        id={sidebarId}
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2" aria-label="Money Wise home">
              <Wallet className="h-8 w-8 text-blue-600" aria-hidden />
              <span className="text-xl font-bold text-gray-900">Money Wise</span>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              aria-label="Close sidebar"
              aria-controls={sidebarId}
              {...(sidebarOpen && { 'aria-expanded': 'true' })}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="px-3 flex-1 overflow-y-auto" aria-label="Primary">
            <div className="space-y-1">
              {navigation.map((item) => {
                // active for exact path OR nested routes (except root)
                const isActive =
                  item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden
                    />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center" aria-hidden>
                <span className="text-sm font-medium text-blue-600">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Health Score: {user?.financialHealthScore || 0}/100
                </p>
              </div>

              {/* Logout button */}
              {user && (
                <button
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                  title="Logout"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full">
        {/* Mobile menu button */}
        <div className="lg:hidden p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Open sidebar"
            aria-controls={sidebarId}
            {...(sidebarOpen && { 'aria-expanded': 'true' })}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="w-full">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            {children}
          </div>
        </main>
      </div>

    </div>
  ) 
}
