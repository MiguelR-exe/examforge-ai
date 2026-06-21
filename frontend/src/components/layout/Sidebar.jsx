// El diseño de referencia usa navegación superior (Navbar), no un sidebar lateral.
// Este componente queda disponible por si una vista futura (ej. un panel de
// administración) lo necesita, pero no se monta en el layout actual.
export default function Sidebar({ children }) {
  return (
    <aside className="hidden w-60 flex-col gap-1 border-r border-base-border bg-base-surface p-4 lg:flex">
      {children}
    </aside>
  );
}