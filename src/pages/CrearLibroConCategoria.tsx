import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  postData,
  getData, deleteData } from "../api/api";
import { useData } from "../context/DataContext";

type LibroCategoriasRow = {
  libro_id: number;
  libro: string;
  categoria: string[];
  categoria_id: number[];
};

export default function CrearLibroConCategoria() {
  const { libros, categorias } = useData();
  const [libroId, setLibroId] = useState<number | null>(null);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [existentes, setExistentes] = useState<number[]>([]);
  const [relaciones, setRelaciones] = useState<LibroCategoriasRow[]>([]);
  const [modal, setModal] = useState(false);
  const [, setLoading] = useState(false);

  const [trigger, setTrigger] = useState<boolean>(false);

  const BTN =
    "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition w-full";

  /* =========================
     CARGAR RELACIONES
  ========================= */

  useEffect(() => {
    const cargarRelaciones = async () => {
      const data = await getData<LibroCategoriasRow[]>("libros_categorias");
      console.log(data)
      setRelaciones(data);
    };

    cargarRelaciones();
  }, [trigger]);

  /* =========================
     ABRIR MODAL
  ========================= */
  const abrirModal = (id: number) => {
    setLibroId(id);
    setExistentes(
      relaciones.find((rel)=>rel.libro_id == id)?.categoria_id
      ?? []
    );
    setSeleccionadas([]);
    setModal(true);
  };

  /* =========================
     TOGGLE CATEGORÍA
  ========================= */
  const toggleCategoria = (id: number) => {
    if (existentes.includes(id)) return;

    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  /* =========================
     CREAR RELACIONES
  ========================= */
  const crearRelaciones = async () => {
    if (!libroId || seleccionadas.length === 0) return;

    setLoading(true);

    try {
      for (const categoria_id of seleccionadas) {
        await postData("libros_categorias", {
          libro_id: libroId,
          categoria_id,
        });
      }

      setModal(false);
      setTrigger(!trigger);
    } catch {
      alert("Error al crear relaciones");
    } finally {
      setLoading(false);
    }
  };

  const eliminarRelacion = async (id_libro: number, id_categoria: number) => {
    const id = `${id_libro}-${id_categoria}`;
    await deleteData(`libros_categorias/${id}`);
    setTrigger(!trigger);
  };

  return (
    <div className="section-card pt-24">
      <h2 className="section-title">🔗 Relacionar libros y categorías</h2>

      <select
        className="input mb-4"
        onChange={
          (e) => {
            abrirModal(Number(e.target.value))
          }
        }
      >
        <option value="">Selecciona un libro</option>
        {libros.map((l, i) => (
          <option key={i} value={l.id}>
            {l.titulo}
          </option>
        ))}
      </select>

      {/* TABLA */}
      <div className="mt-6 overflow-x-auto">
        <AnimatePresence>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Libro</th>
                <th className="p-2 border">Categorías</th>
              </tr>
            </thead>
            <tbody>
              {relaciones.map((rel, i)=>{

                return (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td className="p-2 border font-semibold">
                      {rel.libro}
                    </td>
                    <td className="p-2 border">
                      <div className="flex flex-wrap gap-2">
                        {rel.categoria.map((cat,idx) => {
                          // const categoria = categorias.find(
                          //   (c) => c.id === rel.categoria_id[idx]
                          // );
                          // if (!categoria) return null;
  
                          return (
                            <span
                              key={idx}
                              className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs"
                            >
                              {cat}
                              <button
                                onClick={() => eliminarRelacion(rel.libro_id,rel.categoria_id[idx])}
                                className="text-red-600 hover:text-red-800 font-bold"
                                title="Eliminar relación"
                              >
                                ✖
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}

            </tbody>
          </table>
        </AnimatePresence>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="font-bold mb-4">Selecciona categorías</h3>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {categorias.map((c) => {
                  const activa = seleccionadas.includes(c.id);
                  const bloqueada = existentes.includes(c.id);

                  return (
                    <button
                      key={c.id}
                      disabled={bloqueada}
                      onClick={() => toggleCategoria(c.id)}
                      className={`py-1 px-2 rounded text-sm font-medium transition
                             ${
                               bloqueada
                                 ? "bg-indigo-800 text-white cursor-not-allowed opacity-90"
                                 : activa
                                 ? "bg-indigo-600 text-white"
                                 : "bg-gray-100 hover:bg-gray-200"
                             }`}
                    >
                      {c.nombre}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                className={BTN}
                onClick={crearRelaciones}
                >
                  Guardar
                </button>
                <button
                  className="border rounded-lg px-4 py-2 w-full"
                  onClick={() => setModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
