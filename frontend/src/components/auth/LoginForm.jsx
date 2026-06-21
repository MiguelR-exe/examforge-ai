import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { validateLoginForm } from "../../utils/validators";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

export default function LoginForm() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateLoginForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await login(form);
      navigate("/dashboard");
    } catch {
      // el error ya queda expuesto vía `error` del contexto
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">Correo electrónico</label>
        <input
          type="email"
          name="email"
          placeholder="tu@correo.com"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-base-border bg-base px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand"
        />
        {fieldErrors.email && <p className="mt-1 text-xs text-bad">{fieldErrors.email}</p>}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm text-ink-muted">Contraseña</label>
          <Link to="#" className="text-xs text-brand-glow hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-base-border bg-base px-3.5 py-2.5 pr-10 text-sm text-ink placeholder:text-ink-faint focus:border-brand"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.5} /> : <Eye className="h-4 w-4" strokeWidth={1.5} />}
          </button>
        </div>
        {fieldErrors.password && <p className="mt-1 text-xs text-bad">{fieldErrors.password}</p>}
      </div>

      <ErrorMessage message={error} />

      <Button type="submit" loading={loading} className="w-full justify-center">
        Iniciar sesión →
      </Button>

      <div className="flex items-center gap-3 text-xs text-ink-faint">
        <div className="h-px flex-1 bg-base-border" />
        o
        <div className="h-px flex-1 bg-base-border" />
      </div>

      <p className="text-center text-sm text-ink-muted">
        ¿No tienes una cuenta?{" "}
        <Link to="/register" className="font-medium text-brand-glow hover:underline">
          Crear espacio de trabajo
        </Link>
      </p>
    </form>
  );
}