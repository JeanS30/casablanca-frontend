// src/pages/MisLogros.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getLogrosDesbloqueados } from '../hooks/useLogros';

const IMAGENES_RUTA = {
  'casco-historico': '/imagenes/plaza-de-armas.jpg',
  'museo-casablanca': '/imagenes/museo-casablanca.jpg',
  'localidades-rurales': '/imagenes/vinedos-casablanca.jpg'
};

const PUNTOS_POR_HITO = 10;
const PUNTOS_POR_LOGRO = 100;

const MisLogros = () => {
  const [rutas, setRutas] = useState([]);
  const [logros, setLogros] = useState([]);
  const [hitosPorRuta, setHitosPorRuta] = useState({});
  const [estado, setEstado] = useState(getLogrosDesbloqueados());
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [rutasSnap, logrosSnap] = await Promise.all([
          getDocs(collection(db, 'rutas')),
          getDocs(collection(db, 'logros'))
        ]);

        const rutasData = rutasSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const logrosData = logrosSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const hitosPromises = rutasData.map(ruta =>
          getDocs(collection(db, 'rutas', ruta.id, 'hitos'))
            .then(snap => ({ rutaId: ruta.id, count: snap.size }))
        );
        const hitosResults = await Promise.all(hitosPromises);
        const mapa = {};
        hitosResults.forEach(r => { mapa[r.rutaId] = r.count; });

        setRutas(rutasData);
        setLogros(logrosData);
        setHitosPorRuta(mapa);
      } catch (error) {
        console.error("Error al cargar logros:", error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const handleReiniciar = () => {
    if (window.confirm('¿Seguro quieres reiniciar tu progreso? Se borrarán todos los logros desbloqueados.')) {
      localStorage.removeItem('casablanca_logros');
      window.location.reload();
    }
  };

  const totalLogros = logros.length;
  const logrosObtenidos = estado.logros.length;
  const hitosTotales = Object.values(hitosPorRuta).reduce((a, b) => a + b, 0);
  const hitosVisitados = estado.hitosVisitados.length;
  const puntos = (hitosVisitados * PUNTOS_POR_HITO) + (logrosObtenidos * PUNTOS_POR_LOGRO);
  const porcentajeGlobal = hitosTotales > 0 ? Math.round((hitosVisitados / hitosTotales) * 100) : 0;
  const nivel = logrosObtenidos + 1;

  const proximoLogroRuta = rutas.find(r => r.logroId && !estado.logros.includes(r.logroId));
  const proximoLogro = proximoLogroRuta
    ? logros.find(l => l.id === proximoLogroRuta.logroId)
    : null;

  if (cargando) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
        <Navbar />
        <p style={{ padding: '2rem', textAlign: 'center' }}>Cargando logros...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      {/* HERO con imagen de fondo */}
      <section
        style={{
          position: 'relative',
          padding: '3rem 2rem 4rem 2rem',
          backgroundImage: 'url("/hero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid #222'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 60%, rgba(15,15,15,1) 100%)',
            zIndex: 0
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#2a2a2a',
                border: '2px solid #b8860b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem'
              }}
            >
              👤
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>
                Visitante
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ color: '#b8860b', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  Explorador de Casablanca
                </span>
                <span
                  style={{
                    padding: '0.15rem 0.6rem',
                    backgroundColor: '#b8860b',
                    color: '#fff',
                    fontSize: '0.7rem',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px'
                  }}
                >
                  Nivel {nivel}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <MiniStat icono="⭐" valor={puntos} label="Puntos" />
                <MiniStat icono="🏆" valor={logrosObtenidos} label="Insignias" />
                <MiniStat icono="📍" valor={hitosVisitados} label="Lugares visitados" />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', lineHeight: '1.2', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              🏆 Mis Logros
            </h1>
            <p style={{ color: '#bbb', marginTop: '0.5rem', fontSize: '1rem' }}>
              Cada lugar que visitas te acerca a descubrir el Valle de Casablanca.
            </p>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* TU PROGRESO */}
        <div
          style={{
            backgroundColor: '#141414',
            border: '1px solid #2a2a2a',
            borderRadius: '12px',
            padding: '1.75rem',
            marginBottom: '3rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🎯</span>
            <div>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Tu progreso</h3>
              <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>Completa las rutas y gana insignias</p>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ height: '8px', backgroundColor: '#252525', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${porcentajeGlobal}%`, height: '100%', backgroundColor: '#b8860b', transition: 'width 0.5s' }} />
            </div>
            <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.5rem', marginBottom: 0 }}>
              {porcentajeGlobal}% completado
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <ProgresoItem
              icono="🗺️"
              valor={`${logrosObtenidos} / ${totalLogros}`}
              label="rutas completadas"
            />
            <ProgresoItem
              icono="📍"
              valor={`${hitosVisitados} / ${hitosTotales}`}
              label="lugares visitados"
            />
            <ProgresoItem
              icono="⭐"
              valor={puntos}
              label={`puntos · Nivel ${nivel}`}
            />
          </div>
        </div>

        {/* PROGRESO POR RUTA */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🗺️</span>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Progreso por ruta</h2>
          </div>
          <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Explora, visita y completa cada ruta para desbloquear nuevas insignias.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {rutas.map(ruta => {
              const totalRuta = hitosPorRuta[ruta.id] || 0;
              const visitadosRuta = estado.hitosVisitados.filter(h => h.startsWith(`${ruta.id}/`)).length;
              const completada = ruta.logroId && estado.logros.includes(ruta.logroId);
              const imagen = ruta.imagenRuta || IMAGENES_RUTA[ruta.id] || '/hero.jpg';

              return (
                <div
                  key={ruta.id}
                  style={{
                    backgroundColor: '#141414',
                    border: '1px solid #2a2a2a',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    style={{
                      height: '160px',
                      backgroundImage: `url("${imagen}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}
                  >
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(15,15,15,0.95) 100%)' }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '0.3rem 0.75rem',
                        backgroundColor: 'rgba(0,0,0,0.75)',
                        border: '1px solid #b8860b',
                        color: '#b8860b',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        borderRadius: '20px'
                      }}
                    >
                      {visitadosRuta}/{totalRuta}
                    </span>
                    {completada && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          padding: '0.3rem 0.75rem',
                          backgroundColor: '#b8860b',
                          color: '#fff',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          borderRadius: '20px'
                        }}
                      >
                        ✓ COMPLETADA
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: '#fff' }}>
                      {ruta.nombre}
                    </h3>
                    <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.5', flex: 1 }}>
                      {ruta.descripcion}
                    </p>
                    <Link
                      to={`/ruta/${ruta.id}`}
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        padding: '0.7rem 1rem',
                        backgroundColor: 'transparent',
                        color: '#b8860b',
                        textDecoration: 'none',
                        border: '1px solid #b8860b',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        marginTop: '1rem'
                      }}
                    >
                      Explorar ruta →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* GALERÍA DE INSIGNIAS */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🏅</span>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Galería de insignias</h2>
          </div>
          <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Completa las rutas y desbloquea insignias que representan tu aventura.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {logros.map(logro => {
              const desbloqueado = estado.logros.includes(logro.id);
              const rutaAsociada = rutas.find(r => r.logroId === logro.id);
              const totalHitos = rutaAsociada ? hitosPorRuta[rutaAsociada.id] || 0 : 0;
              const visitadosLogro = rutaAsociada
                ? estado.hitosVisitados.filter(h => h.startsWith(`${rutaAsociada.id}/`)).length
                : 0;

              return (
                <div
                  key={logro.id}
                  style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    backgroundColor: '#141414',
                    border: desbloqueado ? '1px solid #b8860b' : '1px solid #2a2a2a',
                    borderRadius: '12px',
                    opacity: desbloqueado ? 1 : 0.7
                  }}
                >
                  <div
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      margin: '0 auto 1rem auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      backgroundColor: desbloqueado ? 'rgba(184, 134, 11, 0.15)' : '#1a1a1a',
                      border: desbloqueado ? '2px solid #b8860b' : '2px solid #333',
                      filter: desbloqueado ? 'none' : 'grayscale(100%)'
                    }}
                  >
                    {logro.icono || '🏅'}
                  </div>

                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: desbloqueado ? '#fff' : '#888' }}>
                    {logro.nombre}
                  </h3>

                  <div style={{ height: '4px', backgroundColor: '#252525', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.6rem' }}>
                    <div
                      style={{
                        width: `${totalHitos > 0 ? (visitadosLogro / totalHitos) * 100 : 0}%`,
                        height: '100%',
                        backgroundColor: '#b8860b'
                      }}
                    />
                  </div>

                  <p style={{ color: '#888', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
                    {visitadosLogro} / {totalHitos} hitos
                  </p>

                  <p
                    style={{
                      color: desbloqueado ? '#b8860b' : '#666',
                      fontSize: '0.8rem',
                      margin: 0,
                      fontWeight: 'bold'
                    }}
                  >
                    {desbloqueado ? '✓ Desbloqueada' : '🔒 Bloqueada'}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* TU PRÓXIMO LOGRO */}
        {proximoLogro && proximoLogroRuta && (
          <section
            style={{
              backgroundColor: '#141414',
              border: '1px solid #b8860b',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'minmax(200px, 1fr) 2fr',
              alignItems: 'stretch'
            }}
          >
            <div
              style={{
                minHeight: '160px',
                backgroundImage: `url("${proximoLogroRuta.imagenRuta || IMAGENES_RUTA[proximoLogroRuta.id] || '/hero.jpg'}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🎯</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Tu próximo logro</h3>
              </div>
              <p style={{ color: '#b8860b', fontWeight: 'bold', margin: '0 0 0.35rem 0' }}>
                {proximoLogro.nombre}
              </p>
              <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                {proximoLogro.descripcion}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ height: '6px', backgroundColor: '#252525', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(estado.hitosVisitados.filter(h => h.startsWith(`${proximoLogroRuta.id}/`)).length / (hitosPorRuta[proximoLogroRuta.id] || 1)) * 100}%`,
                        height: '100%',
                        backgroundColor: '#b8860b'
                      }}
                    />
                  </div>
                  <p style={{ color: '#888', fontSize: '0.75rem', margin: '0.4rem 0 0 0' }}>
                    {estado.hitosVisitados.filter(h => h.startsWith(`${proximoLogroRuta.id}/`)).length} / {hitosPorRuta[proximoLogroRuta.id] || 0}
                  </p>
                </div>
                <Link
                  to={`/ruta/${proximoLogroRuta.id}`}
                  style={{
                    padding: '0.7rem 1.25rem',
                    backgroundColor: '#b8860b',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Continuar ruta →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* BOTÓN REINICIAR (para pruebas) */}
        <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #222' }}>
          <button
            onClick={handleReiniciar}
            style={{
              padding: '0.6rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#888',
              border: '1px solid #444',
              borderRadius: '8px',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🔄 Reiniciar progreso (para pruebas)
          </button>
        </div>

      </div>

      {/* Footer */}
      <footer
        style={{
          padding: '1.5rem',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.8rem',
          borderTop: '1px solid #222',
          marginTop: '2rem'
        }}
      >
        <p style={{ margin: 0 }}>Valle de Casablanca © 2026 | Valparaíso, Chile</p>
      </footer>
    </div>
  );
};

const MiniStat = ({ icono, valor, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <span style={{ fontSize: '1.1rem' }}>{icono}</span>
    <div>
      <p style={{ margin: 0, fontWeight: 'bold', color: '#fff', fontSize: '1rem' }}>{valor}</p>
      <p style={{ margin: 0, color: '#888', fontSize: '0.75rem' }}>{label}</p>
    </div>
  </div>
);

const ProgresoItem = ({ icono, valor, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '10px', border: '1px solid #252525' }}>
    <span style={{ fontSize: '1.5rem' }}>{icono}</span>
    <div>
      <p style={{ margin: 0, fontWeight: 'bold', color: '#fff', fontSize: '1.2rem' }}>{valor}</p>
      <p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>{label}</p>
    </div>
  </div>
);

export default MisLogros;