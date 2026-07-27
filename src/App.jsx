import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import CrudAdmin from './components/admin/CrudAdmin'
import Login from './components/admin/Login'
import { auth } from './firebase/config'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import StarryBackground from './components/StarryBackground'
import './App.css'

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Escuchar cambios en la URL
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Observar el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const renderContent = () => {
    // Mostrar loading mientras verifica autenticación
    if (loading && currentPath === '/crud') {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          color: '#52B2A9'
        }}>
          <p>Verificando autenticación...</p>
        </div>
      )
    }

    if (currentPath === '/crud') {
      // Si no está autenticado, mostrar Login
      if (!user) {
        return <Login onLoginSuccess={() => setUser(auth.currentUser)} />
      }

      // Si está autenticado, mostrar CRUD
      return <CrudAdmin user={user} onLogout={handleLogout} />
    }

    return <Layout />
  }

  return (
    <div className="app">
      <StarryBackground />
      {renderContent()}
    </div>
  )
}

export default App
