/**
 * Pill visual para un tema del roadmap.
 * variant: 'pendiente' (rojo, tema a repasar) o 'dominado' (verde, tema ya superado)
 */
export default function TopicPill({ texto, variant = 'pendiente' }) {
  const styles = {
    pendiente: 'bg-error-bg text-error',
    dominado: 'bg-success-bg text-success',
  };

  return (
    <span
      className={`mb-2 mr-2 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold font-body ${styles[variant]}`}
    >
      {texto}
      {variant === 'dominado' && ' ✓'}
    </span>
  );
}