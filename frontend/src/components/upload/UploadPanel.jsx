import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2, Sparkles } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useUpload } from "../../hooks/useUpload";
import { usePollDocumentStatus } from "../../hooks/usePollDocumentStatus";
import { quizService } from "../../services/quizService";

import Card from "../common/Card";
import Button from "../common/Button";
import UploadZone from "./UploadZone";
import UploadProgress from "./UploadProgress";

/**
 * Flujo completo de subida + espera de análisis, en un solo panel:
 * 1. Selección de archivo(s) (UploadZone, valida PDF)
 * 2. Subida a S3 vía URL prefirmada (useUpload)
 * 3. Polling a /dashboard hasta que el documento quede ANALYZED
 *    (usePollDocumentStatus) — el paso 2 termina mucho antes que el
 *    análisis real, así que sin esto el mensaje de éxito sería falso.
 * 4. Acción de generar quiz, ya con el documentId real.
 */
export default function UploadPanel({ onQuizGenerated }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { upload, stage, error, reset: resetUpload, STAGES } = useUpload(user?.email);
  const poll = usePollDocumentStatus();

  const [pendingFile, setPendingFile] = useState(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [quizError, setQuizError] = useState(null);

  const handleFilesSelected = (files) => {
    // Por simplicidad de UX, este panel procesa un documento a la vez:
    // si arrastran varios, solo tomamos el primero. (El backend sí soporta
    // múltiples uploads independientes vía /documents/upload-url repetido,
    // pero seguir varios polls en paralelo en este panel agregaría
    // complejidad de UI que hoy no se justifica.)
    const file = files[0];
    if (!file) return;
    setPendingFile(file);
  };

  useEffect(() => {
    if (!pendingFile) return;
    let cancelled = false;

    (async () => {
      try {
        await upload(pendingFile);
        if (!cancelled) {
          poll.start(user?.email, pendingFile.name);
        }
      } catch {
        // el error ya queda expuesto vía `error` de useUpload
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFile]);

  const handleGenerateQuiz = async () => {
    if (!poll.document) return;
    setQuizError(null);
    setGeneratingQuiz(true);
    try {
      const response = await quizService.generateQuiz({
        documentId: poll.document.documentId,
        numQuestions: 5,
        difficulty: "intermedio",
      });
      if (onQuizGenerated) {
        onQuizGenerated(response.quizId);
      } else {
        navigate(`/quiz/${response.quizId}`);
      }
    } catch {
      setQuizError("No se pudo generar el quiz. Intenta de nuevo.");
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleReset = () => {
    setPendingFile(null);
    resetUpload();
    poll.reset();
    setQuizError(null);
  };

  const isIdle = !pendingFile && stage === STAGES.IDLE;
  const isUploading = stage === STAGES.REQUESTING_URL || stage === STAGES.UPLOADING;
  const isAnalyzing = stage === STAGES.DONE && (poll.status === "polling" || poll.status === "idle");
  const isDone = poll.status === "found";
  const isTimeout = poll.status === "timeout";
  const isUploadError = stage === STAGES.ERROR;

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-glow" strokeWidth={1.75} />
        <h2 className="font-display text-sm font-semibold text-ink">Vault de documentos</h2>
      </div>

      {isIdle && <UploadZone onFileSelected={handleFilesSelected} disabled={false} />}

      {isUploading && (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl border border-base-border bg-base px-6 py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-glow" strokeWidth={1.5} />
          <p className="font-display text-sm font-semibold text-ink">Subiendo {pendingFile?.name}…</p>
          <UploadProgress stage={stage} />
        </div>
      )}

      {isAnalyzing && (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl border border-brand/25 bg-brand/5 px-6 py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-glow" strokeWidth={1.5} />
          <div>
            <p className="font-display text-sm font-semibold text-ink">Analizando con IA…</p>
            <p className="mt-1 text-xs text-ink-muted">{pendingFile?.name}</p>
          </div>
          <p className="text-xs text-ink-faint">
            Esto normalmente toma unos segundos. No cierres esta pestaña.
          </p>
        </div>
      )}

      {isTimeout && (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-warn/25 bg-warn/5 px-6 py-10 text-center">
          <p className="font-display text-sm font-semibold text-ink">
            El análisis está tardando más de lo normal
          </p>
          <p className="max-w-sm text-xs text-ink-muted">
            El documento sigue procesándose en segundo plano. Puedes seguir esperando o revisar el
            dashboard más tarde — aparecerá ahí en cuanto esté listo.
          </p>
          <div className="mt-2 flex gap-3">
            <Button variant="ghost" onClick={handleReset}>
              Subir otro documento
            </Button>
            <Button onClick={() => poll.start(user?.email, pendingFile?.name)}>
              Seguir esperando
            </Button>
          </div>
        </div>
      )}

      {isDone && (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl border border-good/25 bg-good/5 px-6 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-good text-white">
            <Check className="h-6 w-6" strokeWidth={2} />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-ink">Documento analizado</p>
            <p className="mt-1 text-xs text-ink-muted">{pendingFile?.name}</p>
          </div>
          {quizError && <p className="text-xs text-bad">{quizError}</p>}
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleReset}>
              Subir otro
            </Button>
            <Button onClick={handleGenerateQuiz} loading={generatingQuiz}>
              Generar quiz →
            </Button>
          </div>
        </div>
      )}

      {isUploadError && (
        <div className="rounded-2xl border border-bad/25 bg-bad/5 px-6 py-8 text-center">
          <p className="mb-3 text-sm text-bad">{error}</p>
          <Button variant="ghost" onClick={handleReset}>
            Intentar de nuevo
          </Button>
        </div>
      )}
    </Card>
  );
}
