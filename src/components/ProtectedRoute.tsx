import { Navigate } from 'react-router-dom'
import { useAppStore } from '../store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAppStore(s => s.user)
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

