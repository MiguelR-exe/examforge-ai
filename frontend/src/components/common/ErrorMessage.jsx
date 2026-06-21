export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="font-medium underline hover:no-underline">
          Reintentar
        </button>
      )}
    </div>
  );
}