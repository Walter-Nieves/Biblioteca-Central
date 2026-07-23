
import { useState } from "react";
import { postData, deleteData } from "../api/api";
import { sanitizarTexto, validarTexto } from "../utils/validation";
import { useData } from "../context/DataContext";

export default function Categorias() {
  const { categorias, refetchCategorias } = useData();
  const [nombre, setNombre] = useState("");

  const agregarCategoria = async () => {
    if (!nombre.trim()) return alert("⚠️ El nombre es obligatorio");

    const error = validarTexto(nombre);
    if (error) return alert(error);

    await postData("categorias", {
      nombre: sanitizarTexto(nombre),
    });

    setNombre("");
    await refetchCategorias();
  };

  const eliminarCategoria = async (id: number) => {
    await deleteData(`categorias/${id}`);
    await refetchCategorias();
  };

  return (
    <div className="section-card">
      <h2 className="section-title">🏷️ Categorías</h2>

      {/* ⬇️ MISMO ESTILO QUE LIBROS */}
      <div className="flex flex-col gap-3 mb-6">
        <input
          className="input"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la categoría"
        />

        <button className="btn-primary w-full" onClick={agregarCategoria}>
          Agregar categoría
        </button>
      </div>

      {/* ⬇️ LISTA SIN CAMBIOS */}
      <ul className="space-y-3 mt-4">
        {categorias.map((c,i) => (
          <li key={i} className="item">
            {c.nombre}
            <button
              className="btn-delete"
              onClick={() => eliminarCategoria(c.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
