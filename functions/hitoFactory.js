// Contrato uniforme: todos los tipos devuelven las mismas claves,
// para que el frontend pueda mostrar imagen, audio y texto
// sin importar el tipo del hito.
function contenidoBase(datos, tipo) {
  return {
    tipo,
    nombre: datos.nombre,
    texto: datos.contenidoTexto || datos.descripcion || "",
    imagenUrl: datos.contenidoImagenUrl || null,
    audioUrl: datos.contenidoAudioUrl || null,
  };
}

class HitoAudio {
  constructor(datos) {
    this.datos = datos;
  }
  obtenerContenido() {
    return contenidoBase(this.datos, "audio");
  }
}

class HitoTexto {
  constructor(datos) {
    this.datos = datos;
  }
  obtenerContenido() {
    return contenidoBase(this.datos, "texto");
  }
}

class HitoImagen {
  constructor(datos) {
    this.datos = datos;
  }
  obtenerContenido() {
    return contenidoBase(this.datos, "imagen");
  }
}

// La Factory: decide qué clase construir según el campo "tipo".
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