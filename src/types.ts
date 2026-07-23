

// ========================
// ENTIDADES BASE
// ========================

export interface Autor {
  id: number;
  nombre: string;
  apellido: string;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Libro {
  id: number;
  titulo: string;
  autor_nombre: string;
  autor_apellido: string;
  categoria: string;
}

// ========================
// CONSULTAS (QUERY)
// ========================

export interface AutorQuery {
  id: number;
  nombre: string;
  apellido: string;
}

export interface CategoriaQuery {
  id: number;
  nombre: string;
}

export interface LibroPorAutor {
  id: number;
  titulo: string;
  autor_nombre: string;
  autor_apellido: string;
  categorias: string | null;
}

// ========================
// RESPUESTAS AGRUPADAS
// ========================

export interface CategoriasLibroResponse {
  libro_id: number;
  total_categorias: number;
  categorias: CategoriaQuery[];
}

export interface CategoriasPorAutorResponse {
  autor_id: number;
  total_categorias: number;
  categorias: CategoriaQuery[];
}

export interface AutoresPorCategoriaResponse {
  categoria_id: number;
  total_autores: number;
  autores: AutorQuery[];
}

export interface ErrorResponse {
  error: string;
}

export type CountResponse = {
  [key: string]: number;
};

// ✅ QueryResult REAL (clave de todo)
export type QueryResult =
  | AutorQuery
  | AutorQuery[]
  | CategoriaQuery[]
  | LibroPorAutor[]
  | CategoriasLibroResponse
  | CategoriasPorAutorResponse
  | AutoresPorCategoriaResponse
  | CountResponse
  | ErrorResponse;


export interface LibroDetalleRow {
  id: number;
  titulo: string;
  autor_nombre: string;
  autor_apellido: string;
  categorias: string | null; // 👈 viene como STRING
}

// ========================
// MODELO PARA EL FRONTEND
// ========================

export interface LibroDetalle {
  id: number;
  titulo: string;
  autor: string;
  categorias: string[];
}




