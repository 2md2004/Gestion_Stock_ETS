import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import api from '../services/api'
import { URL_ME } from '../constants/server'

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState(null) // null = vérification en cours

  useEffect(() => {
    api.get(URL_ME)
      .then(() => {
        console.log('✅ Token valide')
        setIsAuth(true)
      })
      .catch(() => {
        console.log('🔒 Token invalide ou expiré, nettoyage session')
        sessionStorage.clear()
        setIsAuth(false)
      })
  }, [])

  if (isAuth === null) {
    return <div className="text-center mt-5">Chargement...</div>
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute