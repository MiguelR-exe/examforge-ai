import RegisterForm from "../components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-base-border bg-base-surface p-8 shadow-glow">
          <div className="mb-6 flex items-center gap-3">
            <img src="/logo.svg" alt="" className="h-9 w-9" />
            <div>
              <p className="font-display text-base font-semibold text-ink">ExamForge AI</p>
              <p className="text-xs text-ink-faint">Sistema de estudio inteligente</p>
            </div>
          </div>

          <h1 className="font-display text-xl font-semibold text-ink">
            Crea tu espacio de trabajo
          </h1>
          <p className="mb-6 mt-1 text-sm text-ink-muted">
            Configura tu entorno de aprendizaje con IA en segundos.
          </p>

          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-xs text-ink-faint">
          Al crear una cuenta, aceptas los Términos de Servicio.
        </p>
      </div>
    </div>
  );
}
