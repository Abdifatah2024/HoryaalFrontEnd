// components/ProtectedRoute.tsx
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '../Redux/store'

const ProtectedRoute = () => {
  const { data } = useSelector((state: RootState) => state.loginSlice)
  const isAuthenticated = !!data?.Access_token // Check if token exists

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />
}

export default ProtectedRoute