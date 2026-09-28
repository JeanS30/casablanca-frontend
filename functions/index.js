const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { onCall } = require("firebase-functions/v2/https");
const { crearHito } = require("./hitoFactory");
const { obtenerAdapter } = require("./prestadorAdapter");
const {
  VisitaSubject,
  ContadorVisitasObserver,
  NotificadorLogroObserver,
} = require("./visitaObserver");

// ---------------------------------------------
// PATRÓN SINGLETON
// ---------------------------------------------
initializeApp();
const db = getFirestore();

// Armamos el Subject UNA vez y le agregamos los dos observadores.
const visitaSubject = new VisitaSubject();
visitaSubject.agregarObservador(new ContadorVisitasObserver(db));
visitaSubject.agregarObservador(new NotificadorLogroObserver(db));

// ---------------------------------------------
// FUNCIÓN: escanearHito (Factory + Observer)
// ---------------------------------------------
exports.escanearHito = onCall(async (request) => {
  const { rutaId, hitoId } = request.data;

  if (!rutaId || !hitoId) {
    throw new Error("Faltan rutaId o hitoId en la solicitud.");
  }

  const hitoRef = db.collection("rutas").doc(rutaId).collection("hitos").doc(hitoId);
  const hitoSnap = await hitoRef.get();

  if (!hitoSnap.exists) {
    throw new Error("El hito solicitado no existe.");
  }

  const datosHito = hitoSnap.data();

  // FACTORY: construye el objeto correcto según el tipo del hito.
  const hito = crearHito(datosHito);
  const contenido = hito.obtenerContenido();

  const resultado = { contenido, logroDesbloqueado: null };

  // OBSERVERS: incrementa el contador y revisa si hay logro.
  await visitaSubject.notificar({ rutaId, hitoId, datosHito, resultado });

  return resultado;
});

// ---------------------------------------------
// FUNCIÓN: registrarDesdePrestador (Adapter)
// ---------------------------------------------
exports.registrarDesdePrestador = onCall(async (request) => {
  const { tipoPrestador, datosCrudos } = request.data;

  if (!tipoPrestador || !datosCrudos) {
    throw new Error("Faltan tipoPrestador o datosCrudos en la solicitud.");
  }

  // ADAPTER: traduce el formato del prestador al formato interno.
  const adapter = obtenerAdapter(tipoPrestador);
  const registroAdaptado = adapter.adaptar(datosCrudos);

  const docRef = await db.collection("registrosTuristas").add({
    ...registroAdaptado,
    fechaRegistro: new Date(),
  });

  return { id: docRef.id, registroGuardado: registroAdaptado };
});