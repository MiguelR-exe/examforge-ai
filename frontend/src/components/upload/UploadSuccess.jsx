import Button from "../common/Button";

export default function UploadSuccess({ fileName, onGenerateQuiz, onGoToDashboard }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-good/10 text-2xl text-good">
        ✓
      </span>
      <div>
        <p className="font-display text-base font-semibold text-ink">¡Documento procesado!</p>
        <p className="mt-1 text-sm text-ink-muted">
          <strong>{fileName}</strong> ya está analizado. Genera un quiz para empezar a practicar.
        </p>
      </div>
      <div className="flex w-full gap-3">
        <Button variant="ghost" onClick={onGoToDashboard} className="flex-1 justify-center">
          Ver dashboard
        </Button>
        <Button onClick={onGenerateQuiz} className="flex-1 justify-center">
          Generar quiz →
        </Button>
      </div>
    </div>
  );
}
