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
import { compressImageToBase64 } from '../../utils/imageCompression'
import './CrudExperiencias.css'

function CrudExperiencias() {
  const [experiencias, setExperiencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    año: '',
    puesto: '',
    empresa: '',
    descripcion: '',
    habilidades: '',
    imagen: ''
  })

  // Cargar experiencias
  const cargarExperiencias = async () => {
    try {
      setLoading(true)
      console.log('Intentando cargar experiencias...')
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
      
      console.log('Experiencias cargadas:', experienciasData.length)
      setExperiencias(experienciasData)
    } catch (error) {
      console.error('Error detallado al cargar experiencias:', error)
      console.error('Código de error:', error.code)
      console.error('Mensaje:', error.message)
      alert(`Error al cargar experiencias: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarExperiencias()
  }, [])

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const base64 = await compressImageToBase64(file)
        setFormData(prev => ({ ...prev, imagen: base64 }))
      } catch (error) {
        console.error("Error al procesar la imagen:", error)
        alert("Error al procesar la imagen")
      }
    }
  }

  // Crear nueva experiencia
  const crearExperiencia = async (e) => {
    e.preventDefault()
    
    if (!formData.año || !formData.puesto || !formData.descripcion) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    try {
      const habilidadesArray = formData.habilidades 
        ? formData.habilidades.split(',').map(h => h.trim())
        : []

      await addDoc(collection(db, 'experiencia'), {
        año: parseInt(formData.año),
        puesto: formData.puesto,
        empresa: formData.empresa,
        descripcion: formData.descripcion,
        habilidades: habilidadesArray,
        imagen: formData.imagen || '',
        fechaCreacion: new Date()
      })

      alert('Experiencia creada exitosamente')
      limpiarFormulario()
      cargarExperiencias()
    } catch (error) {
      console.error('Error al crear experiencia:', error)
      alert('Error al crear experiencia')
    }
  }

  // Editar experiencia
  const editarExperiencia = (experiencia) => {
    setEditingId(experiencia.id)
    setFormData({
      año: experiencia.año.toString(),
      puesto: experiencia.puesto || '',
      empresa: experiencia.empresa || '',
      descripcion: experiencia.descripcion || '',
      habilidades: Array.isArray(experiencia.habilidades) 
        ? experiencia.habilidades.join(', ')
        : experiencia.habilidades || '',
      imagen: experiencia.imagen || ''
    })
  }

  // Actualizar experiencia
  const actualizarExperiencia = async (e) => {
    e.preventDefault()
    
    if (!formData.año || !formData.puesto || !formData.descripcion) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    try {
      const habilidadesArray = formData.habilidades 
        ? formData.habilidades.split(',').map(h => h.trim())
        : []

      const experienciaRef = doc(db, 'experiencia', editingId)
      await updateDoc(experienciaRef, {
        año: parseInt(formData.año),
        puesto: formData.puesto,
        empresa: formData.empresa,
        descripcion: formData.descripcion,
        habilidades: habilidadesArray,
        imagen: formData.imagen || '',
        fechaActualizacion: new Date()
      })

      alert('Experiencia actualizada exitosamente')
      limpiarFormulario()
      setEditingId(null)
      cargarExperiencias()
    } catch (error) {
      console.error('Error al actualizar experiencia:', error)
      alert('Error al actualizar experiencia')
    }
  }

  // Eliminar experiencia
  const eliminarExperiencia = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) {
      return
    }

    try {
      await deleteDoc(doc(db, 'experiencia', id))
      alert('Experiencia eliminada exitosamente')
      cargarExperiencias()
    } catch (error) {
      console.error('Error al eliminar experiencia:', error)
      alert('Error al eliminar experiencia')
    }
  }

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      año: '',
      puesto: '',
      empresa: '',
      descripcion: '',
      habilidades: '',
      imagen: ''
    })
    setEditingId(null)
  }

  if (loading) {
    return <div className="crud-loading">Cargando experiencias...</div>
  }

  return (
    <div className="crud-experiencias">
      <h2>Gestión de Experiencias</h2>
      
      {/* Formulario */}
      <form onSubmit={editingId ? actualizarExperiencia : crearExperiencia} className="crud-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="año">Año *</label>
            <input
              type="number"
              id="año"
              name="año"
              value={formData.año}
              onChange={handleInputChange}
              placeholder="2024"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="puesto">Puesto *</label>
            <input
              type="text"
              id="puesto"
              name="puesto"
              value={formData.puesto}
              onChange={handleInputChange}
              placeholder="Desarrollador Frontend"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="empresa">Empresa</label>
          <input
            type="text"
            id="empresa"
            name="empresa"
            value={formData.empresa}
            onChange={handleInputChange}
            placeholder="Nombre de la empresa"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción *</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Describe las responsabilidades y logros..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="habilidades">Habilidades (separadas por comas)</label>
          <input
            type="text"
            id="habilidades"
            name="habilidades"
            value={formData.habilidades}
            onChange={handleInputChange}
            placeholder="React, JavaScript, CSS, Node.js"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imagen">Imagen (Logo)</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            onChange={handleImageChange}
          />
          {formData.imagen && (
            <div className="image-preview" style={{ marginTop: '10px' }}>
              <img src={formData.imagen} alt="Vista previa" style={{ maxWidth: '100px', borderRadius: '4px' }} />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingId ? 'Actualizar' : 'Crear'} Experiencia
          </button>
          {editingId && (
            <button type="button" onClick={limpiarFormulario} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de experiencias */}
      <div className="experiencias-list">
        <h3>Experiencias Actuales ({experiencias.length})</h3>
        {experiencias.length === 0 ? (
          <p className="no-data">No hay experiencias registradas</p>
        ) : (
        <div className="crud-experiencias-grid">
          {experiencias.map((experiencia) => (
            <div key={experiencia.id} className="crud-experiencia-card">
                <div className="card-header">
                  <h4>{experiencia.puesto}</h4>
                  <span className="año-badge">{experiencia.año}</span>
                </div>
                
                {experiencia.empresa && (
                  <p className="empresa">{experiencia.empresa}</p>
                )}
                
                <p className="descripcion">{experiencia.descripcion}</p>
                
                {experiencia.habilidades && experiencia.habilidades.length > 0 && (
                  <div className="habilidades">
                    {(Array.isArray(experiencia.habilidades) 
                      ? experiencia.habilidades 
                      : experiencia.habilidades.split(',')
                    ).map((habilidad, index) => (
                      <span key={index} className="habilidad-tag">
                        {typeof habilidad === 'string' ? habilidad.trim() : habilidad}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="card-actions">
                  <button 
                    onClick={() => editarExperiencia(experiencia)}
                    className="btn-edit"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => eliminarExperiencia(experiencia.id)}
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

export default CrudExperiencias