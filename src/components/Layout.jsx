import { useState, useEffect } from 'react'
import PerfilPersonal from './PerfilPersonal'
import ContenidoPrincipal from './ContenidoPrincipal'
import './Layout.css'

function Layout() {
  const [scrollY, setScrollY] = useState(0)
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
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      
      
      if (!isMobile) {
        // Detectar qué sección está activa
        const sections = ['sobre-mi', 'experiencia', 'proyectos', 'habilidades']
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

        // Encontrar la sección activa (la que está más cerca del centro de la pantalla)
        const viewportCenter = window.innerHeight / 2
        let currentActive = ''
        
        for (const section of sectionOffsets) {
          if (section.top <= viewportCenter && section.top + section.height > viewportCenter) {
            currentActive = section.id
            break
          }
        }
        
        // Si no hay sección en el centro, usar la más cercana
        if (!currentActive && sectionOffsets.length > 0) {
          const closest = sectionOffsets.reduce((prev, curr) => {
            return Math.abs(curr.top - viewportCenter) < Math.abs(prev.top - viewportCenter) ? curr : prev
          })
          if (Math.abs(closest.top - viewportCenter) < 300) { // Solo si está relativamente cerca
            currentActive = closest.id
          }
        }
        
        setActiveSection(currentActive)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Ejecutar una vez al montar
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // Calculamos el progreso del scroll (0 = inicio, 1 = transformación completa)
  // En móvil, siempre está en estado final
  const scrollProgress = isMobile ? 1 : Math.min(scrollY / 500, 1)
  const isScrolled = isMobile ? true : scrollProgress > 0.3

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
        scrollProgress={scrollProgress} 
        isScrolled={isScrolled} 
        scrollToSection={scrollToSection} 
        activeSection={activeSection}
        isMobile={isMobile}
      />
      <ContenidoPrincipal 
        scrollProgress={scrollProgress} 
        isMobile={isMobile}
      />
    </div>
  )
}

export default Layout