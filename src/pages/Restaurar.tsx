import { useEffect, useState } from "react";
import { getData, patchData } from "../api/api"; 
import { useData } from "../context/DataContext"; 

type SimpleItem = {
  id: number;
  nombre?: string;
  apellido?: string;
  titulo?: string;
};
type LibroCategoriaItem = { id: number; libro: string; categoria: string };

const BTN =
  "bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-sm transition";

export default function Restaurar() {
  const [autores, setAutores] = useState<SimpleItem[]>([]);
  const [categorias, setCategorias] = useState<SimpleItem[]>([]);
  const [libros, setLibros] = useState<SimpleItem[]>([]);
  const [relaciones, setRelaciones] = useState<LibroCategoriaItem[]>([]);
  const [trigger, setTrigger] = useState<boolean>(false);

  useEffect(() => {
    const cargarTodo = async () => {
      setAutores(await getData("autores/eliminados"));
      setCategorias(await getData("categorias/eliminados"));
      setLibros(await getData("libros/eliminados"));
      setRelaciones(await getData("libros_categorias/eliminados"));
    };
    cargarTodo();
  }, [trigger]);

  const { refetchAutores, refetchLibros, refetchCategorias } = useData();

  const restaurar = async (ruta: string, id: number) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas restaurar este elemento?"
    );
    if (!confirmar) return;

    await patchData(`${ruta}/${id}/restore`, {});

    // refresca eliminados
    setTrigger((prev) => !prev);

    // 🔥 sincroniza TODO el contexto
    await Promise.all([refetchAutores(), refetchLibros(), refetchCategorias()]);
  };

  return (
    <div className="min-h-screen bg-stone-100 px-[5%] py-[3%] pt-24">
      <header className="mb-10 text-center">
        <h1 className="text-[2.2rem] font-bold text-stone-800">
          ♻️ Restaurar elementos eliminados
        </h1>
        <p className="text-stone-600 mt-2">
          Panel de recuperación (soft delete)
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* AUTORES */}
        <Columna
          titulo="Autores"
          items={autores}
          render={(a) => `${a.nombre} ${a.apellido}`}
          onRestore={(id) => restaurar("autores", id)}
        />

        {/* CATEGORÍAS */}
        <Columna
          titulo="Categorías"
          items={categorias}
          render={(c) => c.nombre}
          onRestore={(id) => restaurar("categorias", id)}
        />

        {/* LIBROS */}
        <Columna
          titulo="Libros"
          items={libros}
          render={(l) => l.titulo}
          onRestore={(id) => restaurar("libros", id)}
        />

        {/* LIBRO - CATEGORÍA */}
        <div className="section-card">
          <h2 className="section-title">Libro - Categoría</h2>
          <ul className="space-y-2">
            {relaciones.map((r, i) => (
              <li key={i} className="flex justify-between items-center text-sm">
                <span>
                  <strong>{r.libro}</strong> → {r.categoria}
                </span>
                <button
                  className={BTN}
                  onClick={() => restaurar("libros_categorias", r.id)}
                >
                  Restaurar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

/* =====================
   COLUMNA REUTILIZABLE
===================== */
function Columna({
  titulo,
  items,
  render,
  onRestore,
}: {
  titulo: string;
  items: SimpleItem[];
  render: (i: SimpleItem) => string | undefined;
  onRestore: (id: number) => void;
}) {
  return (
    <div className="section-card">
      <h2 className="section-title">{titulo}</h2>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.id} className="flex justify-between items-center text-sm">
            <span>{render(i)}</span>
            <button className={BTN} onClick={() => onRestore(i.id)}>
              Restaurar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
