import Button from "../common/Button";

export default function QuizNavigation({ onNext, isLast, disabled, loading }) {
  return (
    <div className="flex justify-end">
      <Button onClick={onNext} disabled={disabled} loading={loading}>
        {isLast ? "Ver resultados" : "Siguiente pregunta"} →
      </Button>
    </div>
  );
}
