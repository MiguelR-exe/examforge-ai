import { useNavigate } from 'react-router-dom';
import Boton from '../components/Boton';
import TopicPill from '../components/TopicPill';

// Datos de prueba — vendrán del evento "QuizCompletado" (% error, tiempo)
// y de un preview rápido del roadmap (los primeros 2-3 temas, antes de
// navegar al Roadmap completo que se genera de forma asíncrona).
const RESULTADO_MOCK = {
  porcentajeAciertos: 80,
  tiempoTotal: '06:42',
  modoCronometroActivo: true,
  temasPendientes: ['Límites trigonométricos', "Regla de L'Hôpital"],
  temasDominados: ['Derivadas básicas', 'Regla de la cadena'],
  roadmapListo: true, // false mientras se genera de forma asíncrona (ver Lambda "GenerarRoadmap")
};

export default function Resultado() {
  const navigate = useNavigate();
  const {
    porcentajeAciertos,
    tiempoTotal,
    modoCronometroActivo,
    temasPendientes,
    temasDominados,
    roadmapListo,
  } = RESULTADO_MOCK;

  const colorAciertos = porcentajeAciertos >= 70 ? 'text-success' : 'text-accent-dark';

  return (
    <div className="flex min-h-screen flex-col items-center gap-7 bg-bg px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted font-body">
        Quiz completado
      </p>

      {/* Card de estadísticas */}
      <div className="flex w-full max-w-xl gap-6 rounded-card border border-border bg-surface p-9 shadow-sm">
        <div className="flex-1 text-center">
          <div className={`font-display text-4xl font-bold ${colorAciertos}`}>
            {porcentajeAciertos}%
          </div>
          <div className="mt-1.5 text-sm font-medium text-text-muted font-body">
            Respuestas correctas
          </div>
        </div>

        {modoCronometroActivo && (
          <>
            <div className="w-px bg-border" />
            <div className="flex-1 text-center">
              <div className="font-display text-4xl font-bold text-text">{tiempoTotal}</div>
              <div className="mt-1.5 text-sm font-medium text-text-muted font-body">
                Tiempo total
              </div>
            </div>
          </>
        )}
      </div>

      {/* Preview del roadmap */}
      <div className="w-full max-w-xl rounded-card border border-border bg-surface p-7">
        <p className="mb-4 font-display text-lg font-semibold text-text">Temas a repasar</p>

        {!roadmapListo ? (
          <p className="text-sm text-text-muted font-body">
            Generando tu roadmap personalizado… esto puede tardar unos segundos.
          </p>
        ) : (
          <div>
            {temasPendientes.map((tema) => (
              <TopicPill key={tema} texto={tema} variant="pendiente" />
            ))}
            {temasDominados.map((tema) => (
              <TopicPill key={tema} texto={tema} variant="dominado" />
            ))}
          </div>
        )}
      </div>

      <div className="flex w-full max-w-xl justify-between">
        <Boton variant="ghost" onClick={() => navigate('/subir-contenido')}>
          Volver al inicio
        </Boton>
        <Boton onClick={() => navigate('/roadmap')} disabled={!roadmapListo}>
          Ver roadmap completo
        </Boton>
      </div>
    </div>
  );
}