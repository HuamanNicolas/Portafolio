import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import profileImage from '../assets/imagen-perfil.png'
import MenuHamburguesa from './MenuHamburguesa'
import './PerfilPersonal.css'

function PerfilPersonal({ scrollToSection, activeSection, isMobile }) {
  return (
    <>
      {/* Menú hamburguesa solo en móvil */}
      {isMobile && (
        <MenuHamburguesa
          scrollToSection={scrollToSection}
          activeSection={activeSection}
        />
      )}

      <div className={`sticky-container ${isMobile ? 'mobile-view' : ''}`}>
        <div className="hero-content">
          <div className={`presentacion-container scrolled ${isMobile ? 'mobile-layout' : ''}`}>
            <div className={`image-container circular`}>
              <img
                src={profileImage}
                alt="Nicolas Huaman"
                className="profile-image"
              />
            </div>

            <div className="info">
              <h1>Nicolas Huaman</h1>
              <h2>Desarrollador Web</h2>
              <p className={`description hidden ${isMobile ? 'mobile-description' : ''}`}>
                Soy Nico, estudiante de la UNSJ, próximo a recibirme como Programador Web.
                Me apasiona la programación y busco aplicar mis conocimientos en el ámbito laboral.
                He trabajado en proyectos colaborativos que me permitieron crecer tanto en lo técnico como en lo personal,
                y estoy motivado para aportar lo mejor de mí en cada desafío.
              </p>

              {/* Navegación solo en escritorio */}
              {!isMobile && (
                <nav className="navigation visible">
                  <ul>
                    <li>
                      <button
                        onClick={() => scrollToSection('sobre-mi')}
                        className={activeSection === 'sobre-mi' ? 'active' : ''}
                      >
                        Sobre mí
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection('experiencia')}
                        className={activeSection === 'experiencia' ? 'active' : ''}
                      >
                        Experiencia
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection('proyectos')}
                        className={activeSection === 'proyectos' ? 'active' : ''}
                      >
                        Proyectos
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection('habilidades')}
                        className={activeSection === 'habilidades' ? 'active' : ''}
                      >
                        Habilidades
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection('contacto')}
                        className={activeSection === 'contacto' ? 'active' : ''}
                      >
                        Contacto
                      </button>
                    </li>
                  </ul>
                </nav>
              )}

              <div className="social-icons">
                <a href="https://github.com/HuamanNicolas" target="_blank" rel="noopener noreferrer">
                  <FaGithub />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin />
                </a>
                <a href="mailto:nicolas.h2010fr@gmail.com">
                  <FaEnvelope />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PerfilPersonal