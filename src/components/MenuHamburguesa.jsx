import { useState } from 'react'
import './MenuHamburguesa.css'

function MenuHamburguesa({ scrollToSection, activeSection }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuItemClick = (sectionId) => {
    scrollToSection(sectionId)
    setIsOpen(false) // Cerrar el menú después de navegar
  }

  return (
    <div className="menu-hamburguesa">
      <button 
        className={`hamburger-button ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Menú de navegación"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <div className="mobile-nav-overlay" onClick={toggleMenu}></div>
        <div className="mobile-nav-content">
          <h3>Navegación</h3>
          <ul>
            <li>
              <button 
                onClick={() => handleMenuItemClick('sobre-mi')}
                className={activeSection === 'sobre-mi' ? 'active' : ''}
              >
                Sobre mí
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleMenuItemClick('experiencia')}
                className={activeSection === 'experiencia' ? 'active' : ''}
              >
                Experiencia
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleMenuItemClick('proyectos')}
                className={activeSection === 'proyectos' ? 'active' : ''}
              >
                Proyectos
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleMenuItemClick('habilidades')}
                className={activeSection === 'habilidades' ? 'active' : ''}
              >
                Habilidades
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleMenuItemClick('contacto')}
                className={activeSection === 'contacto' ? 'active' : ''}
              >
                Contacto
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default MenuHamburguesa