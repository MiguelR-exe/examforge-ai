import { Check } from "lucide-react";

const STEPS = [
  { key: "requesting-url", label: "Solicitando acceso seguro" },
  { key: "uploading", label: "Subiendo archivo" },
  { key: "processing", label: "Analizando con IA (Groq)" },
];

export default function UploadProgress({ stage }) {
  const activeIndex = STEPS.findIndex((s) => s.key === stage);

  return (
    <div className="space-y-3">
      {STEPS.map((step, i) => {
        const isDone = activeIndex > i;
        const isActive = activeIndex === i;
        return (
          <div key={step.key} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs
                ${isDone ? "bg-good text-white" : isActive ? "bg-brand text-white" : "bg-base-raised text-ink-faint"}`}
            >
              {isDone ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : i + 1}
            </span>
            <span className={`text-sm ${isActive ? "text-ink" : "text-ink-muted"}`}>
              {step.label}
              {isActive && "…"}
            </span>
          </div>
        );
      })}
    </div>
  );
}