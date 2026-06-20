const LETRAS = ['A', 'B', 'C', 'D', 'E'];

/**
 * Tarjeta de una pregunta del quiz con sus alternativas.
 *
 * Props:
 * - tema: string, ej. "Derivadas"
 * - dificultad: string, ej. "Dificultad media"
 * - texto: el enunciado de la pregunta
 * - alternativas: array de strings
 * - seleccionada: índice de la alternativa elegida por el usuario (o null)
 * - correcta: índice de la alternativa correcta — solo se pasa DESPUÉS de calificar
 *   (mientras el usuario está respondiendo, no se envía esta prop, para no filtrar la respuesta)
 * - onSeleccionar: callback(index) cuando el usuario elige una alternativa
 * - calificada: boolean, si ya se mostró el resultado de esta pregunta
 */
export default function PreguntaCard({
  tema,
  dificultad,
  texto,
  alternativas,
  seleccionada,
  correcta,
  onSeleccionar,
  calificada = false,
}) {
  function estiloOpcion(index) {
    if (!calificada) {
      return index === seleccionada
        ? 'border-accent bg-accent-light'
        : 'border-border hover:border-accent hover:bg-orange-50';
    }
    // Modo calificado: resaltar correcta/incorrecta
    if (index === correcta) {
      return 'border-success bg-success-bg';
    }
    if (index === seleccionada && index !== correcta) {
      return 'border-error bg-error-bg';
    }
    return 'border-border opacity-60';
  }

  function estiloLetra(index) {
    if (!calificada) {
      return index === seleccionada
        ? 'bg-accent border-accent text-white'
        : 'bg-bg border-border text-text-muted';
    }
    if (index === correcta) return 'bg-success border-success text-white';
    if (index === seleccionada && index !== correcta) return 'bg-error border-error text-white';
    return 'bg-bg border-border text-text-muted';
  }

  return (
    <div className="w-full max-w-xl rounded-card border border-border bg-surface p-9 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent-dark font-body">
        {tema} — {dificultad}
      </p>
      <p className="mb-7 font-display text-2xl font-semibold leading-snug text-text">
        {texto}
      </p>
      <div className="flex flex-col gap-3">
        {alternativas.map((alt, index) => (
          <div
            key={index}
            onClick={() => !calificada && onSeleccionar?.(index)}
            className={`flex items-center gap-3.5 rounded-[10px] border-[1.5px] px-4.5 py-4 text-[15px] font-medium font-body transition-colors ${
              calificada ? '' : 'cursor-pointer'
            } ${estiloOpcion(index)}`}
          >
            <span
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] text-xs font-bold ${estiloLetra(
                index
              )}`}
            >
              {LETRAS[index]}
            </span>
            {alt}
          </div>
        ))}
      </div>
    </div>
  );
}
