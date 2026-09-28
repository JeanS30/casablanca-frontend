// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#0a0a0a',
        borderBottom: '1px solid #222',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <img
          src="/logo.png"
          alt="Logo Valle de Casablanca"
          style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '50%' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem', letterSpacing: '0.5px' }}>
            Casablanca
          </span>
          <span style={{ color: '#b8860b', fontSize: '0.7rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Digital
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link to="/" style={botonGhost}>Inicio</Link>
        <Link to="/rutas" style={botonGhost}>Rutas</Link>
        <Link to="/mis-logros" style={botonGhost}>🏆 Mis Logros</Link>
        <Link to="/perfilamiento" style={botonSolido}>Registrarme</Link>
      </div>
    </nav>
  );
};

const botonGhost = {
  padding: '0.5rem 1rem',
  color: '#ccc',
  textDecoration: 'none',
  borderRadius: '6px',
  fontSize: '0.9rem'
};

const botonSolido = {
  padding: '0.5rem 1.1rem',
  backgroundColor: '#b8860b',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '6px',
  fontSize: '0.9rem',
  fontWeight: 'bold'
};

export default Navbar;