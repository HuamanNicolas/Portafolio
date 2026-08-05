import './Contacto.css';

function Contacto() {
  return (
    <div className="content-section reveal-fade" id="contacto">
      <h2>Contacto</h2>
      <p>¿Interesado en trabajar juntos? Envíame un mensaje.</p>
      
      <form className="contacto-form" onSubmit={(e) => e.preventDefault()}>
        <div className="contacto-form-group">
          <input 
            type="text" 
            placeholder="Nombre" 
            required 
            className="contacto-input" 
          />
        </div>
        <div className="contacto-form-group">
          <input 
            type="email" 
            placeholder="Email" 
            required 
            className="contacto-input" 
          />
        </div>
        <div className="contacto-form-group">
          <textarea 
            placeholder="Mensaje" 
            required 
            className="contacto-input contacto-textarea" 
            rows="4"
          ></textarea>
        </div>
        <button type="submit" className="contacto-submit">Enviar Mensaje</button>
      </form>
    </div>
  );
}

export default Contacto;
