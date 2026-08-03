import { useState, useEffect } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import bcfexaLogo from '../assets/experiencias/Bcfexa.png'
import crecerLogo from '../assets/experiencias/Crecer.png'
import './Experiencia.css'

function Experiencia() {
  const [experiencias, setExperiencias] = useState([])
  const [loadingExperiencias, setLoadingExperiencias] = useState(true)

  // Cargar experiencias de Firebase
  useEffect(() => {
    const cargarExperiencias = async () => {
      // 1. Intentar cargar desde caché primero
      const cachedExperiencias = localStorage.getItem('portfolio_experiencias')
      if (cachedExperiencias) {
        setExperiencias(JSON.parse(cachedExperiencias))
        setLoadingExperiencias(false)
      } else {
        setLoadingExperiencias(true)
      }

      // 2. Buscar datos frescos
      try {
        const experienciasRef = collection(db, 'experiencia')
        const q = query(experienciasRef, orderBy('año', 'desc')) 
        const querySnapshot = await getDocs(q)
        
        const experienciasData = []
        querySnapshot.forEach((doc) => {
          experienciasData.push({
            id: doc.id,
            ...doc.data()
          })
        })
        
        setExperiencias(experienciasData)
        localStorage.setItem('portfolio_experiencias', JSON.stringify(experienciasData))
        
        if (!cachedExperiencias) {
          setLoadingExperiencias(false)
        }
      } catch (error) {
        console.error('Error al cargar experiencias:', error)
        
        if (!cachedExperiencias) {
          setLoadingExperiencias(false)
        }
      }
    }

    cargarExperiencias()
  }, [])

  return (
    <div className="content-section" id="experiencia">
      <h2>Experiencia Laboral</h2>
      <p>Mi trayectoria profesional y experiencias en el desarrollo web</p>
      
      {loadingExperiencias ? (
        <div className="loading-container">
          <p>Cargando experiencias...</p>
        </div>
      ) : (
        <div className="experiencias-grid">
          {experiencias.map((experiencia, index) => (
            <div key={experiencia.id} className="experiencia-card">
              {experiencia.imagen && (
                <div className="experiencia-imagen-container">
                  <img 
                    src={experiencia.imagen} 
                    alt={`Logo ${experiencia.empresa || 'empresa'}`}
                    className="logo-experiencia"
                  />
                </div>
              )}
              <div className="experiencia-content">
                <h3>{experiencia.titulo || experiencia.empresa || 'Puesto'}</h3>
                <h4>{experiencia.año}</h4>
                <p className="experiencia-descripcion">{experiencia.descripcion}</p>
                {experiencia.habilidades && (
                  <div className="experiencia-habilidades">
                    <h4>Habilidades:</h4>
                    <div className="habilidades-tags">
                      {(Array.isArray(experiencia.habilidades) 
                        ? experiencia.habilidades 
                        : experiencia.habilidades.split(',')
                      ).map((habilidad, index) => (
                        <span key={index} className="habilidad-tag">
                          {typeof habilidad === 'string' ? habilidad.trim() : habilidad}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  )
}

export default Experiencia