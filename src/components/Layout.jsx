import { useState, useEffect } from 'react'
import PerfilPersonal from './PerfilPersonal'
import ContenidoPrincipal from './ContenidoPrincipal'
import './Layout.css'

function Layout() {
  const [activeSection, setActiveSection] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Detectar qué sección está activa
      const sections = ['sobre-mi', 'experiencia', 'proyectos', 'habilidades', 'contacto']
      const sectionOffsets = sections.map(id => {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          return {
            id,
            offsetTop: element.offsetTop,
            height: element.offsetHeight,
            top: rect.top
          }
        }
        return null
      }).filter(Boolean)

      // Encontrar la sección cuyo centro esté más cerca del centro de la pantalla
      const viewportCenter = window.innerHeight / 2
      let currentActive = ''
      let minDistance = Infinity
      
      for (const section of sectionOffsets) {
        // Distancia del centro de la sección al centro de la pantalla
        const sectionCenter = section.top + (section.height / 2)
        const distance = Math.abs(sectionCenter - viewportCenter)
        
        if (distance < minDistance) {
          minDistance = distance
          currentActive = section.id
        }
      }
      
      if (currentActive) {
        setActiveSection(currentActive)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Ejecutar una vez al montar
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // Función para hacer scroll a secciones
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="layout">
      <PerfilPersonal 
        scrollToSection={scrollToSection} 
        activeSection={activeSection}
        isMobile={isMobile}
      />
      <ContenidoPrincipal 
        isMobile={isMobile}
      />
    </div>
  )
}

export default Layout