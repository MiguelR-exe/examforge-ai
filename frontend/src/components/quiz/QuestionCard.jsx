import Card from "../common/Card";
import OptionButton from "./OptionButton";

const LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({ question, selectedAnswer, onSelect, revealed, correctAnswer, topicLabel }) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center justify-between">
        {topicLabel && (
          <span className="rounded-md bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand-glow">
            {topicLabel}
          </span>
        )}
      </div>

      <h2 className="mb-6 font-display text-lg font-semibold leading-snug text-ink">
        {question.question}
      </h2>

      <div className="space-y-3">
        {LETTERS.map((letter) => {
          const text = question.options?.[letter];
          if (!text) return null;
          return (
            <OptionButton
              key={letter}
              letter={letter}
              text={text}
              selected={selectedAnswer === letter}
              revealed={revealed}
              isCorrect={revealed && correctAnswer === letter}
              onClick={() => onSelect(letter)}
            />
          );
        })}
      </div>
    </Card>
  );
}
