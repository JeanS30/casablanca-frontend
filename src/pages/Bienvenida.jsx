// src/pages/Bienvenida.jsx
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Bienvenida = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Navbar />

      {/* HERO con imagen de fondo */}
      <section
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          padding: '4rem 2rem',
          backgroundImage: 'url("/hero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '75vh'
        }}
      >
        {/* Overlay oscuro para legibilidad */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.2) 100%)',
            zIndex: 0
          }}
        />

        {/* Contenido del hero */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%'
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            <p
              style={{
                color: '#d4a017',
                letterSpacing: '3px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📍 VALLE DE CASABLANCA
            </p>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                lineHeight: '1.1',
                fontWeight: '800',
                marginBottom: '1.5rem',
                color: '#fff'
              }}
            >
              Descubre la esencia del{' '}
              <span style={{ color: '#d4a017' }}>Valle de Casablanca</span>
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: '#e0e0e0',
                marginBottom: '2.5rem',
                maxWidth: '550px'
              }}
            >
              Viñedos, naturaleza, patrimonio y experiencias únicas a pocos
              kilómetros de Valparaíso.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/rutas"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.9rem 1.75rem',
                  backgroundColor: '#d4a017',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                🧭 Explorar Rutas →
              </Link>

              <Link
                to="/rutas"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.9rem 1.75rem',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  border: '1.5px solid #fff'
                }}
              >
                🗺️ Ver Lugares
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FRANJA DE CHIPS CENTRADOS */}
      <section
        style={{
          padding: '1.5rem 2rem',
          backgroundColor: '#0f0f0f',
          borderTop: '1px solid #222',
          borderBottom: '1px solid #222'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          <Chip icono="🌊" texto="Borde Costero" />
          <Chip icono="🍇" texto="Enoturismo" />
          <Chip icono="🏛️" texto="Patrimonio" />
          <Chip icono="⛪" texto="Fe y Tradición" />
        </div>
      </section>

      <footer
        style={{
          padding: '1.5rem',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.8rem',
          backgroundColor: '#0f0f0f'
        }}
      >
        <p style={{ margin: 0 }}>
          Casablanca Digital — Plataforma de Turismo Inteligente · Proyecto INACAP 2026
        </p>
      </footer>
    </div>
  );
};

const Chip = ({ icono, texto }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.5rem 1rem',
      backgroundColor: 'rgba(30, 30, 30, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '20px',
      fontSize: '0.85rem',
      color: '#fff',
      fontWeight: '500'
    }}
  >
    <span>{icono}</span>
    <span>{texto}</span>
  </span>
);

export default Bienvenida;