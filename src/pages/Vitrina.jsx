// src/pages/Vitrina.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Vitrina = () => {
  const [rutas, setRutas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerRutas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'rutas'));
        const rutasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRutas(rutasData);
      } catch (error) {
        console.error("Error al obtener las rutas:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerRutas();
  }, []);

  if (cargando) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
        <Navbar />
        <p style={{ padding: '2rem' }}>Cargando rutas...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          padding: '4rem 2rem 3rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #1a2332 0%, #0f0f0f 100%)',
          borderBottom: '1px solid #333'
        }}
      >
        <p style={{ color: '#b8860b', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '1rem' }}>
          🍷 VALLE DE CASABLANCA
        </p>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>
          Donde la Brisa del Océano Despierta los Sentidos
        </h1>
        <p style={{ maxWidth: '800px', margin: '0 auto 1.5rem auto', color: '#ccc', lineHeight: '1.7', fontSize: '1.05rem' }}>
          Imagina un lugar donde la brisa fría del Océano Pacífico se cuela entre los cerros para acariciar viñedos de clase mundial. Estratégicamente ubicado a medio camino entre Santiago y Valparaíso, el Valle de Casablanca no es solo un punto en el mapa: es un destino que invita a detener el tiempo.
        </p>
        <p style={{ maxWidth: '800px', margin: '0 auto', color: '#aaa', lineHeight: '1.7', fontSize: '0.95rem' }}>
          Epicentro del enoturismo y la gastronomía de origen en Chile, ofreciendo una transición perfecta entre la majestuosidad del valle central y el encanto de la costa.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          <span style={chipStyle}>🌊 Borde Costero</span>
          <span style={chipStyle}>🍇 Enoturismo</span>
          <span style={chipStyle}>🏛️ Patrimonio</span>
          <span style={chipStyle}>⛪ Fe y Tradición</span>
        </div>
      </section>

      {/* RUTAS */}
      <section style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>
          Rutas Autoguiadas
        </h2>
        <p style={{ textAlign: 'center', color: '#aaa', marginBottom: '2.5rem' }}>
          Recorre el valle a tu ritmo, con audioguías e hitos interactivos.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {rutas.map((ruta, index) => (
            <div
              key={ruta.id}
              style={{
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '1.5rem',
                backgroundColor: '#1a1a1a',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <p style={{ color: '#b8860b', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                  RUTA {String(index + 1).padStart(2, '0')}
                </p>
                <h3 style={{ fontSize: '1.3rem', marginTop: 0, marginBottom: '0.75rem', color: '#fff' }}>
                  {ruta.nombre || 'Ruta sin nombre'}
                </h3>
                <p style={{ color: '#bbb', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1rem' }}>
                  {ruta.descripcion || 'Sin descripción disponible.'}
                </p>
                <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  ⏱️ <strong>Duración:</strong> {ruta.duracion || ruta.duracionEstimada || 'No especificada'}
                </p>
              </div>

              <Link
                to={`/ruta/${ruta.id}`}
                style={{
                  display: 'inline-block',
                  textAlign: 'center',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}
              >
                Explorar Ruta →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CURIOSIDADES */}
      <section style={{ padding: '3rem 2rem', backgroundColor: '#141414', borderTop: '1px solid #222' }}>
        <h2 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
          💡 ¿Sabías que...?
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1100px',
            margin: '0 auto'
          }}
        >
          <CuriosidadCard
            icono="🏠"
            titulo="Un nombre literal"
            texto="El nombre 'Casablanca' proviene de una gran hacienda colonial identificada por una inmensa casa de adobe pintada de blanco inmaculado."
          />
          <CuriosidadCard
            icono="🍾"
            titulo="Rey del Blanco"
            texto="Uno de los valles más premiados de Chile. Si has tomado un Sauvignon Blanc o Chardonnay de alta gama, probablemente sus uvas nacieron aquí."
          />
          <CuriosidadCard
            icono="🌬️"
            titulo="Microclima único"
            texto="Su posición geográfica lo convierte en un 'embudo' natural para los vientos costeros, permitiendo una maduración lenta y perfecta de la uva."
          />
        </div>
      </section>

      <footer style={{ padding: '2rem', textAlign: 'center', color: '#666', fontSize: '0.85rem', borderTop: '1px solid #222' }}>
        <p>Casablanca Digital — Plataforma de Turismo Inteligente del Valle de Casablanca</p>
        <p>Proyecto académico INACAP — 2026</p>
      </footer>
    </div>
  );
};

const chipStyle = {
  padding: '0.4rem 0.9rem',
  backgroundColor: '#252525',
  border: '1px solid #444',
  borderRadius: '20px',
  fontSize: '0.85rem',
  color: '#ddd'
};

const CuriosidadCard = ({ icono, titulo, texto }) => (
  <div style={{ padding: '1.25rem', borderLeft: '3px solid #b8860b', backgroundColor: '#1a1a1a', borderRadius: '6px' }}>
    <p style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>{icono}</p>
    <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: '#fff' }}>{titulo}</h3>
    <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>{texto}</p>
  </div>
);

export default Vitrina;