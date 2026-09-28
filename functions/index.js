const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { onCall } = require("firebase-functions/v2/https");
const { crearHito } = require("./hitoFactory");
const {
  VisitaSubject,
  ContadorVisitasObserver,
  NotificadorLogroObserver,
} = require("./visitaObserver");

// ---------------------------------------------
// PATRÓN SINGLETON (ya lo teníamos)
// ---------------------------------------------
initializeApp();
const db = getFirestore();

// Armamos el Subject UNA vez y le agregamos los dos observadores.
// Esto también respeta el espíritu del Singleton: un solo Subject
// compartido por toda la función, no uno nuevo cada vez.
const visitaSubject = new VisitaSubject();
visitaSubject.agregarObservador(new ContadorVisitasObserver(db));
visitaSubject.agregarObservador(new NotificadorLogroObserver(db));

// ---------------------------------------------
// FUNCIÓN: escanearHito
// ---------------------------------------------
// Esto es lo que Jean va a llamar desde el frontend cuando el turista
// escanea un código QR. El QR codifica el par { rutaId, hitoId }.
exports.escanearHito = onCall(async (request) => {
  const { rutaId, hitoId } = request.data;

  if (!rutaId || !hitoId) {
    throw new Error("Faltan rutaId o hitoId en la solicitud.");
  }

  // 1. Traer los datos crudos del hito desde Firestore.
  const hitoRef = db.collection("rutas").doc(rutaId).collection("hitos").doc(hitoId);
  const hitoSnap = await hitoRef.get();

  if (!hitoSnap.exists) {
    throw new Error("El hito solicitado no existe.");
  }

  const datosHito = hitoSnap.data();

  // 2. Usar la FACTORY para construir el objeto correcto (audio/texto/imagen).
  const hito = crearHito(datosHito);
  const contenido = hito.obtenerContenido();

  // 3. Preparar el resultado que se le va a devolver al frontend.
  const resultado = { contenido, logroDesbloqueado: null };

  // 4. Notificar a los OBSERVERS: incrementa el contador y revisa si hay logro.
  await visitaSubject.notificar({ rutaId, hitoId, datosHito, resultado });

  return resultado;
});