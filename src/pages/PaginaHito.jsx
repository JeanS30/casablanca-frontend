// src/pages/PaginaHito.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../services/firebase';
import Navbar from '../components/Navbar';
import { marcarHitoVisitado, getLogrosDesbloqueados } from '../hooks/useLogros';

const PUNTOS_POR_HITO = 10;

function PaginaHito() {
  const { rutaId, hitoId } = useParams();
  const [contenido, setContenido] = useState(null);
  const [rutaInfo, setRutaInfo] = useState(null);
  const [otrosHitos, setOtrosHitos] = useState([]);
  const [logro, setLogro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [toastLogro, setToastLogro] = useState(null);
  const [estado, setEstado] = useState(getLogrosDesbloqueados());
  const [totalHitos, setTotalHitos] = useState(0); // ✅ CORRECCIÓN 1

  useEffect(() => {
    const cargar = async () => {
      try {
        // 1. Lectura base desde Firestore (fuente de verdad, respaldo)
        const hitoSnap = await getDoc(doc(db, 'rutas', rutaId, 'hitos', hitoId));
        if (!hitoSnap.exists()) throw new Error('El hito no existe');
        const d = hitoSnap.data();

        setContenido({
          nombre: d.nombre,
          tipo: d.tipo || 'texto',
          texto: d.descripcion || d.contenidoTexto || '',
          imagenUrl: d.contenidoImagenUrl || null,
          audioUrl: d.contenidoAudioUrl || null
        });

        // 2. Cloud Function (para la Factory del backend + logros)
        try {
          const functions = getFunctions(undefined, 'us-central1');
          const escanearHito = httpsCallable(functions, 'escanearHito');
          const respuesta = await escanearHito({ rutaId, hitoId });

          // ✅ CORRECCIÓN 2: si la Factory devuelve contenido, se usa
          if (respuesta.data.contenido) setContenido(respuesta.data.contenido);

          if (respuesta.data.logroDesbloqueado) {
            setLogro(respuesta.data.logroDesbloqueado);
            setToastLogro(respuesta.data.logroDesbloqueado);
            setTimeout(() => setToastLogro(null), 5000);
          }
        } catch (cloudErr) {
          console.warn('Cloud Function no disponible, usando datos de Firestore:', cloudErr);
        }

        // 3. Info de la ruta
        const rutaSnap = await getDoc(doc(db, 'rutas', rutaId));
        const rutaData = rutaSnap.exists() ? { id: rutaSnap.id, ...rutaSnap.data() } : null;
        setRutaInfo(rutaData);

        // 4. Otros hitos de la misma ruta
        const hitosSnap = await getDocs(collection(db, 'rutas', rutaId, 'hitos'));
        const todos = hitosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const otros = todos.filter(h => h.id !== hitoId).slice(0, 3);
        setOtrosHitos(otros);

        // ✅ CORRECCIÓN 1: guardar el total real de hitos
        setTotalHitos(todos.length);

        // 5. Registrar visita y verificar logro local
        const logroIdRuta = rutaData?.logroId || null;
        const resultado = marcarHitoVisitado(rutaId, hitoId, logroIdRuta, todos.length);
        setEstado(getLogrosDesbloqueados());

        if (resultado.logroNuevo) {
          const logroSnap = await getDoc(doc(db, 'logros', resultado.logroNuevo));
          if (logroSnap.exists()) {
            const logroData = { id: logroSnap.id, ...logroSnap.data() };
            setLogro(logroData);
            setToastLogro(logroData);
            setTimeout(() => setToastLogro(null), 5000);
          }
        }
      } catch (err) {
        console.error('Error al cargar hito:', err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [rutaId, hitoId]);

  if (cargando) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
        <Navbar />
        <p style={{ padding: '4rem 2rem', textAlign: 'center', color: '#888' }}>Cargando hito...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
        <Navbar />
        <div style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>⚠️</p>
          <h2 style={{ color: '#ff6b6b' }}>No pudimos cargar este hito</h2>
          <p style={{ color: '#aaa' }}>{error}</p>
          <Link to="/rutas" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#b8860b', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            ← Volver a las rutas
          </Link>
        </div>
      </div>
    );
  }

  const imagenHero = contenido?.imagenUrl || '/hero.jpg';
  const visitadosRuta = estado.hitosVisitados.filter(h => h.startsWith(`${rutaId}/`)).length;
  const totalRuta = totalHitos; // ✅ CORRECCIÓN 1: usar el total real
  const porcentajeRuta = totalRuta > 0 ? Math.round((visitadosRuta / totalRuta) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      {toastLogro && (
        <div style={{ position: 'fixed', top: '80px', right: '20px', backgroundColor: '#b8860b', color: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', zIndex: 200, maxWidth: '320px' }}>
          <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '2px', opacity: 0.9 }}>¡LOGRO DESBLOQUEADO!</p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
            {toastLogro.icono || '🏆'} {toastLogro.nombre}
          </p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', opacity: 0.95 }}>{toastLogro.descripcion}</p>
        </div>
      )}

      {/* HERO */}
      <section
        style={{
          position: 'relative',
          height: '340px',
          backgroundImage: `url("${imagenHero}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,17,23,0.3) 0%, rgba(13,17,23,0.6) 50%, rgba(13,17,23,1) 100%)' }} />

        <Link
          to={`/ruta/${rutaId}`}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '2rem',
            zIndex: 2,
            padding: '0.6rem 1.25rem',
            backgroundColor: 'rgba(20, 20, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}
        >
          ← Volver a la ruta
        </Link>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '0 2rem 2.5rem 2rem' }}>
          <p style={{ color: '#d4a017', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📍 {rutaInfo?.nombre?.toUpperCase() || 'VALLE DE CASABLANCA'}
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0, lineHeight: '1.1', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
            {contenido?.nombre}
          </h1>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 2rem 2rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.2fr', gap: '1.25rem', marginTop: '-2rem', position: 'relative', zIndex: 2 }}>
          {/* IMAGEN */}
          <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #1f242c', backgroundColor: '#161b22', position: 'relative', minHeight: '380px' }}>
            {contenido?.imagenUrl ? (
              <img src={contenido.imagenUrl} alt={contenido.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '0.75rem', color: '#555' }}>
                <p style={{ fontSize: '3rem', margin: 0 }}>🚧</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Imagen próximamente</p>
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem 1.25rem', background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>{contenido?.nombre}</p>
                  <p style={{ margin: 0, color: '#aaa', fontSize: '0.75rem' }}>Valle de Casablanca</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENIDO */}
          <div style={{ backgroundColor: '#161b22', border: '1px solid #1f242c', borderRadius: '14px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.8rem' }}>🍷</span>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>{contenido?.nombre}</h2>
            </div>

            {contenido?.texto && contenido.texto.trim() !== '' ? (
              <p style={{ color: '#b8bdc4', lineHeight: '1.7', fontSize: '0.95rem', marginTop: 0 }}>{contenido.texto}</p>
            ) : (
              <p style={{ color: '#888', lineHeight: '1.7', fontSize: '0.95rem', marginTop: 0, fontStyle: 'italic' }}>
                Estamos preparando la historia completa de este lugar. Vuelve pronto para descubrir más.
              </p>
            )}

            {contenido?.audioUrl && (
              <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#0d1117', border: '1px solid #262c36', borderRadius: '10px' }}>
                <p style={{ color: '#d4a017', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>🎧 Audioguía del hito</p>
                <audio controls src={contenido.audioUrl} style={{ width: '100%' }}>
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #262c36' }}>
              <InfoChip icono="📍" titulo="Valle de Casablanca" subtitulo="Región de Valparaíso" />
              <InfoChip icono="🍇" titulo="Enoturismo" subtitulo="Vitivinicultura" />
              <InfoChip icono="⭐" titulo="Hito registrado" subtitulo={`+${PUNTOS_POR_HITO} puntos`} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', backgroundColor: '#d4a017', color: '#0d1117', borderRadius: '10px', fontWeight: 'bold' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0d1117', color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>✓</span>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>HITO VISITADO</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>Has sumado este lugar a tu recorrido.</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 1.25rem', backgroundColor: '#1c2128', border: '1px solid #d4a017', borderRadius: '10px', color: '#d4a017', fontWeight: 'bold', fontSize: '0.9rem' }}>
                ⭐ +{PUNTOS_POR_HITO} puntos
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN INFERIOR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.25rem', marginTop: '1.5rem' }}>
          <div style={{ backgroundColor: '#161b22', border: '1px solid #1f242c', borderRadius: '14px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🍇</span>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>¿Sabías que...?</h3>
            </div>
            <p style={{ color: '#b8bdc4', lineHeight: '1.7', fontSize: '0.9rem', margin: 0 }}>
              El Valle de Casablanca es reconocido por sus condiciones climáticas únicas, con influencia marina y neblina matinal, ideales para la producción de vinos de alta calidad, especialmente variedades de clima frío como Sauvignon Blanc y Pinot Noir.
            </p>
            <p style={{ marginTop: '1.5rem', color: '#d4a017', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
              — Vino, tierra y tradición —
            </p>
          </div>

          <div style={{ backgroundColor: '#161b22', border: '1px solid #1f242c', borderRadius: '14px', padding: '1.75rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem' }}>Otros lugares que puedes descubrir</h3>
            {otrosHitos.length === 0 ? (
              <p style={{ color: '#888', fontSize: '0.9rem' }}>No hay otros hitos en esta ruta.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {otrosHitos.map(hito => (
                  <Link key={hito.id} to={`/hito/${rutaId}/${hito.id}`} style={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: '#0d1117', border: '1px solid #262c36', textDecoration: 'none', color: '#fff', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '100px', backgroundImage: hito.contenidoImagenUrl ? `url("${hito.contenidoImagenUrl}")` : 'none', backgroundColor: hito.contenidoImagenUrl ? 'transparent' : '#1c2128', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '2rem' }}>
                      {!hito.contenidoImagenUrl && '📷'}
                    </div>
                    <div style={{ padding: '0.75rem' }}>
                      <p style={{ margin: '0 0 0.35rem 0', fontWeight: 'bold', fontSize: '0.85rem', color: '#fff' }}>{hito.nombre}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#888', lineHeight: '1.4' }}>{(hito.descripcion || '').substring(0, 50)}...</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BARRA DE PROGRESO AL FINAL */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: '1.5rem', alignItems: 'center', backgroundColor: '#161b22', border: '1px solid #d4a017', borderRadius: '14px', padding: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ height: '100px', borderRadius: '10px', backgroundImage: 'url("/imagenes/vinedos-casablanca.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>🏆</span>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Tu progreso</h3>
            </div>
            <p style={{ margin: '0 0 0.75rem 0', color: '#b8bdc4', fontSize: '0.85rem' }}>
              Cada hito completado te acerca a nuevas insignias y recompensas.
            </p>
            <div style={{ height: '8px', backgroundColor: '#252525', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${porcentajeRuta}%`, height: '100%', backgroundColor: '#d4a017', transition: 'width 0.5s' }} />
            </div>
            <p style={{ color: '#888', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
              {visitadosRuta} / {totalRuta} hitos · <strong style={{ color: '#fff' }}>{porcentajeRuta}%</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#d4a017' }}>⭐ {estado.hitosVisitados.length * PUNTOS_POR_HITO}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>puntos</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#d4a017' }}>🏆 {estado.logros.length}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>insignias</p>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}

const InfoChip = ({ icono, titulo, subtitulo }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '120px' }}>
    <span style={{ fontSize: '1.2rem' }}>{icono}</span>
    <div>
      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>{titulo}</p>
      <p style={{ margin: 0, fontSize: '0.7rem', color: '#888' }}>{subtitulo}</p>
    </div>
  </div>
);

export default PaginaHito;