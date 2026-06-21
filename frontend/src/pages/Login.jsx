import LoginForm from "../components/auth/LoginForm";
import logo from "../assets/logo.png";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-base-border bg-base-surface p-8 shadow-glow">
          <div className="flex flex-col items-center mb-6">
            <img
                src={logo}
                alt="ExamForge AI"
                className="h-20 w-auto"
            />
            </div>

          <h1 className="font-display text-xl font-semibold text-ink">
            Inicia sesión en tu espacio
          </h1>
          <p className="mb-6 mt-1 text-sm text-ink-muted">
            Accede a tus planes de estudio, progreso e insights de IA.
          </p>

          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-ink-faint">
          Al continuar, aceptas los Términos de Servicio y la Política de Privacidad.
        </p>
      </div>
    </div>
  );
}
