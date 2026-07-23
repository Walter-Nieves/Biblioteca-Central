
import { getData } from "../api/api";
import type { LibroDetalle, LibroDetalleRow, QueryResult } from "../types";


/* ======================
   CONSULTAS GENERALES
====================== */

export const getLibrosDetalle = async (): Promise<LibroDetalle[]> => {
  const data = await getData<LibroDetalleRow[]>("queries/libros-detalle");

  return data.map((row) => ({
    id: row.id,
    titulo: row.titulo,
    autor: `${row.autor_nombre} ${row.autor_apellido}`,
    categorias: row.categorias
      ? row.categorias.split(",").map((c) => c.trim())
      : [],
  }));
};

/* ======================
   AUTOR
====================== */

export const getLibrosPorAutor = (autorId: number): Promise<QueryResult> =>
  getData<QueryResult>(`queries/libros/autor/${autorId}`);

export const getCategoriasDeAutor = (autorId: number): Promise<QueryResult> =>
  getData<QueryResult>(`queries/autores/${autorId}/categorias`);

export const contarLibrosPorAutor = (autorId: number): Promise<QueryResult> =>
  getData<QueryResult>(`queries/autores/${autorId}/libros/count`);

/* ======================
   LIBRO
====================== */

export const getAutorDeLibro = (libroId: number): Promise<QueryResult> =>
  getData<QueryResult>(`queries/libros/${libroId}/autor`);

export const getCategoriasDeLibro = (libroId: number): Promise<QueryResult> =>
  getData<QueryResult>(`queries/libros/${libroId}/categorias`);

/* ======================
   CATEGORÍA
====================== */

export const getLibrosPorCategoria = (categoriaId: number): Promise<QueryResult> =>
  getData<QueryResult>(`queries/libros/categoria/${categoriaId}`);

export const getAutoresPorCategoria = (categoriaId: number): Promise<QueryResult> =>
  getData<QueryResult>(`queries/categorias/${categoriaId}/autores`);

export const contarLibrosPorCategoria = (categoriaId: number): Promise<QueryResult> =>
  getData<QueryResult>(`queries/categorias/${categoriaId}/libros/count`);

export const contarAutoresPorCategoria = (categoriaId: number): Promise<QueryResult> =>
  getData<QueryResult>(`queries/categorias/${categoriaId}/autores/count`);
