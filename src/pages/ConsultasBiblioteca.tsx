import { useState } from "react";
import * as queries from "../services/queries";
import { useData } from "../context/DataContext";

import type {
  QueryResult,
  LibroPorAutor,
  AutorQuery,
  CategoriaQuery,
  CategoriasLibroResponse,
  CategoriasPorAutorResponse,
  AutoresPorCategoriaResponse,
  LibroDetalle,
} from "../types";

/* =========================
   TYPE GUARDS
========================= */

const isLibroDetalleArray = (r: unknown): r is LibroDetalle[] =>
  Array.isArray(r) &&
  r.length > 0 &&
  typeof r[0].titulo === "string" &&
  typeof r[0].autor === "string" &&
  Array.isArray(r[0].categorias);

const isLibroArray = (r: QueryResult): r is LibroPorAutor[] =>
  Array.isArray(r) && r.length > 0 && "titulo" in r[0];

const isAutor = (r: QueryResult): r is AutorQuery =>
  typeof r === "object" && r !== null && "apellido" in r;

const isCategoriaArray = (r: QueryResult): r is CategoriaQuery[] =>
  Array.isArray(r) && r.length > 0 && "nombre" in r[0];

const hasCategorias = (
  r: QueryResult
): r is CategoriasLibroResponse | CategoriasPorAutorResponse =>
  typeof r === "object" && r !== null && "categorias" in r;

const hasAutores = (r: QueryResult): r is AutoresPorCategoriaResponse =>
  typeof r === "object" && r !== null && "autores" in r;

const isCount = (r: QueryResult): r is Record<string, number> =>
  typeof r === "object" &&
  r !== null &&
  Object.values(r).every((v) => typeof v === "number");

const isError = (r: unknown): r is { error: string } =>
  typeof r === "object" &&
  r !== null &&
  "error" in r &&
  typeof (r as Record<string, unknown>).error === "string";

/* =========================
   COMPONENTE
========================= */

export default function ConsultasBiblioteca() {
  const { autores, libros, categorias } = useData();

  const [autorId, setAutorId] = useState<number | "">("");
  const [libroId, setLibroId] = useState<number | "">("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");

  const [resultado, setResultado] = useState<
    QueryResult | LibroDetalle[] | null
  >(null);

  const [loading, setLoading] = useState(false);

  const ejecutar = async (fn: () => Promise<QueryResult | LibroDetalle[]>) => {
    try {
      setLoading(true);
      setResultado(await fn());
    } catch (err) {
      setResultado({ error: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const BTN =
    "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition w-full";

  const renderResultado = () => {
    if (!resultado) return null;

    if (isLibroDetalleArray(resultado)) {
      return resultado.map((l,i) => (
        <div key={i} className="mb-4 border-b pb-2">
          <div className="font-semibold">📘 {l.titulo}</div>
          <div className="ml-4">✍️ {l.autor}</div>
          <div className="ml-4">🏷️ {l.categorias.join(", ")}</div>
        </div>
      ));
    }

    if (isError(resultado)) {
      return <p className="text-red-600">{resultado.error}</p>;
    }

    if (hasAutores(resultado)) {
      return resultado.autores.map((a,i) => (
        <div key={i}>✍️ {a.nombre} {a.apellido}</div>
      ));
    }

    if (isLibroArray(resultado)) {
      return resultado.map((l,i) => <div key={i}>📘 {l.titulo}</div>);
    }

    if (isAutor(resultado)) {
      return <div>✍️ {resultado.nombre} {resultado.apellido}</div>;
    }

    if (isCategoriaArray(resultado)) {
      return resultado.map((c,i) => <div key={i}>🏷️ {c.nombre}</div>);
    }

    if (hasCategorias(resultado)) {
      return resultado.categorias.map((c,i) => (
        <div key={i}>🏷️ {c.nombre}</div>
      ));
    }

    if (isCount(resultado)) {
      return (
        <p className="text-4xl font-bold text-center">
          {Object.values(resultado)[0]}
        </p>
      );
    }

    return <pre>{JSON.stringify(resultado, null, 2)}</pre>;
  };

  return (
    <div className="min-h-screen px-[6%] py-[4%] pt-24">
      <h1 className="text-3xl font-bold text-center mb-10">
        📚 Consultas de Biblioteca
      </h1>

      {/* SELECTS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <select className="input" value={autorId} onChange={(e) => setAutorId(Number(e.target.value) || "")}>
          <option value="" disabled hidden>Autor</option>
          {autores.map((a,i) => (
            <option key={i} value={a.id}>{a.nombre} {a.apellido}</option>
          ))}
        </select>

        <select className="input" value={libroId} onChange={(e) => setLibroId(Number(e.target.value) || "")}>
          <option value="" disabled hidden>Libro</option>
          {libros.map((l,i) => (
            <option key={i} value={l.id}>{l.titulo}</option>
          ))}
        </select>

        <select className="input" value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value) || "")}>
          <option value="" disabled hidden>Categoría</option>
          {categorias.map((c,i) => (
            <option key={i} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {/* BOTONES */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button className={BTN} onClick={() => ejecutar(() => queries.getLibrosDetalle())}>
          Libros con autor y categoría
        </button>

        <button className={BTN} onClick={() => autorId ? ejecutar(() => queries.getLibrosPorAutor(autorId)) : setResultado({ error: "Seleccione un autor" })}>
          Libros por autor
        </button>

        <button className={BTN} onClick={() => categoriaId ? ejecutar(() => queries.getLibrosPorCategoria(categoriaId)) : setResultado({ error: "Seleccione una categoría" })}>
          Libros por categoría
        </button>

        <button className={BTN} onClick={() => libroId ? ejecutar(() => queries.getAutorDeLibro(libroId)) : setResultado({ error: "Seleccione un libro" })}>
          Autor del libro
        </button>

        <button className={BTN} onClick={() => libroId ? ejecutar(() => queries.getCategoriasDeLibro(libroId)) : setResultado({ error: "Seleccione un libro" })}>
          Categorías del libro
        </button>

        <button className={BTN} onClick={() => autorId ? ejecutar(() => queries.getCategoriasDeAutor(autorId)) : setResultado({ error: "Seleccione un autor" })}>
          Categorías del autor
        </button>

        <button className={BTN} onClick={() => categoriaId ? ejecutar(() => queries.getAutoresPorCategoria(categoriaId)) : setResultado({ error: "Seleccione una categoría" })}>
          Autores por categoría
        </button>

        <button className={BTN} onClick={() => autorId ? ejecutar(() => queries.contarLibrosPorAutor(autorId)) : setResultado({ error: "Seleccione un autor" })}>
          Cantidad de libros por autor
        </button>

        <button className={BTN} onClick={() => categoriaId ? ejecutar(() => queries.contarLibrosPorCategoria(categoriaId)) : setResultado({ error: "Seleccione una categoría" })}>
          Cantidad de libros por categoría
        </button>

        <button className={BTN} onClick={() => categoriaId ? ejecutar(() => queries.contarAutoresPorCategoria(categoriaId)) : setResultado({ error: "Seleccione una categoría" })}>
          Cantidad de autores por categoría
        </button>
      </div>

      {/* RESULTADO */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        {loading ? "⏳ Cargando..." : renderResultado()}
      </div>
    </div>
  );
}
