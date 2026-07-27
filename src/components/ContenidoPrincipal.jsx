import Experiencia from './Experiencia'
import Proyectos from './Proyectos'
import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { GraduationCap, Code2, Target } from 'lucide-react'
import './ContenidoPrincipal.css'

function ContenidoPrincipal({ isMobile }) {
  const [habilidades, setHabilidades] = useState([])
  const [loadingHabilidades, setLoadingHabilidades] = useState(true)

  // Cargar y procesar habilidades de experiencias y proyectos
  useEffect(() => {
    const cargarHabilidades = async () => {

      setLoadingHabilidades(true)

      // Cargar experiencias
      const experienciasRef = collection(db, 'experiencia')
      const experienciasSnapshot = await getDocs(experienciasRef)

      // Cargar proyectos
      const proyectosRef = collection(db, 'proyectos')
      const proyectosSnapshot = await getDocs(proyectosRef)

      const todasHabilidades = new Set()

      // Procesar habilidades de experiencias
      experienciasSnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.habilidades) {
          const habilidadesArray = Array.isArray(data.habilidades)
            ? data.habilidades
            : data.habilidades.split(',')

          habilidadesArray.forEach(habilidad => {
            if (typeof habilidad === 'string') {
              todasHabilidades.add(habilidad.trim())
            }
          })
        }
      })

      // Procesar habilidades de proyectos (tecnologías)
      proyectosSnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.tecnologias) {
          const tecnologiasArray = Array.isArray(data.tecnologias)
            ? data.tecnologias
            : data.tecnologias.split(',')

          tecnologiasArray.forEach(tecnologia => {
            if (typeof tecnologia === 'string') {
              todasHabilidades.add(tecnologia.trim())
            }
          })
        }
      })

      // Convertir Set a Array y ordenar
      setHabilidades(Array.from(todasHabilidades).sort())


      setLoadingHabilidades(false)

    }

    cargarHabilidades()
  }, [])
  return (
    <div className={`revealed-content ${isMobile ? 'mobile-content' : ''}`}>

      {/* Sección Sobre Mí */}
      <div className="content-section" id="sobre-mi">
        <h2>Sobre Mí</h2>
        <p>
          Programador Web egresado de la UNSJ y desarrollador enfocado en crear soluciones digitales eficientes para PyMEs, emprendedores y proyectos independientes. A lo largo de mi formación y trayectoria, he consolidado habilidades técnicas en tecnologías web modernas y metodologías colaborativas. Disfruto enfrentando nuevos desafíos tecnológicos, optimizando el rendimiento de las aplicaciones y construyendo herramientas a medida que potencien los objetivos de cada cliente.
        </p>
        <div className="sobre-mi-list">
          <div className="sobre-mi-item">
            <div className="item-icon">
              <GraduationCap size={24} />
            </div>
            <div className="item-content">
              <h3>Formación Académica</h3>
              <p>Estudiante de Programación Web en la UNSJ, enfocado en tecnologías modernas de desarrollo frontend y backend.</p>
            </div>
          </div>
          <div className="sobre-mi-item">
            <div className="item-icon">
              <Code2 size={24} />
            </div>
            <div className="item-content">
              <h3>Enfoque Técnico</h3>
              <p>Especializado en React, JavaScript, Node.js y bases de datos, con experiencia en desarrollo full-stack.</p>
            </div>
          </div>
          <div className="sobre-mi-item">
            <div className="item-icon">
              <Target size={24} />
            </div>
            <div className="item-content">
              <h3>Objetivos</h3>
              <p>Busco aplicar mis conocimientos en un entorno profesional y seguir creciendo como desarrollador web.</p>
            </div>
          </div>
        </div>

        {/* Sección de Habilidades */}
        <div className="habilidades-section">
          <h3>Habilidades y Tecnologías</h3>
          <p>Tecnologías y herramientas que he utilizado en mis experiencias laborales y proyectos</p>

          {loadingHabilidades ? (
            <div className="loading-habilidades">
              <p>Cargando habilidades...</p>
            </div>
          ) : (
            <div className="habilidades-grid">
              {habilidades.map((habilidad, index) => (
                <div key={index} className="habilidad-item">
                  {habilidad}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Experiencia />
      <Proyectos />

      {/* Contenido adicional para generar scroll */}
      {/* <div className="extra-content">
        <h2>Contacto</h2>
        <p>¿Interesado en trabajar juntos? No dudes en contactarme.</p>
        <div className="contacto-info">
          <div className="contacto-card">
            <h3>Email</h3>
            <p>nicolas.huaman@example.com</p>
          </div>
          <div className="contacto-card">
            <h3>LinkedIn</h3>
            <p>linkedin.com/in/nicolas-huaman</p>
          </div>
          <div className="contacto-card">
            <h3>GitHub</h3>
            <p>github.com/nicolas-huaman</p>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default ContenidoPrincipal