import { useState, useEffect } from 'react'
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy, 
  query 
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import './CrudProyectos.css'

function CrudProyectos() {
  const [proyectos, setProyectos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tecnologias: '',
    enlace: '',
    fecha: '',
    imagen: ''
  })

  // Cargar proyectos
  const cargarProyectos = async () => {
    try {
      setLoading(true)
      console.log('Intentando cargar proyectos...')
      const proyectosRef = collection(db, 'proyectos')
      const q = query(proyectosRef, orderBy('fecha', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const proyectosData = []
      querySnapshot.forEach((doc) => {
        proyectosData.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      console.log('Proyectos cargados:', proyectosData.length)
      setProyectos(proyectosData)
    } catch (error) {
      console.error('Error detallado al cargar proyectos:', error)
      console.error('Código de error:', error.code)
      console.error('Mensaje:', error.message)
      alert(`Error al cargar proyectos: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarProyectos()
  }, [])

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Crear nuevo proyecto
  const crearProyecto = async (e) => {
    e.preventDefault()
    
    if (!formData.nombre || !formData.descripcion) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    try {
      const tecnologiasArray = formData.tecnologias 
        ? formData.tecnologias.split(',').map(t => t.trim())
        : []

      await addDoc(collection(db, 'proyectos'), {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        tecnologias: tecnologiasArray,
        enlace: formData.enlace,
        fecha: formData.fecha || new Date().getFullYear().toString(),
        imagen: formData.imagen || '',
        fechaCreacion: new Date()
      })

      alert('Proyecto creado exitosamente')
      limpiarFormulario()
      cargarProyectos()
    } catch (error) {
      console.error('Error al crear proyecto:', error)
      alert('Error al crear proyecto')
    }
  }

  // Editar proyecto
  const editarProyecto = (proyecto) => {
    setEditingId(proyecto.id)
    setFormData({
      nombre: proyecto.nombre || '',
      descripcion: proyecto.descripcion || '',
      tecnologias: Array.isArray(proyecto.tecnologias) 
        ? proyecto.tecnologias.join(', ')
        : proyecto.tecnologias || '',
      enlace: proyecto.enlace || '',
      fecha: proyecto.fecha || '',
      imagen: proyecto.imagen || ''
    })
  }

  // Actualizar proyecto
  const actualizarProyecto = async (e) => {
    e.preventDefault()
    
    if (!formData.nombre || !formData.descripcion) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    try {
      const tecnologiasArray = formData.tecnologias 
        ? formData.tecnologias.split(',').map(t => t.trim())
        : []

      const proyectoRef = doc(db, 'proyectos', editingId)
      await updateDoc(proyectoRef, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        tecnologias: tecnologiasArray,
        enlace: formData.enlace,
        fecha: formData.fecha || new Date().getFullYear().toString(),
        imagen: formData.imagen || '',
        fechaActualizacion: new Date()
      })

      alert('Proyecto actualizado exitosamente')
      limpiarFormulario()
      setEditingId(null)
      cargarProyectos()
    } catch (error) {
      console.error('Error al actualizar proyecto:', error)
      alert('Error al actualizar proyecto')
    }
  }

  // Eliminar proyecto
  const eliminarProyecto = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      return
    }

    try {
      await deleteDoc(doc(db, 'proyectos', id))
      alert('Proyecto eliminado exitosamente')
      cargarProyectos()
    } catch (error) {
      console.error('Error al eliminar proyecto:', error)
      alert('Error al eliminar proyecto')
    }
  }

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      tecnologias: '',
      enlace: '',
      fecha: '',
      imagen: ''
    })
    setEditingId(null)
  }

  if (loading) {
    return <div className="crud-loading">Cargando proyectos...</div>
  }

  return (
    <div className="crud-proyectos">
      <h2>Gestión de Proyectos</h2>
      
      {/* Formulario */}
      <form onSubmit={editingId ? actualizarProyecto : crearProyecto} className="crud-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Proyecto *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Mi Portfolio"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fecha">Año</label>
            <input
              type="text"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              placeholder="2024"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción *</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Describe el proyecto, sus características y objetivos..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tecnologias">Tecnologías (separadas por comas)</label>
          <input
            type="text"
            id="tecnologias"
            name="tecnologias"
            value={formData.tecnologias}
            onChange={handleInputChange}
            placeholder="React, Vite, Firebase, CSS"
          />
        </div>

        <div className="form-group">
          <label htmlFor="enlace">Enlace (GitHub, Demo, etc.)</label>
          <input
            type="url"
            id="enlace"
            name="enlace"
            value={formData.enlace}
            onChange={handleInputChange}
            placeholder="https://github.com/usuario/proyecto"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imagen">Ruta de la Imagen</label>
          <input
            type="text"
            id="imagen"
            name="imagen"
            value={formData.imagen}
            onChange={handleInputChange}
            placeholder="Ejemplo: /proyecto1.jpg (Asegúrate de colocarla en la carpeta public)"
          />
          {formData.imagen && (
            <div className="image-preview" style={{ marginTop: '10px' }}>
              <img src={formData.imagen} alt="Vista previa" style={{ maxWidth: '200px', borderRadius: '4px' }} />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingId ? 'Actualizar' : 'Crear'} Proyecto
          </button>
          {editingId && (
            <button type="button" onClick={limpiarFormulario} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de proyectos */}
      <div className="proyectos-list">
        <h3>Proyectos Actuales ({proyectos.length})</h3>
        {proyectos.length === 0 ? (
          <p className="no-data">No hay proyectos registrados</p>
        ) : (
        <div className="crud-proyectos-grid">
          {proyectos.map((proyecto) => (
            <div key={proyecto.id} className="crud-proyecto-card">
                <div className="card-header">
                  <h4>{proyecto.nombre}</h4>
                  {proyecto.fecha && (
                    <span className="fecha-badge">{proyecto.fecha}</span>
                  )}
                </div>
                
                <p className="descripcion">{proyecto.descripcion}</p>
                
                {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
                  <div className="tecnologias">
                    {(Array.isArray(proyecto.tecnologias) 
                      ? proyecto.tecnologias 
                      : proyecto.tecnologias.split(',')
                    ).map((tecnologia, index) => (
                      <span key={index} className="tecnologia-tag">
                        {typeof tecnologia === 'string' ? tecnologia.trim() : tecnologia}
                      </span>
                    ))}
                  </div>
                )}
                
                {proyecto.enlace && (
                  <div className="enlace">
                    <a href={proyecto.enlace} target="_blank" rel="noopener noreferrer">
                      Ver Proyecto
                    </a>
                  </div>
                )}
                
                <div className="card-actions">
                  <button 
                    onClick={() => editarProyecto(proyecto)}
                    className="btn-edit"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => eliminarProyecto(proyecto.id)}
                    className="btn-delete"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CrudProyectos