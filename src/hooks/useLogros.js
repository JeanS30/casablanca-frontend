// src/hooks/useLogros.js
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'casablanca_logros';

// Lee los logros desbloqueados del localStorage
export const getLogrosDesbloqueados = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { hitosVisitados: [], logros: [] };
  } catch (error) {
    return { hitosVisitados: [], logros: [] };
  }
};

// Marca un hito como visitado y retorna si se desbloqueó un logro nuevo
export const marcarHitoVisitado = (rutaId, hitoId, logroIdRuta, totalHitosRuta) => {
  const estado = getLogrosDesbloqueados();
  const claveHito = `${rutaId}/${hitoId}`;

  if (!estado.hitosVisitados.includes(claveHito)) {
    estado.hitosVisitados.push(claveHito);
  }

  // Contar cuántos hitos de esta ruta se han visitado
  const hitosDeLaRuta = estado.hitosVisitados.filter(h => h.startsWith(`${rutaId}/`));

  let logroNuevo = null;
  if (
    logroIdRuta &&
    !estado.logros.includes(logroIdRuta) &&
    hitosDeLaRuta.length >= totalHitosRuta
  ) {
    estado.logros.push(logroIdRuta);
    logroNuevo = logroIdRuta;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));

  return {
    logroNuevo,
    hitosVisitados: hitosDeLaRuta.length,
    totalHitos: totalHitosRuta
  };
};

// Hook para usar en componentes que necesitan reaccionar a cambios
export const useLogros = () => {
  const [estado, setEstado] = useState(getLogrosDesbloqueados());

  useEffect(() => {
    const actualizar = () => setEstado(getLogrosDesbloqueados());
    window.addEventListener('storage', actualizar);
    return () => window.removeEventListener('storage', actualizar);
  }, []);

  return estado;
};

// Reinicia todo (útil para pruebas)
export const reiniciarLogros = () => {
  localStorage.removeItem(STORAGE_KEY);
};