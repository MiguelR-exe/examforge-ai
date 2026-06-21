import Card from "../common/Card";

export default function QuestionReview({ detail = [], questions = [] }) {
  const questionById = Object.fromEntries(questions.map((q) => [q.questionId, q]));

  return (
    <Card className="p-5">
      <h2 className="mb-4 font-display text-sm font-semibold text-ink">Revisión de respuestas</h2>
      <div className="space-y-4">
        {detail.map((item, i) => {
          const question = questionById[item.questionId];
          return (
            <div key={item.questionId} className="rounded-xl border border-base-border bg-base p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-ink">
                  {i + 1}. {question?.question}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.isCorrect ? "bg-good/10 text-good" : "bg-bad/10 text-bad"
                  }`}
                >
                  {item.isCorrect ? "Correcta" : "Incorrecta"}
                </span>
              </div>
              <p className="text-xs text-ink-muted">
                Tu respuesta: <span className="font-medium text-ink">{item.yourAnswer || "—"}</span>
                {" · "}
                Correcta: <span className="font-medium text-good">{item.correctAnswer}</span>
              </p>
              {item.explanation && (
                <p className="mt-2 rounded-lg bg-brand/5 px-3 py-2 text-xs text-ink-muted">
                  <span className="font-medium text-brand-glow">Explicación: </span>
                  {item.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
