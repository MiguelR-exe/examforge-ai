import Button from "../common/Button";

export default function QuizNavigation({ onNext, isLast, disabled }) {
  return (
    <div className="flex justify-end">
      <Button onClick={onNext} disabled={disabled}>
        {isLast ? "Ver resultados" : "Siguiente pregunta"} →
      </Button>
    </div>
  );
}
