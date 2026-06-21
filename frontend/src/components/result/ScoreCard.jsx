import Card from "../common/Card";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";

function messageForScore(score) {
  if (score >= 80) return "¡Excelente trabajo!";
  if (score >= 50) return "Vas bien, sigue practicando";
  return "Sigue estudiando";
}

export default function ScoreCard({ score, correctCount, totalQuestions }) {
  return (
    <Card className="mx-auto max-w-md p-8 text-center">
      <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand-glow">
        <BarChart3 className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <h1 className="font-display text-xl font-semibold text-ink">{messageForScore(score)}</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Respondiste {correctCount} de {totalQuestions} preguntas correctamente.
      </p>

      <p className="my-6 font-display text-5xl font-bold text-brand-glow">{score}%</p>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-base px-3 py-3">
          <p className="font-display text-lg font-bold text-good">{correctCount}</p>
          <p className="text-xs text-ink-faint">Correctas</p>
        </div>
        <div className="rounded-xl bg-base px-3 py-3">
          <p className="font-display text-lg font-bold text-bad">{totalQuestions - correctCount}</p>
          <p className="text-xs text-ink-faint">Incorrectas</p>
        </div>
        <div className="rounded-xl bg-base px-3 py-3">
          <p className="font-display text-lg font-bold text-ink">{totalQuestions}</p>
          <p className="text-xs text-ink-faint">Total</p>
        </div>
      </div>

      <Link to="/dashboard">
        <Button className="w-full justify-center">Ir al Dashboard→</Button>
      </Link>
    </Card>
  );
}