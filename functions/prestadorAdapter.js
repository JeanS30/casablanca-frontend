// ---------------------------------------------
// PATRÓN ADAPTER
// ---------------------------------------------
// Cada prestador de servicio (viña, hotel, restaurante) probablemente
// tiene su propio sistema, con sus propios nombres de campos. El Adapter
// traduce cada uno de esos formatos "externos" al formato interno único
// que usa nuestra colección registrosTuristas (nacionalidad, edad,
// genero, gastoPromedio, diasEstadia, motivacion).

// Ejemplo: así podría llegar la información desde el sistema de una viña.
class ViñaAdapter {
  adaptar(datosCrudos) {
    return {
      nacionalidad: datosCrudos.paisVisitante,
      edad: datosCrudos.edadAprox,
      genero: datosCrudos.genero || "no especificado",
      gastoPromedio: datosCrudos.montoConsumido,
      diasEstadia: 1, // una visita a una viña suele ser de un día
      motivacion: "enoturismo",
    };
  }
}

// Ejemplo: así podría llegar la información desde el sistema de un hotel.
class HotelAdapter {
  adaptar(datosCrudos) {
    return {
      nacionalidad: datosCrudos.nacionalidadHuesped,
      edad: datosCrudos.edad,
      genero: datosCrudos.sexo || "no especificado",
      gastoPromedio: datosCrudos.tarifaTotal,
      diasEstadia: datosCrudos.nochesHospedado,
      motivacion: datosCrudos.motivoViaje || "no especificado",
    };
  }
}

// Selecciona el Adapter correcto según el tipo de prestador.
function obtenerAdapter(tipoPrestador) {
  switch (tipoPrestador) {
    case "viña":
      return new ViñaAdapter();
    case "hotel":
      return new HotelAdapter();
    default:
      throw new Error(`No existe un Adapter para el tipo: ${tipoPrestador}`);
  }
}

module.exports = { obtenerAdapter };