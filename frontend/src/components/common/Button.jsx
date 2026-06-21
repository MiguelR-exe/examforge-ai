const VARIANTS = {
  primary:
    "bg-brand hover:bg-brand-dim text-white shadow-glow disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent border border-base-border text-ink-muted hover:text-ink hover:border-brand/50",
  danger: "bg-bad/10 border border-bad/30 text-bad hover:bg-bad/20",
  subtle: "bg-base-raised text-ink-muted hover:text-ink",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  icon = null,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
        transition-colors duration-150 ${VARIANTS[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
