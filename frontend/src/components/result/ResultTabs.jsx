/**
 * Segmented control de pestañas para Results.
 * `tabs`: [{ id, label, icon }]
 */
export default function ResultTabs({ tabs, active, onChange }) {
  return (
    <div className="mb-6 flex w-fit items-center gap-1 rounded-xl border border-base-border bg-base-surface p-1">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-brand text-white shadow-glow" : "text-ink-muted hover:text-ink"
            }`}
          >
            {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}