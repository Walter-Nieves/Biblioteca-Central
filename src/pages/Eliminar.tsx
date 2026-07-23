import { useEffect, useState } from "react";
import { getData, deleteData } from "../api/api";
import { useData } from "../context/DataContext"; 

type SimpleItem = {
  id: number;
  nombre?: string;
  apellido?: string;
  titulo?: string;
};
                                                                                                                                                                                                                                                                                
type LibroCategoriaItem = {
  id: number;
  libro: string;
  categoria: string;
};

const BTN =
  "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition";

export default function Eliminar() {
  const [autores, setAutores] = useState<SimpleItem[]>([]);
  const [categorias, setCategorias] = useState<SimpleItem[]>([]);
  const [libros, setLibros] = useState<SimpleItem[]>([]);
  const [relaciones, setRelaciones] = useState<LibroCategoriaItem[]>([]);
  const [trigger, setTrigger] = useState(false);

  const { refetchAutores, refetchLibros, refetchCategorias } = useData();

  useEffect(() => {
    const cargar = async () => {
      setAutores(await getData("autores/eliminados"));
      setCategorias(await getData("categorias/eliminados"));
      setLibros(await getData("libros/eliminados"));
      setRelaciones(await getData("libros_categorias/eliminados"));
    };
    cargar();
  }, [trigger]);

  const eliminar = async (ruta: string, id: number) => {
    const confirmar = window.confirm(
      "⚠️ Esta acción es PERMANENTE.\n¿Deseas eliminar definitivamente?"
    );
    if (!confirmar) return;

    await deleteData(`${ruta}/${id}/hard`);

    setTrigger((p) => !p);
    await Promise.all([refetchAutores(), refetchLibros(), refetchCategorias()]);
  };

  return (
    <div className="min-h-screen bg-stone-100 px-[5%] py-[3%] pt-24">
      <header className="mb-10 text-center">
        <h1 className="text-[2.2rem] font-bold text-stone-800">
          🗑️ Eliminación definitiva
        </h1>
        <p className="text-stone-600 mt-2">
          Hard delete (no se puede deshacer)
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Columna
          titulo="Autores"
          items={autores}
          render={(a) => `${a.nombre} ${a.apellido}`}
          onDelete={(id) => eliminar("autores", id)}
        />

        <Columna
          titulo="Categorías"
          items={categorias}
          render={(c) => c.nombre}
          onDelete={(id) => eliminar("categorias", id)}
        />

        <Columna
          titulo="Libros"
          items={libros}
          render={(l) => l.titulo}
          onDelete={(id) => eliminar("libros", id)}
        />

        <div className="section-card">
          <h2 className="section-title">Libro - Categoría</h2>
          <ul className="space-y-2">
            {relaciones.map((r) => (
              <li key={r.id} className="flex justify-between items-center text-sm">
                <span>
                  <strong>{r.libro}</strong> → {r.categoria}
                </span>
                <button
                  className={BTN}
                  onClick={() => eliminar("libros_categorias", r.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Columna({
  titulo,
  items,
  render,
  onDelete,
}: {
  titulo: string;
  items: SimpleItem[];
  render: (i: SimpleItem) => string | undefined;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="section-card">
      <h2 className="section-title">{titulo}</h2>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.id} className="flex justify-between items-center text-sm">
            <span>{render(i)}</span>
            <button className={BTN} onClick={() => onDelete(i.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}