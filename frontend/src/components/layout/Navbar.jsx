import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.png";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-base-border bg-base/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
        <img
            src={logo}
            alt="ExamForge AI"
            className="h-10 w-10 rounded-lg"
        />
        <span className="font-display text-base font-semibold text-ink">
            ExamForge
        </span>
        <span className="rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand-glow">
            AI
        </span>
        </div>

        <nav className="hidden items-center gap-1 rounded-xl bg-base-raised p-1 md:flex">
          <Link
            to="/dashboard"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive("/dashboard") ? "bg-brand text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/upload"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive("/upload") ? "bg-brand text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            Subir documento
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/profile" className="flex items-center gap-2 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
              {initials(user?.name || user?.email || "?")}
            </span>
            <span className="hidden text-sm text-ink-muted group-hover:text-ink sm:block">
              {user?.name || user?.email}
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-ink-faint hover:text-ink"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}