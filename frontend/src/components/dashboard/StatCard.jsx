import Card from "../common/Card";

export default function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-ink-faint">{label}</span>
        {Icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand-glow">
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
        )}
      </div>
      <p className="font-display text-2xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
    </Card>
  );
}
