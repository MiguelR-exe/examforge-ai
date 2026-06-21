import { Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/common/Card";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const FEATURES = [
  "Acceso a generación de quizzes mediante IA",
  "Carga y análisis automático de documentos PDF",
  "Seguimiento de progreso académico",
  "Historial de evaluaciones",
];

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Perfil</h1>
        <p className="mt-1 text-ink-muted">Información de tu cuenta ExamForge AI.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-brand/30 via-brand/10 to-transparent" />

        <div className="p-8">
          <div className="-mt-16 mb-6 flex items-end gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-base-surface bg-brand text-3xl font-bold text-white shadow-glow">
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">{user?.name}</h2>
              <p className="text-ink-muted">{user?.email}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <p className="mb-2 text-xs uppercase tracking-wide text-ink-faint">Nombre</p>
              <p className="font-medium text-ink">{user?.name}</p>
            </Card>

            <Card className="p-5">
              <p className="mb-2 text-xs uppercase tracking-wide text-ink-faint">Correo electrónico</p>
              <p className="font-medium text-ink">{user?.email}</p>
            </Card>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 font-display text-lg font-semibold text-ink">
              Acerca de esta cuenta
            </h3>

            <Card className="p-5">
              <ul className="space-y-3 text-sm text-ink-muted">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 shrink-0 text-good" strokeWidth={2} />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}