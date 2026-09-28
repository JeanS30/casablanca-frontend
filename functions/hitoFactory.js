// ---------------------------------------------
// PATRÓN FACTORY
// ---------------------------------------------
// Cada tipo de Hito (audio, texto, imagen) entrega su contenido de forma
// distinta. En vez de que el código que llama tenga que preguntar
// "¿es audio? ¿es texto?" cada vez, la Factory decide qué tipo de objeto
// construir según el campo "tipo", y siempre entrega la misma interfaz:
// el método obtenerContenido().

class HitoAudio {
  constructor(datos) {
    this.datos = datos;
  }
  obtenerContenido() {
    return {
      tipo: "audio",
      nombre: this.datos.nombre,
      audioUrl: this.datos.contenidoAudioUrl,
      texto: this.datos.contenidoTexto || null,
    };
  }
}

class HitoTexto {
  constructor(datos) {
    this.datos = datos;
  }
  obtenerContenido() {
    return {
      tipo: "texto",
      nombre: this.datos.nombre,
      texto: this.datos.contenidoTexto,
    };
  }
}

class HitoImagen {
  constructor(datos) {
    this.datos = datos;
  }
  obtenerContenido() {
    return {
      tipo: "imagen",
      nombre: this.datos.nombre,
      imagenUrl: this.datos.contenidoImagenUrl,
      texto: this.datos.contenidoTexto || null,
    };
  }
}

// Esta es la Factory propiamente tal: recibe los datos crudos del
// documento de Firestore y devuelve el objeto correcto ya construido.
function crearHito(datos) {
  switch (datos.tipo) {
    case "audio":
      return new HitoAudio(datos);
    case "imagen":
      return new HitoImagen(datos);
    case "texto":
    default:
      return new HitoTexto(datos);
  }
}

module.exports = { crearHito };