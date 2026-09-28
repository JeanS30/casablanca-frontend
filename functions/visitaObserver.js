// ---------------------------------------------
// PATRÓN OBSERVER
// ---------------------------------------------
// Cuando un turista escanea el QR de un hito, ocurren DOS cosas distintas
// e independientes: (1) se actualiza el contador de visitas para la
// Oficina de Turismo, y (2) se notifica al turista si desbloqueó un logro.
// En vez de mezclar toda esa lógica en un solo bloque de código, cada
// "interesado" (observador) reacciona por su cuenta cuando el Sujeto
// (la visita al hito) le avisa que algo ocurrió.

const { FieldValue } = require("firebase-admin/firestore");

// El "Sujeto": mantiene la lista de observadores y los notifica a todos
// cuando ocurre el evento (una visita a un hito).
class VisitaSubject {
  constructor() {
    this.observadores = [];
  }

  agregarObservador(observador) {
    this.observadores.push(observador);
  }

  async notificar(contexto) {
    for (const observador of this.observadores) {
      await observador.actualizar(contexto);
    }
  }
}

// Observador 1: incrementa el contador de visitas del hito en Firestore.
// Esto es lo que le sirve a la Oficina de Turismo para saber qué lugares
// son más visitados.
class ContadorVisitasObserver {
  constructor(db) {
    this.db = db;
  }
  async actualizar(contexto) {
    const { rutaId, hitoId } = contexto;
    const hitoRef = this.db
      .collection("rutas").doc(rutaId)
      .collection("hitos").doc(hitoId);

    await hitoRef.update({
      contadorVisitas: FieldValue.increment(1),
    });
  }
}

// Observador 2: revisa si el hito tiene un logro asociado y, si es así,
// lo agrega al resultado que se le va a devolver al turista (el frontend
// de Jean usa esto para mostrar el aviso de "¡Lograste una insignia!").
class NotificadorLogroObserver {
  constructor(db) {
    this.db = db;
  }
  async actualizar(contexto) {
    if (!contexto.datosHito.logroId) return;

    const logroSnap = await this.db
      .collection("logros")
      .doc(contexto.datosHito.logroId)
      .get();

    if (logroSnap.exists) {
      contexto.resultado.logroDesbloqueado = {
        id: logroSnap.id,
        ...logroSnap.data(),
      };
    }
  }
}

module.exports = { VisitaSubject, ContadorVisitasObserver, NotificadorLogroObserver };