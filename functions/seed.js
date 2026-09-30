// ---------------------------------------------
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

async function seed() {
  // --- Logros ---
  await db.collection("logros").doc("logro-faro").set({
    nombre: "Explorador del Faro",
    descripcion: "Completaste el primer hito de la Ruta del Casco Histórico.",
    icono: "🏮",
  });

  // --- Ruta 1: Casco Histórico ---
  const rutaRef = db.collection("rutas").doc("casco-historico");
  await rutaRef.set({
    nombre: "Ruta del Casco Histórico",
    descripcion: "Recorrido plano de 1.5 a 2 horas que parte en El Faro.",
    duracionEstimada: "1.5 a 2 horas",
  });

  await rutaRef.collection("hitos").doc("hito-faro").set({
    orden: 1,
    nombre: "El Faro",
    tipo: "audio",
    contenidoTexto: "Bienvenido al punto de partida de la ruta del Casco Histórico.",
    contenidoAudioUrl: "https://ejemplo.com/audio/el-faro.mp3",
    lat: -33.3216,
    lng: -71.4106,
    logroId: "logro-faro",
    contadorVisitas: 0,
  });

  await rutaRef.collection("hitos").doc("hito-plaza").set({
    orden: 2,
    nombre: "Plaza de Armas",
    tipo: "texto",
    contenidoTexto: "La Plaza de Armas es el corazón cívico de Casablanca.",
    lat: -33.3201,
    lng: -71.4090,
    logroId: null,
    contadorVisitas: 0,
  });

  // --- Ruta 2: Museo de Casablanca ---
  const rutaMuseo = db.collection("rutas").doc("museo-casablanca");
  await rutaMuseo.set({
    nombre: "Ruta del Museo de Casablanca",
    descripcion: "Recorrido autoguiado dentro del museo comunal.",
    duracionEstimada: "45 minutos",
  });

  await rutaMuseo.collection("hitos").doc("hito-sala-historia").set({
    orden: 1,
    nombre: "Sala de Historia",
    tipo: "imagen",
    contenidoTexto: "Fotografías históricas de la fundación de Casablanca.",
    contenidoImagenUrl: "https://ejemplo.com/imagenes/sala-historia.jpg",
    lat: -33.3205,
    lng: -71.4095,
    logroId: null,
    contadorVisitas: 0,
  });

  console.log("✅ Datos de prueba cargados con éxito.");
}

seed().catch((error) => {
  console.error("❌ Error al cargar los datos de prueba:", error);
});