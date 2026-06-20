import { useNavigate } from 'react-router-dom';
import Boton from '../components/Boton';
import TemaRoadmapCard from '../components/TemaRoadmapCard';

// Datos de prueba — vendrán del evento "RoadmapListo".
// IMPORTANTE: el orden aquí NO es el orden en que aparecen los temas en el PDF
// original, sino el orden pedagógico que el LLM debe inferir (prerrequisitos
// primero) — esta es la decisión clave que tomamos al definir el alcance del proyecto.
const ROADMAP_MOCK = {
  pdfUrl: '#', // vendrá de S3 (Lambda "GenerarPdfExplicacion")
  temas: [
    {
      numero: 1,
      titulo: 'Límites trigonométricos',
      estado: 'pendiente',
      explicacion:
        'Antes de avanzar a derivadas trigonométricas, conviene reforzar cómo se resuelven límites con seno, coseno y tangente, especialmente el límite notable sen(x)/x cuando x tiende a 0.',
      prerequisitoDe: "Regla de L'Hôpital, Derivadas trigonométricas",
    },
    {
      numero: 2,
      titulo: "Regla de L'Hôpital",
      estado: 'pendiente',
      explicacion:
        'Se usa para resolver límites con formas indeterminadas (0/0 o ∞/∞) derivando numerador y denominador por separado. Depende directamente de tener claro el concepto de límite y de derivada básica.',
      prerequisitoDe: 'Integrales impropias',
    },
    {
      numero: 3,
      titulo: 'Derivadas básicas',
      estado: 'dominado',
      explicacion:
        'Reglas de potencia, suma y resta para derivar polinomios. Ya demostraste manejo correcto de este tema en el quiz.',
      prerequisitoDe: 'Regla de la cadena, Derivadas trigonométricas',
    },
    {
      numero: 4,
      titulo: 'Regla de la cadena',
      estado: 'dominado',
      explicacion:
        'Permite derivar funciones compuestas, multiplicando la derivada externa por la derivada interna. Tu desempeño en el quiz mostró buen entendimiento de este tema.',
      prerequisitoDe: 'Derivadas implícitas',
    },
  ],
};

export default function Roadmap() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-bg px-5 py-10">
      <div className="w-full max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted font-body">
          Tu roadmap de estudio
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-text">
          Orden recomendado de repaso
        </h1>
        <p className="mt-2 text-sm text-text-muted font-body">
          Este orden no sigue la secuencia del PDF original — está basado en los prerrequisitos
          de cada tema, para que repases en el orden que más te ayude a entender lo siguiente.
        </p>
      </div>

      <div className="flex w-full max-w-xl flex-col gap-4">
        {ROADMAP_MOCK.temas.map((tema) => (
          <TemaRoadmapCard key={tema.numero} {...tema} />
        ))}
      </div>

      <div className="flex w-full max-w-xl items-center justify-between">
        <Boton variant="ghost" onClick={() => navigate('/subir-contenido')}>
          Volver al inicio
        </Boton>
        <a href={ROADMAP_MOCK.pdfUrl} target="_blank" rel="noopener noreferrer">
          <Boton>Descargar PDF del roadmap</Boton>
        </a>
      </div>
    </div>
  );
}