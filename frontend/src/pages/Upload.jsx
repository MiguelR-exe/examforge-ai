import { Zap, BookOpen, TrendingUp, Cpu } from "lucide-react";
import UploadPanel from "../components/upload/UploadPanel";
import Card from "../components/common/Card";

const BENEFITS = [
  {
    icon: Zap,
    title: "Quiz automático",
    description: "Preguntas generadas por IA a partir de tu documento.",
  },
  {
    icon: BookOpen,
    title: "Resumen de temas",
    description: "Identificación de conceptos clave del contenido.",
  },
  {
    icon: TrendingUp,
    title: "Seguimiento",
    description: "Historial y métricas de tu aprendizaje en el dashboard.",
  },
  {
    icon: Cpu,
    title: "IA Groq",
    description: "Generación rápida de evaluaciones con baja latencia.",
  },
];

export default function Upload() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">
          Crear nuevo material de estudio
        </h1>
        <p className="mt-2 text-ink-muted">
          Sube un PDF y ExamForge generará preguntas, evaluaciones y recomendaciones usando IA.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UploadPanel />
        </div>

        <Card className="p-6">
          <h3 className="mb-4 font-display text-lg font-semibold text-ink">¿Qué obtendrás?</h3>
          <div className="space-y-4">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand-glow">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-medium text-ink">{title}</p>
                  <p className="text-sm text-ink-muted">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
