export default function Loader({ label = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-muted">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-base-border border-t-brand" />
      <p className="text-sm">{label}</p>
    </div>
  );
}