import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { validateRegisterForm } from "../../utils/validators";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

export default function RegisterForm() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateRegisterForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await register(form);
      navigate("/dashboard");
    } catch {
      // el error ya queda expuesto vía `error` del contexto
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">Nombre completo</label>
        <input
          type="text"
          name="name"
          placeholder="Ana Torres"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-lg border border-base-border bg-base px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand"
        />
        {fieldErrors.name && <p className="mt-1 text-xs text-bad">{fieldErrors.name}</p>}
      </div>

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
        <label className="mb-1.5 block text-sm text-ink-muted">Contraseña</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-base-border bg-base px-3.5 py-2.5 pr-10 text-sm text-ink placeholder:text-ink-faint focus:border-brand"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
            aria-label="Mostrar contraseña"
          >
            👁
          </button>
        </div>
        {fieldErrors.password && <p className="mt-1 text-xs text-bad">{fieldErrors.password}</p>}
      </div>

      <ErrorMessage message={error} />

      <Button type="submit" loading={loading} className="w-full justify-center">
        Crear espacio de trabajo →
      </Button>

      <p className="text-center text-sm text-ink-muted">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="font-medium text-brand-glow hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}