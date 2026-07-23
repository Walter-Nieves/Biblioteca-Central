
export async function getLibrosPorAutor(autorId: number) {
  const res = await fetch(
    `http://localhost:3000/api/queries/libros/autor/${autorId}`
  );

  if (!res.ok) {
    throw new Error("Error al obtener libros por autor");
  }

  return res.json();
}
