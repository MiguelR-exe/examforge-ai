import { useNavigate } from "react-router-dom";

import Card from "../common/Card";
import EmptyState from "../common/EmptyState";

import { formatRelativeDate } from "../../utils/formatDate";
import { quizService } from "../../services/quizService";

export default function RecentDocuments({ documents = [] }) {
  const navigate = useNavigate();

  const handleGenerateQuiz = async (documentId) => {
    try {
      const response = await quizService.generateQuiz({
        documentId,
        numQuestions: 5,
        difficulty: "intermedio",
      });

      console.log("QUIZ GENERADO:", response);

      navigate(`/quiz/${response.quizId}`);
    } catch (error) {
      console.error(error);
      alert("No se pudo generar el quiz");
    }
  };

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-ink">
          Documentos recientes
        </h2>

        <span className="text-xs text-ink-faint">
          {documents.length}
        </span>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          title="Aún no subes documentos"
          description="Sube tu primer PDF para generar un plan de estudio."
        />
      ) : (
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li
              key={doc.documentId}
              className="flex items-center justify-between rounded-xl border border-base-border bg-base px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand-glow">
                  📄
                </span>

                <div>
                  <p className="text-sm font-medium text-ink">
                    {doc.bucketKey}
                  </p>

                  <p className="text-xs text-ink-faint">
                    {formatRelativeDate(doc.createdAt)}
                  </p>

                  <p className="mt-1 text-xs text-ink-faint">
                    Estado: {doc.status}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleGenerateQuiz(doc.documentId)}
                disabled={doc.status !== "ANALYZED"}
                className="text-xs font-medium text-brand-glow hover:underline disabled:cursor-not-allowed disabled:opacity-40"
              >
                Generar quiz →
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}