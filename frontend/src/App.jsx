import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SubirContenido from './pages/SubirContenido';
import Quiz from './pages/Quiz';
import Resultado from './pages/Resultado';
import Roadmap from './pages/Roadmap';

/**
 * Árbol de rutas de la app.
 *
 * Flujo: Login -> SubirContenido -> Quiz -> Resultado -> Roadmap
 *
 * TODO (cuando conectemos backend con Cognito/auth propio):
 * envolver las rutas protegidas (todo excepto /login) en un
 * componente <RutaProtegida> que verifique el token y redirija
 * a /login si no existe o expiró.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/subir-contenido" element={<SubirContenido />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/resultado" element={<Resultado />} />
      <Route path="/roadmap" element={<Roadmap />} />
    </Routes>
  );
}

export default App;