import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute() {
  const { username } = useAuth()
  const location = useLocation()

  if (!username) {
    return <Navigate to="/dang-nhap" replace state={{ next: location.pathname }} />
  }

  return <Outlet />
}
