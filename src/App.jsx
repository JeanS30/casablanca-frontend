// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bienvenida from './pages/Bienvenida';
import Vitrina from './pages/Vitrina';
import RutaAutoguiada from './pages/RutaAutoguiada';
import Perfilamiento from './pages/Perfilamiento';
import MisLogros from './pages/MisLogros';
import PaginaHito from './pages/PaginaHito';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Bienvenida />} />
        <Route path="/rutas" element={<Vitrina />} />
        <Route path="/ruta/:rutaId" element={<RutaAutoguiada />} />
        <Route path="/hito/:rutaId/:hitoId" element={<PaginaHito />} />
        <Route path="/perfilamiento" element={<Perfilamiento />} />
        <Route path="/mis-logros" element={<MisLogros />} />
      </Routes>
    </Router>
  );
}

export default App;