import { useState } from "react";
import { postData, deleteData } from "../api/api";
import { sanitizarTexto, validarTexto } from "../utils/validation";
import { useData } from "../context/DataContext";
import type { Autor } from "../types";

export default function Autores() {
  const { autores, refetchAutores } = useData();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  const agregarAutor = async () => {
    if (!nombre.trim() || !apellido.trim()) {
      alert("⚠️ Nombre y apellido son obligatorios");
      return;
    }

    const error = validarTexto(nombre) || validarTexto(apellido);
    if (error) {
      alert(error);
      return;
    }

    await postData("autores", {
      nombre: sanitizarTexto(nombre),
      apellido: sanitizarTexto(apellido),
    });

    setNombre("");
    setApellido("");
    await refetchAutores();
  };

  const eliminarAutor = async (id: number) => {
    await deleteData(`autores/${id}`);
    await refetchAutores();
  };

  return (
    <div className="section-card">
      <h2 className="section-title">✍️ Autores</h2>

      <div className="flex flex-col gap-3 mb-6">
        <input
          className="input"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          className="input"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
        <button className="btn-primary w-full" onClick={agregarAutor}>
          Agregar autor
        </button>
      </div>

      <ul className="space-y-3">
        {autores.map((a: Autor, i: number) => (
          <li key={i} className="item">
            <span>{a.nombre} {a.apellido}</span>
            <button
              className="btn-delete"
              onClick={() => eliminarAutor(a.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
