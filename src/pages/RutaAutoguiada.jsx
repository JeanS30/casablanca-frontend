// src/pages/RutaAutoguiada.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../services/firebase';
import Navbar from '../components/Navbar';
import { getLogrosDesbloqueados } from '../hooks/useLogros';

const RutaAutoguiada = () => {
  const { rutaId } = useParams();
  const navigate = useNavigate();
  const [rutaInfo, setRutaInfo] = useState(null);
  const [hitos, setHitos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [estadoLogros, setEstadoLogros] = useState(getLogrosDesbloqueados());

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const rutaDoc = await getDoc(doc(db, 'rutas', rutaId));
        if (rutaDoc.exists()) {
          setRutaInfo({ id: rutaDoc.id, ...rutaDoc.data() });
        }

        const hitosRef = collection(db, 'rutas', rutaId, 'hitos');
        const querySnapshot = await getDocs(hitosRef);
        const hitosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        hitosData.sort((a, b) => (a.orden || 0) - (b.orden || 0));

        setHitos(hitosData);
      } catch (error) {
        console.error("Error al cargar la ruta:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerDatos();
  }, [rutaId]);

  // Refrescar estado de logros al volver a la página
  useEffect(() => {
    const refrescar = () => setEstadoLogros(getLogrosDesbloqueados());
    window.addEventListener('focus', refrescar);
    return () => window.removeEventListener('focus', refrescar);
  }, []);

  const handleEscanearQR = (hito) => {
    navigate(`/hito/${rutaId}/${hito.id}`);
  };

  if (cargando) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
        <Navbar />
        <p style={{ padding: '2rem', textAlign: 'center' }}>Cargando ruta...</p>
      </div>
    );
  }

  if (!rutaInfo) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
        <Navbar />
        <p style={{ padding: '2rem', textAlign: 'center' }}>Ruta no encontrada.</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#fff', backgroundColor: '#121212', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

        <div
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderLeft: '4px solid #b8860b',
            borderRadius: '12px',
            padding: '2rem 2.5rem',
            marginTop: '1.5rem',
            marginBottom: '2.5rem',
            textAlign: 'center'
          }}
        >
          <p style={{ color: '#b8860b', letterSpacing: '2px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Ruta Autoguiada
          </p>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', lineHeight: '1.25', margin: '0 auto 1.25rem auto', fontWeight: '700', color: '#fff', maxWidth: '750px' }}>
            {rutaInfo.nombre}
          </h1>

          <p style={{ color: '#bbb', lineHeight: '1.7', fontSize: '1rem', margin: '0 auto 1.5rem auto', maxWidth: '750px' }}>
            {rutaInfo.descripcion}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: rutaInfo.audioRuta ? '1.75rem' : 0 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '20px', color: '#aaa', fontSize: '0.9rem' }}>
              ⏱️ {rutaInfo.duracion || rutaInfo.duracionEstimada || 'No especificada'}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '20px', color: '#aaa', fontSize: '0.9rem' }}>
              📍 {hitos.length} hitos
            </span>
          </div>

          {rutaInfo.audioRuta && (
            <div style={{ padding: '1rem 1.25rem', backgroundColor: '#252525', border: '1px solid #444', borderRadius: '10px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.75rem', color: '#b8860b', fontSize: '0.9rem', letterSpacing: '0.5px', textAlign: 'center' }}>
                🎧 Audioguía de la ruta
              </p>
              <audio controls src={rutaInfo.audioRuta} style={{ width: '100%', borderRadius: '8px' }}>
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
          )}
        </div>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
          Hitos de la ruta
        </h2>

        {hitos.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No hay hitos registrados para esta ruta todavía.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {hitos.map(hito => {
              const visitado = estadoLogros.hitosVisitados.includes(`${rutaId}/${hito.id}`);
              return (
                <li
                  key={hito.id}
                  style={{
                    border: visitado ? '1px solid #b8860b' : '1px solid #444',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    borderRadius: '8px',
                    backgroundColor: visitado ? '#1e1a10' : '#1e1e1e',
                    textAlign: 'center',
                    position: 'relative'
                  }}
                >
                  {visitado && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: '#b8860b',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '12px'
                      }}
                    >
                      ✓ VISITADO
                    </span>
                  )}

                  <h3 style={{ marginTop: 0, color: '#fff' }}>{hito.nombre}</h3>

                  <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                    {hito.descripcion || hito.contenidoTexto}
                  </p>

                  {hito.contenidoImagenUrl && (
                    <img
                      src={hito.contenidoImagenUrl}
                      alt={hito.nombre}
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        margin: '1rem auto',
                        display: 'block'
                      }}
                    />
                  )}

                  {hito.contenidoAudioUrl && (
                    <audio controls src={hito.contenidoAudioUrl} style={{ width: '100%', marginTop: '1rem', marginBottom: '1rem' }}>
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  )}

                  <button
                    onClick={() => handleEscanearQR(hito)}
                    style={{
                      padding: '0.6rem 1.25rem',
                      backgroundColor: visitado ? '#444' : '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginTop: '0.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {visitado ? '✓ Ya visitado' : '📷 Escanear QR'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', marginBottom: '2rem', paddingTop: '2rem', borderTop: '1px solid #333' }}>
          <Link
            to="/rutas"
            style={{
              padding: '0.85rem 2rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #444',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ← Volver a la vitrina
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RutaAutoguiada;