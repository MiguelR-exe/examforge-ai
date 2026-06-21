import Card from "../common/Card";
import Button from "../common/Button";

// Tarjeta resumen para iniciar un quiz desde un documento ya procesado
// (se usa, por ejemplo, en la página de Upload tras un análisis exitoso).
export default function QuizCard({ documentName, topicsCount, onStart }) {
  return (
    <Card className="flex items-center justify-between p-5">
      <div>
        <p className="font-display text-sm font-semibold text-ink">{documentName}</p>
        <p className="text-xs text-ink-faint">{topicsCount} temas detectados</p>
      </div>
      <Button onClick={onStart}>Generar quiz →</Button>
    </Card>
  );
}