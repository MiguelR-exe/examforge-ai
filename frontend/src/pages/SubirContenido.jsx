import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../components/Boton';

/**
 * Subida de texto/PDF + configuración del quiz (n° preguntas, modo cronómetro).
 * TODO (cuando conectemos backend): POST /quiz → Lambda "GenerarQuiz" → evento "QuizGenerado"
 */
export default function SubirContenido() {
  const [texto, setTexto] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [numPreguntas, setNumPreguntas] = useState(10);
  const [modoCronometro, setModoCronometro] = useState(false);
  const navigate = useNavigate();

  function manejarSubmit(e) {
    e.preventDefault();
    // Mock: navega directo al quiz, sin llamar al backend todavía
    navigate('/quiz');
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-bg px-5 py-10">
      <div className="w-full max-w-xl">
        <h1 className="font-display text-2xl font-bold text-text">Crea tu quiz</h1>
        <p className="mt-1 text-sm text-text-muted font-body">
          Sube un PDF o pega un texto, y configura cómo quieres practicar.
        </p>
      </div>

      <form onSubmit={manejarSubmit} className="flex w-full max-w-xl flex-col gap-5">
        <div className="rounded-card border border-border bg-surface p-6">
          <label className="mb-2 block text-sm font-semibold text-text font-body">
            Sube un PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            className="w-full text-sm font-body text-text-muted"
          />

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-text-muted font-body">o pega un texto</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Pega aquí el contenido del tema que quieres practicar…"
            rows={5}
            className="w-full resize-none rounded-[10px] border border-border bg-bg px-4 py-3 text-sm font-body outline-none focus:border-accent"
          />
        </div>

        <div className="rounded-card border border-border bg-surface p-6">
          <label className="mb-2 block text-sm font-semibold text-text font-body">
            Número de preguntas: {numPreguntas}
          </label>
          <input
            type="range"
            min={5}
            max={30}
            step={5}
            value={numPreguntas}
            onChange={(e) => setNumPreguntas(Number(e.target.value))}
            className="w-full accent-accent"
          />

          <label className="mt-5 flex items-center gap-3">
            <input
              type="checkbox"
              checked={modoCronometro}
              onChange={(e) => setModoCronometro(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            <span className="text-sm font-medium text-text font-body">Activar modo cronómetro</span>
          </label>
        </div>

        <div className="flex justify-end">
          <Boton type="submit" disabled={!texto && !archivo}>
            Generar quiz
          </Boton>
        </div>
      </form>
    </div>
  );
}