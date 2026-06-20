/**
 * Barra de progreso del quiz (pregunta actual / total).
 */
export default function BarraProgreso({ actual, total }) {
  const porcentaje = Math.min(100, Math.round((actual / total) * 100));

  return (
    <div className="flex w-full items-center gap-4">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <span className="whitespace-nowrap text-sm font-medium text-text-muted font-body">
        Pregunta {actual} de {total}
      </span>
    </div>
  );
}
