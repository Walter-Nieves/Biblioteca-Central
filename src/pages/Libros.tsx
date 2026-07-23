import { useState } from "react";
import { postData, deleteData } from "../api/api";
import { sanitizarTexto, validarTexto } from "../utils/validation";
import { useData } from "../context/DataContext";
import type { Autor, Libro } from "../types";

export default function Libros() {
  const { libros, autores, refetchLibros } = useData();

  const [titulo, setTitulo] = useState("");
  const [autorId, setAutorId] = useState("");

  const agregarLibro = async () => {
    if (!titulo.trim() || !autorId) {
      alert("⚠️ Completa todos los campos");
      return;
    }

    const error = validarTexto(titulo);
    if (error) {
      alert(error);
      return;
    }

    await postData("libros", {
      titulo: sanitizarTexto(titulo),
      autor_id: Number(autorId),
    });

    setTitulo("");
    setAutorId("");
    await refetchLibros();
  };

  const eliminarLibro = async (id: number) => {
    await deleteData(`libros/${id}`);
    await refetchLibros();
  };

  return (
    <div className="section-card">
      <h2 className="section-title">📚 Libros</h2>

      <div className="flex flex-col gap-3 mb-6">
        <input
          className="input"
          placeholder="Título del libro"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <select
          className="input"
          value={autorId}
          onChange={(e) => setAutorId(e.target.value)}
        >
          <option value="">Selecciona un autor</option>
          {autores.map((a: Autor) => (
            <option key={a.id} value={a.id}>
              {a.nombre} {a.apellido}
            </option>
          ))}
        </select>

        <button className="btn-primary w-full" onClick={agregarLibro}>
          Agregar libro
        </button>
      </div>

      <ul className="space-y-3">
        {libros.map((l: Libro) => (
          <li key={l.id} className="item">
            <div>
              <strong>{l.titulo}</strong>
              <div className="text-sm text-stone-600">
                {l.autor_nombre} {l.autor_apellido}
              </div>
            </div>
            <button
              className="btn-delete"
              onClick={() => eliminarLibro(l.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
