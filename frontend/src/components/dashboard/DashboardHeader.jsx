import { useAuth } from "../../hooks/useAuth";

export default function DashboardHeader() {
  const { user } = useAuth();
  const firstName = (user?.name || user?.email || "").split(" ")[0];

  return (
    <div className="mb-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Hola de nuevo, {firstName}.
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        Sube un PDF para generar tu plan de estudio personalizado con IA.
      </p>
    </div>
  );
}
