/**
 * Botón de acción primaria de la app.
 * Variantes: 'primary' (naranja, acción principal) y 'ghost' (sin relleno, acción secundaria).
 */
export default function Boton({ children, onClick, variant = 'primary', disabled = false, type = 'button' }) {
  const base =
    'rounded-[10px] px-7 py-3.5 font-semibold text-sm font-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-dark',
    ghost: 'bg-transparent text-text border border-border hover:border-accent hover:text-accent-dark',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
