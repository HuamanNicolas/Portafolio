import { useState, useEffect, useRef } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import pandooImage from '../assets/proyectos/Pandoo.png'
import './Proyectos.css'

function Proyectos() {
  const [proyectos, setProyectos] = useState([])
  const [loadingProyectos, setLoadingProyectos] = useState(true)
  const gridRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (gridRef.current) {
        const gridRect = gridRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        // El punto de progreso sigue el centro de la pantalla
        const triggerY = windowHeight * 0.5
        
        // Cuánto hemos scrolleado dentro de la grilla (desde la parte superior)
        const scrolled = triggerY - gridRect.top
        
        let progress = 0
        if (scrolled > 0) {
          // Porcentaje de progreso basado en la altura total de la grilla
          progress = (scrolled / gridRect.height) * 100
        }
        
        // Limitar entre 0 y 100
        progress = Math.max(0, Math.min(100, progress))
        
        gridRef.current.style.setProperty('--scroll-fill', `${progress}%`)
      }
    }

    window.addEventListener('scroll', handleScroll)
    // Initial call to set state if already scrolled
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [proyectos])

  // Cargar proyectos de Firebase
  useEffect(() => {
    const cargarProyectos = async () => {
      try {
        setLoadingProyectos(true)
        const proyectosRef = collection(db, 'proyectos')
        const q = query(proyectosRef, orderBy('fecha', 'desc')) // Ordenar por fecha descendente
        const querySnapshot = await getDocs(q)
        
        const proyectosData = []
        querySnapshot.forEach((doc) => {
          proyectosData.push({
            id: doc.id,
            ...doc.data()
          })
        })
        
        setProyectos(proyectosData)
      } catch (error) {
        console.error('Error al cargar proyectos:', error)
        // Datos de ejemplo si falla Firebase
        setProyectos([
          {
            id: 1,
            nombre: 'Portfolio Personal',
            descripcion: 'Sitio web personal desarrollado con React y Vite, con animaciones suaves y diseño responsivo.',
            tecnologias: ['React', 'Vite', 'CSS', 'Firebase'],
            enlace: 'https://github.com/usuario/portfolio',
            fecha: '2024'
          },
          {
            id: 2,
            nombre: 'Aplicación de Tareas',
            descripcion: 'App web para gestión de tareas con autenticación de usuarios y base de datos en tiempo real.',
            tecnologias: ['React', 'Node.js', 'MongoDB', 'Express'],
            enlace: 'https://github.com/usuario/todo-app',
            fecha: '2023'
          },
          {
            id: 3,
            nombre: 'E-commerce',
            descripcion: 'Tienda online completa con carrito de compras, pagos integrados y panel de administración.',
            tecnologias: ['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
            enlace: 'https://github.com/usuario/ecommerce',
            fecha: '2023'
          }
        ])
      } finally {
        setLoadingProyectos(false)
      }
    }

    cargarProyectos()
  }, [])

  return (
    <div className="content-section" id="proyectos">
      <h2>Proyectos</h2>
      <p>Algunos de los proyectos en los que he trabajado</p>
      
      {loadingProyectos ? (
        <div className="loading-container">
          <p>Cargando proyectos...</p>
        </div>
      ) : (
        <div className="proyectos-grid" ref={gridRef}>
          <div className="timeline-progress" style={{ height: 'var(--scroll-fill, 0%)' }}>
            <div className="timeline-dot"></div>
          </div>
          {proyectos.map((proyecto) => (
            <div key={proyecto.id} className="proyecto-card">
              <div className="proyecto-header">
                <h3>{proyecto.nombre}</h3>
                {proyecto.fecha && (
                  <span className="proyecto-fecha">{proyecto.fecha}</span>
                )}
              </div>
              <p className="proyecto-descripcion">{proyecto.descripcion}</p>
              
              {proyecto.imagen && (
                <div className="proyecto-imagen-interna">
                  <img src={proyecto.imagen} alt={proyecto.nombre} className="imagen-proyecto-interna" />
                </div>
              )}
              
              {proyecto.tecnologias && (
                <div className="proyecto-tecnologias">
                  <h4>Tecnologías:</h4>
                  <div className="tecnologias-tags">
                    {(Array.isArray(proyecto.tecnologias) 
                      ? proyecto.tecnologias 
                      : proyecto.tecnologias.split(',')
                    ).map((tecnologia, index) => (
                      <span key={index} className="tecnologia-tag">
                        {typeof tecnologia === 'string' ? tecnologia.trim() : tecnologia}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {proyecto.enlace && (
                <div className="proyecto-enlaces">
                  <a 
                    href={proyecto.enlace} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="proyecto-enlace"
                  >
                    Ver Proyecto
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {!loadingProyectos && proyectos.length === 0 && (
        <div className="no-proyectos">
          <p>No hay proyectos disponibles en este momento.</p>
        </div>
      )}
    </div>
  )
}

export default Proyectos