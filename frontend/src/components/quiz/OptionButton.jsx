const LETTER_STYLE_DEFAULT = "bg-base-raised text-ink-muted";
const LETTER_STYLE_SELECTED = "bg-brand text-white";
const LETTER_STYLE_CORRECT = "bg-good text-white";
const LETTER_STYLE_WRONG = "bg-bad text-white";

export default function OptionButton({ letter, text, selected, revealed, isCorrect, onClick }) {
  let containerStyle = "border-base-border bg-base hover:border-brand/50";
  let letterStyle = LETTER_STYLE_DEFAULT;
  let icon = null;

  if (revealed) {
    if (isCorrect) {
      containerStyle = "border-good/40 bg-good/5";
      letterStyle = LETTER_STYLE_CORRECT;
      icon = "✓";
    } else if (selected) {
      containerStyle = "border-bad/40 bg-bad/5";
      letterStyle = LETTER_STYLE_WRONG;
      icon = "✕";
    }
  } else if (selected) {
    containerStyle = "border-brand bg-brand/5";
    letterStyle = LETTER_STYLE_SELECTED;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={revealed}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm transition-colors ${containerStyle}`}
    >
      <span className="flex items-center gap-3">
        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${letterStyle}`}>
          {letter}
        </span>
        <span className="text-ink">{text}</span>
      </span>
      {icon && (
        <span className={isCorrect ? "text-good" : "text-bad"}>{icon}</span>
      )}
    </button>
  );
}
