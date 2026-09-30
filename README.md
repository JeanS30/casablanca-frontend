# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


---------------------------------------------------------------------------------------------------------------------------------



# 🍷 Casablanca Digital

**Plataforma de Turismo Inteligente del Valle de Casablanca**

Sitio web responsivo que conecta a los visitantes con el patrimonio, los viñedos y las tradiciones del Valle de Casablanca. Incluye rutas autoguiadas con audioguías, mapa interactivo, sistema de logros gamificado y formulario de perfilamiento turístico.

---

## 📋 Descripción del Proyecto

El Valle de Casablanca es un referente mundial en enoturismo y patrimonio rural, pero su ecosistema turístico sufre de una desconexión territorial y digital: el flujo de visitantes se concentra casi exclusivamente en las viñas privadas, invisibilizando el patrimonio del casco histórico y las localidades rurales.

**Casablanca Digital** transforma el dispositivo móvil de cada visitante en un guía turístico 24/7, mediante:

- **Rutas autoguiadas** con puntos QR, audio, imágenes y texto descriptivo.
- **Mapa interactivo** con los principales atractivos del valle.
- **Sistema de logros e insignias** que incentiva completar cada recorrido.
- **Formulario de perfilamiento** que permite a la Oficina de Turismo obtener datos reales sobre los visitantes.

Este proyecto fue desarrollado como parte de la asignatura **Ingeniería de Software** de INACAP Valparaíso, en colaboración con la Ilustre Municipalidad de Casablanca.

---

## ✨ Características Principales

### 🏠 Página de Bienvenida
Landing page con hero de imagen, botones de acción y categorías temáticas (Borde Costero, Enoturismo, Patrimonio, Fe y Tradición).

### 🗺️ Vitrina de Rutas
Catálogo de rutas autoguiadas disponibles, con tarjetas que muestran nombre, descripción, duración y botón de exploración.

### 🚶 Rutas Autoguiadas
Cada ruta incluye:
- Audioguía general.
- Lista de hitos con imágenes y descripciones.
- Botón de escaneo QR para acceder al detalle de cada hito.
- Marcado visual de hitos ya visitados.

### 📍 Página de Hito
Diseño de dos columnas con imagen del lugar, descripción histórica, audioguía y datos del valle. Incluye tarjetas con otros hitos de la misma ruta y barra de progreso personal.

### 🏆 Sistema de Logros
Gamificación completa que incluye:
- Insignias por ruta completada.
- Sistema de puntos por hito visitado y logro desbloqueado.
- Niveles de explorador.
- Galería visual de insignias (desbloqueadas y bloqueadas).
- Progreso persistente mediante `localStorage`.

### 👤 Formulario de Perfilamiento
Captura de datos del visitante: nacionalidad, edad, género, motivación de viaje, gasto promedio y días de estadía. Los registros se guardan en la colección `registrosTuristas` de Firestore, con reglas de seguridad que garantizan el cumplimiento de la **Ley 19.628** de Protección de la Vida Privada.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** — Biblioteca de interfaz de usuario.
- **Vite** — Bundler y servidor de desarrollo.
- **React Router DOM** — Enrutamiento SPA.
- **CSS-in-JS** — Estilos embebidos con objetos de estilo.

### Backend / Servicios
- **Firebase Hosting** — Despliegue del frontend.
- **Cloud Firestore** — Base de datos NoSQL para rutas, hitos, logros y registros.
- **Cloud Functions** — Lógica de backend (procesamiento de QR, sistema de logros).
- **Firebase SDK** — Conexión entre frontend y servicios.

### Metodología
- **Scrum** — Desarrollo iterativo con sprints de dos semanas.

---

## 📁 Estructura del Proyecto
casablanca-frontend/
├── public/ # Archivos estáticos servidos en la raíz
│ ├── imagenes/ # Fotos de los hitos
│ ├── audio/ # Audioguías en formato MP3
│ ├── hero.jpg # Imagen principal del hero
│ └── logo.png # Logo del proyecto
├── src/
│ ├── components/
│ │ └── Navbar.jsx # Barra de navegación compartida
│ ├── hooks/
│ │ └── useLogros.js # Hook personalizado para sistema de logros
│ ├── pages/
│ │ ├── Bienvenida.jsx # Landing page
│ │ ├── Vitrina.jsx # Lista de rutas
│ │ ├── RutaAutoguiada.jsx # Detalle de una ruta
│ │ ├── PaginaHito.jsx # Detalle de un hito (destino del QR)
│ │ ├── Perfilamiento.jsx # Formulario de registro
│ │ └── MisLogros.jsx # Sistema de gamificación
│ ├── services/
│ │ └── firebase.js # Configuración de Firebase
│ ├── App.jsx # Enrutador principal
│ └── main.jsx # Punto de entrada
├── functions/ # Cloud Functions (backend)
│ ├── index.js # Punto de entrada de las Functions
│ ├── hitoFactory.js # Patrón Factory para creación de Hitos
│ ├── visitaObserver.js # Patrón Observer para notificar visitas/logros
│ ├── prestadorAdapter.js # Patrón Adapter para integración con prestadores
│ ├── seed.js # Script para poblar Firestore con datos de prueba
│ └── package.json
├── .env.local # Variables de entorno (no versionado)
├── .firebaserc # Configuración del proyecto Firebase
├── firebase.json # Configuración de Hosting y Functions
├── package.json
├── vite.config.js
└── README.md

text

---

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 18 o superior.
- npm.
- Cuenta de Firebase con acceso al proyecto.

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JeanS30/casablanca-frontend.git
   cd casablanca-frontend
Instalar dependencias del frontend:

bash
npm install
Instalar dependencias del backend (Cloud Functions):

bash
cd functions
npm install
cd ..
Configurar variables de entorno:

Crear un archivo .env.local en la raíz con las credenciales de Firebase:

text
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
Ejecutar en desarrollo:

bash
npm run dev
Abrir http://localhost:5173 en el navegador.

Compilar para producción:

bash
npm run build
Desplegar en Firebase Hosting (frontend):

bash
firebase deploy --only hosting
Desplegar Cloud Functions (backend):

bash
firebase deploy --only functions
🎯 Rutas Disponibles
🏛️ Ruta del Casco Histórico
Recorrido por los principales hitos patrimoniales del centro de Casablanca: Edificio Municipal, Plaza de Armas, Santuario de Lo Vásquez, Iglesia, Centro Cultural y Casona Patrimonial.

🏺 Ruta del Museo de Casablanca
Recorrido autoguiado dentro del museo comunal, con salas de exposiciones arqueológicas y antropológicas.

🌊 Ruta de Localidades Rurales y Borde Costero
Desde las caletas balleneras hasta los viñedos que abrazan el Pacífico: Caleta Quintay, Playa de Tunquén, Viñedos, Bodegas y Miradores del valle.

🔗 Flujo de Integración entre Frontend y Backend
El turista escanea un QR que apunta a /hito/{rutaId}/{hitoId}.

PaginaHito.jsx lee el documento del hito directo desde Firestore (fuente de verdad).

Se llama a la Cloud Function escanearHito que:

Usa el patrón Factory para construir el objeto Hito según su tipo.

Usa el patrón Observer para notificar al contador de visitas y verificar logros.

Si la Cloud Function responde → el contenido que devuelve (construido por la Factory) reemplaza el de Firestore.

Si la Cloud Function falla → se mantiene el contenido de Firestore como respaldo (resiliencia).

Se registra la visita en localStorage para el sistema de logros.

🏗️ Arquitectura
El proyecto sigue el paradigma 4+1 de Kruchten para la descripción de su arquitectura:

Vista Lógica: Entidades Turista, Ruta, Hito, Avatar, Logro, Prestador, RegistroTurista.

Vista de Procesos: Flujo de escaneo QR, desbloqueo de logros y actualización de contadores.

Vista de Desarrollo: Capas Frontend (React) / Backend (Cloud Functions) / Base de Datos (Firestore).

Vista Física: Despliegue sobre Firebase (Hosting + Firestore + Functions).

Vista de Escenarios: Casos de uso como "Turista realiza la Ruta del Casco Histórico".

Patrones de Diseño Implementados
Patrón	Archivo	Aplicación
Singleton	functions/index.js	Instancia única de conexión a Firestore (initializeApp + getFirestore)
Factory	functions/hitoFactory.js	Clases HitoAudio, HitoTexto, HitoImagen con Factory que decide qué construir
Observer	functions/visitaObserver.js	VisitaSubject notifica a ContadorVisitasObserver y NotificadorLogroObserver
Adapter	functions/prestadorAdapter.js	ViñaAdapter y HotelAdapter traducen formatos externos al interno
🔒 Seguridad y Reglas de Firestore
javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rutas/{rutaId} {
      allow read: if true;
      allow write: if false;
      match /hitos/{hitoId} {
        allow read: if true;
        allow write: if false;
      }
    }
    match /logros/{logroId} {
      allow read: if true;
      allow write: if false;
    }
    match /registrosTuristas/{registroId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    match /prestadoresServicio/{prestadorId} {
      allow read, write: if false;
    }
  }
}
Lógica:

Rutas, hitos y logros: Lectura pública, escritura solo desde backend/consola.

Registros de turistas: Cualquiera puede crear uno (enviar el formulario), nadie puede leer los de otros (protege privacidad según Ley 19.628).

Prestadores de servicio: Totalmente privado.

📚 Documentación Adicional
Ley N° 19.628 — Protección de la Vida Privada (Chile).

Ley N° 20.422 — Igualdad de Oportunidades e Inclusión Social.

IEEE Std 830-1998 — Especificación de Requisitos de Software.

WCAG 2.1 — Pautas de Accesibilidad para el Contenido Web.

👥 Equipo de Desarrollo
Jean — Desarrollo Frontend (React + Vite), integración con Firebase, sistema de rutas, formulario de perfilamiento.

Gabriel — Recopilación de contenido turístico, mapa interactivo, estudio de prefactibilidad, factibilidad legal y económica.

Sebastián — Configuración de Firebase, Cloud Functions, patrones de diseño (Singleton, Factory, Observer, Adapter) y sistema de logros.

Docente: Jocelyn Oriana González Cortés
Asignatura: Ingeniería de Software
Institución: INACAP Valparaíso — 2026

