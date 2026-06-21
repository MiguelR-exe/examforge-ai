import { Check, X, TrendingUp } from "lucide-react";
import Card from "../common/Card";

/**
 * Analytics del intento actual, calculado 100% a partir de
 * result.detail (lo que devuelve POST /quizzes/{id}/submit).
 * No hay breakdown "por tema" porque el backend no asocia un tema
 * a cada pregunta — mostrarlo sería inventar datos.
 */
function calcularRachaMaxima(detail) {
  let maxima = 0;
  let actual = 0;
  for (const item of detail) {
    if (item.isCorrect) {
      actual += 1;
      maxima = Math.max(maxima, actual);
    } else {
      actual = 0;
    }
  }
  return maxima;
}

export default function AnalyticsPanel({ result, questions = [] }) {
  const detail = result?.detail || [];
  const questionById = Object.fromEntries(questions.map((q) => [q.questionId, q]));
  const rachaMaxima = calcularRachaMaxima(detail);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-1">
        <Card className="p-5">
          <p className="mb-1 text-xs text-ink-faint">Puntaje del intento</p>
          <p className="font-display text-3xl font-bold text-brand-glow">{result.score}%</p>
        </Card>
        <Card className="p-5">
          <p className="mb-1 flex items-center gap-1.5 text-xs text-ink-faint">
            <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.5} />
            Racha máxima de aciertos
          </p>
          <p className="font-display text-2xl font-bold text-ink">{rachaMaxima}</p>
        </Card>
        <Card className="p-5">
          <p className="mb-3 text-xs text-ink-faint">Distribución</p>
          <div className="flex h-2 overflow-hidden rounded-full bg-base">
            <div
              className="bg-good"
              style={{ width: `${(result.correctCount / result.totalQuestions) * 100}%` }}
            />
            <div
              className="bg-bad"
              style={{
                width: `${((result.totalQuestions - result.correctCount) / result.totalQuestions) * 100}%`,
              }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs">
            <span className="text-good">{result.correctCount} correctas</span>
            <span className="text-bad">{result.totalQuestions - result.correctCount} incorrectas</span>
          </div>
        </Card>
      </div>

      <Card className="p-5 lg:col-span-2">
        <h3 className="mb-4 font-display text-sm font-semibold text-ink">
          Resultado por pregunta
        </h3>
        <div className="space-y-2">
          {detail.map((item, i) => {
            const question = questionById[item.questionId];
            return (
              <div
                key={item.questionId}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
                  item.isCorrect ? "border-good/20 bg-good/5" : "border-bad/20 bg-bad/5"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${
                    item.isCorrect ? "bg-good" : "bg-bad"
                  }`}
                >
                  {item.isCorrect ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                  )}
                </span>
                <p className="flex-1 truncate text-sm text-ink-muted">
                  {i + 1}. {question?.question || "Pregunta " + (i + 1)}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
