// src/pages/Perfilamiento.jsx
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Perfilamiento = () => {
  const [formData, setFormData] = useState({
    nacionalidad: '',
    edad: '',
    genero: '',
    motivacion: '',
    gastoPromedio: '',
    diasEstadia: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'registrosTuristas'), {
        ...formData,
        edad: Number(formData.edad),
        gastoPromedio: Number(formData.gastoPromedio),
        diasEstadia: Number(formData.diasEstadia),
        fechaRegistro: new Date()
      });
      setEnviado(true);
      alert('¡Gracias por completar tu perfil!');
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      alert('Hubo un error al guardar tus datos. Revisa la consola.');
    }
  };

  if (enviado) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
        <Navbar />
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h1>¡Perfil guardado!</h1>
          <p style={{ color: '#aaa' }}>Gracias por ayudarnos a mejorar la experiencia turística en Casablanca.</p>
          <Link to="/rutas" style={{ color: '#b8860b', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Volver a la vitrina
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
        <Link to="/rutas" style={{ color: '#007bff', textDecoration: 'none' }}>← Volver a la vitrina</Link>
        <h1 style={{ marginTop: '1rem' }}>Tu Perfil de Visitante</h1>
        <p style={{ color: '#aaa' }}>Ayúdanos a mejorar tu experiencia completando este breve formulario.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          <input name="nacionalidad" placeholder="Nacionalidad" onChange={handleChange} required style={inputStyle} />
          <input name="edad" type="number" placeholder="Edad" onChange={handleChange} required style={inputStyle} />
          <select name="genero" onChange={handleChange} required style={inputStyle}>
            <option value="">Selecciona género</option>
            <option value="F">Femenino</option>
            <option value="M">Masculino</option>
            <option value="Otro">Otro</option>
          </select>
          <input name="motivacion" placeholder="Motivación de viaje (ej. enoturismo, cultura)" onChange={handleChange} style={inputStyle} />
          <input name="gastoPromedio" type="number" placeholder="Gasto promedio (CLP)" onChange={handleChange} style={inputStyle} />
          <input name="diasEstadia" type="number" placeholder="Días de estadía" onChange={handleChange} style={inputStyle} />
          <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#b8860b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
            Enviar Perfil
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '0.65rem',
  borderRadius: '5px',
  border: '1px solid #444',
  backgroundColor: '#222',
  color: '#fff',
  fontSize: '0.95rem'
};

export default Perfilamiento;