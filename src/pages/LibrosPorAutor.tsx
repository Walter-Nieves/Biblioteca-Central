import { useEffect, useState } from "react";
import { getLibrosPorAutor } from "../services/Libros";

interface Libro {
  id: number;
  titulo: string;
  autor_nombre: string;
  autor_apellido: string;
  categorias: string | null;
}

export default function LibrosPorAutor({ autorId }: { autorId: number }) {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLibrosPorAutor(autorId)
      .then(setLibros)
      .finally(() => setLoading(false));
  }, [autorId]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Libros del autor</h2>

      {libros.length === 0 && <p>No hay libros</p>}

      <ul>
        {libros.map(libro => (
          <li key={libro.id}>
            <strong>{libro.titulo}</strong>
            <br />
            Categorías: {libro.categorias ?? "Sin categoría"}
          </li>
        ))}
      </ul>
    </div>
  );
}
