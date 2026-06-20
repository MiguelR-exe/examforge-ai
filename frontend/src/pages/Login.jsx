import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../components/Boton';

/**
 * Login / Register.
 * TODO (cuando conectemos backend): POST /auth/login → guarda { token, userId, nombre }
 * y redirige a /subir-contenido.
 */
export default function Login() {
  const [modo, setModo] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();

  function manejarSubmit(e) {
    e.preventDefault();
    // Mock: navega directo, sin llamar al backend todavía
    navigate('/subir-contenido');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-5 py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-3xl font-bold text-text">
          {modo === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
        </h1>
        <p className="mt-2 text-center text-sm text-text-muted font-body">
          Genera quizzes a partir de tus apuntes y descubre qué temas repasar.
        </p>

        <form onSubmit={manejarSubmit} className="mt-7 flex flex-col gap-3.5">
          {modo === 'register' && (
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="rounded-[10px] border border-border bg-surface px-4 py-3 text-sm font-body outline-none focus:border-accent"
              required
            />
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-[10px] border border-border bg-surface px-4 py-3 text-sm font-body outline-none focus:border-accent"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[10px] border border-border bg-surface px-4 py-3 text-sm font-body outline-none focus:border-accent"
            required
          />

          <Boton type="submit">{modo === 'login' ? 'Iniciar sesión' : 'Registrarme'}</Boton>
        </form>

        <p className="mt-5 text-center text-sm text-text-muted font-body">
          {modo === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button
            onClick={() => setModo(modo === 'login' ? 'register' : 'login')}
            className="font-semibold text-accent-dark hover:underline"
          >
            {modo === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}