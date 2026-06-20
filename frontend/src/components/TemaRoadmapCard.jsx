/**
 * Card expandible de un tema dentro del roadmap completo.
 * Muestra el orden pedagógico (prerrequisito), el estado, y la explicación
 * generada por el LLM (evento "RoadmapListo" → Lambda "GenerarPdfExplicacion").
 */
export default function TemaRoadmapCard({ numero, titulo, estado, explicacion, prerequisitoDe }) {
  const esPendiente = estado === 'pendiente';

  return (
    <div className="w-full rounded-card border border-border bg-surface p-7">
      <div className="flex items-start gap-4">
        <span
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${
            esPendiente ? 'bg-error-bg text-error' : 'bg-success-bg text-success'
          }`}
        >
          {numero}
        </span>

        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between gap-3">
            <h3 className="font-display text-lg font-semibold text-text">{titulo}</h3>
            <span
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold font-body ${
                esPendiente ? 'bg-error-bg text-error' : 'bg-success-bg text-success'
              }`}
            >
              {esPendiente ? 'A repasar' : 'Dominado'}
            </span>
          </div>

          <p className="mb-3 text-sm leading-relaxed text-text-muted font-body">{explicacion}</p>

          {prerequisitoDe && (
            <p className="text-xs font-medium text-accent-dark font-body">
              Prerrequisito para: {prerequisitoDe}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}