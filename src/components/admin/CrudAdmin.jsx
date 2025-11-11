import { useState } from 'react'
import CrudExperiencias from './CrudExperiencias'
import CrudProyectos from './CrudProyectos'
import './CrudAdmin.css'

function CrudAdmin({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('experiencias')

  const volverAlPortfolio = () => {
    window.location.href = '/'
  }

  return (
    <div className="crud-admin">
      <header className="crud-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Panel de Administración</h1>
            <p>Gestiona el contenido de tu portfolio</p>
          </div>
          <div className="header-right">
            {user && (
              <div className="user-info">
                <span className="user-email">{user.email}</span>
                <button onClick={onLogout} className="btn-logout">
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
        <button onClick={volverAlPortfolio} className="btn-back">
          ← Volver al Portfolio
        </button>
      </header>

      <nav className="crud-tabs">
        <button 
          className={`tab-button ${activeTab === 'experiencias' ? 'active' : ''}`}
          onClick={() => setActiveTab('experiencias')}
        >
          Experiencias
        </button>
        <button 
          className={`tab-button ${activeTab === 'proyectos' ? 'active' : ''}`}
          onClick={() => setActiveTab('proyectos')}
        >
          Proyectos
        </button>
      </nav>

      <main className="crud-content">
        {activeTab === 'experiencias' && <CrudExperiencias />}
        {activeTab === 'proyectos' && <CrudProyectos />}
      </main>

      <footer className="crud-footer">
        <p>© 2024 Nicolas Huaman - Panel de Administración</p>
      </footer>
    </div>
  )
}

export default CrudAdmin