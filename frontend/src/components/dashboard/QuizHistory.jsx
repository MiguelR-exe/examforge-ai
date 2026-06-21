import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import { formatRelativeDate } from "../../utils/formatDate";

function scoreColor(score) {
  if (score >= 80) return "text-good";
  if (score >= 50) return "text-warn";
  return "text-bad";
}

export default function QuizHistory({ history = [] }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-ink">Historial de quizzes</h2>
        <span className="text-xs text-ink-faint">{history.length}</span>
      </div>

      {history.length === 0 ? (
        <EmptyState
          title="Sin quizzes todavía"
          description="Genera un quiz desde un documento procesado para ver tu progreso aquí."
        />
      ) : (
        <ul className="space-y-3">
          {history.map((item) => (
            <li
              key={item.quizId}
              className="flex items-center justify-between rounded-xl border border-base-border bg-base px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-ink">
                  {item.correctCount}/{item.totalQuestions} correctas
                </p>
                <p className="text-xs text-ink-faint">{formatRelativeDate(item.completedAt)}</p>
              </div>
              <span className={`font-display text-lg font-bold ${scoreColor(item.score)}`}>
                {item.score}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}