import Card from "../common/Card";

/**
 * Placeholder honesto para secciones que aún no tienen datos reales del
 * backend (no hay endpoint de roadmap por fases ni de guía de estudio
 * generada — inventar esos datos en el frontend sería mostrar información
 * falsa al estudiante). Comunica claramente qué falta y por qué.
 */
export default function ComingSoonPanel({ icon: Icon, title, description, requirement }) {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      {Icon && (
        <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand-glow">
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
      )}
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      {requirement && (
        <span className="mt-2 rounded-md border border-base-border bg-base px-3 py-1.5 text-xs text-ink-faint">
          {requirement}
        </span>
      )}
    </Card>
  );
}
