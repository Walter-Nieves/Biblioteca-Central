import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const base =
    "px-4 py-2 rounded-lg font-medium transition flex items-center gap-2";
  const active =
    "bg-indigo-600 text-white shadow-md";
  const inactive =
    "text-stone-700 hover:bg-stone-100";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${base} ${isActive ? active : inactive}`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur shadow-lg">
      <nav
        className="px-[5%] py-4 flex items-center justify-between"
        aria-label="Navegación principal"
      >
        {/* LOGO / TITULO */}
        <span className="font-bold text-indigo-600 text-lg">
          📚 Biblioteca
        </span>

        {/* BOTÓN HAMBURGUESA */}
        <button
          onClick={() => setOpen(!open)}
          className="hidden max-[725px]:flex text-2xl"
          aria-label="Abrir menú"
        >
          {open ? "✖" : "☰"}
        </button>

        {/* MENÚ DESKTOP */}
        <div className="flex gap-4 max-[725px]:hidden">
          <NavLink to="/" className={linkClass}>
            📚 Biblioteca
          </NavLink>

          <NavLink to="/crear-relacion" className={linkClass}>
            🔗 Relacionar
          </NavLink>

          <NavLink to="/consultas" className={linkClass}>
            🔍 Consultas
          </NavLink>

          <NavLink to="/restaurar" className={linkClass}>
            ♻️ Restaurar
          </NavLink>

          <NavLink to="/eliminar" className={linkClass}>
            🗑️ Eliminar
          </NavLink>
        </div>
      </nav>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="hidden max-[725px]:block bg-white shadow-xl border-t">
          <div className="flex flex-col gap-2 p-4">
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
              📚 Biblioteca
            </NavLink>

            <NavLink
              to="/crear-relacion"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              🔗 Relacionar
            </NavLink>

            <NavLink
              to="/consultas"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              🔍 Consultas
            </NavLink>

            <NavLink
              to="/restaurar"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              ♻️ Restaurar
            </NavLink>

            <NavLink
              to="/eliminar"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              🗑️ Eliminar
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
