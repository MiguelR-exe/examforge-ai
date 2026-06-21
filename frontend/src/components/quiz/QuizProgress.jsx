export default function QuizProgress({ current, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-6 rounded-full ${
            i < current ? "bg-good" : i === current ? "bg-brand" : "bg-base-border"
          }`}
        />
      ))}
    </div>
  );
}