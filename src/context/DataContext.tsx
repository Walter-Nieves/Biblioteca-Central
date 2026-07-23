import { createContext, useContext, useEffect, useState } from "react";
import { getData } from "../api/api";
import type { Autor, Libro, Categoria } from "../types";


// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData debe usarse dentro de DataProvider");
  }
  return ctx;
}


export type LibroCategoriaItem = {
  id: string; 
  libro: string;
  categoria: string;
};

interface DataContextType {
  autores: Autor[];
  libros: Libro[];
  categorias: Categoria[];
  refetchAutores: () => Promise<void>;
  refetchLibros: () => Promise<void>;
  refetchCategorias: () => Promise<void>;
   eliminarLibroCategoria: (id: string) => Promise<void>;
  restaurarLibroCategoria: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// helper genérico para eliminar duplicados por id
function dedupeById<T extends { id: number }>(data: T[]): T[] {
  return Array.from(new Map(data.map(item => [item.id, item])).values());
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const refetchAutores = async () => {
    const data = await getData<Autor[]>("autores");
    setAutores(dedupeById(data));
  };

  const refetchLibros = async () => {
    const data = await getData<Libro[]>("libros");
    setLibros(dedupeById(data));
  };

  const refetchCategorias = async () => {
    const data = await getData<Categoria[]>("categorias");
    setCategorias(dedupeById(data));
  };

   const eliminarLibroCategoria = async (id: string) => {
    await fetch(`/libros-categorias/${id}`, { method: "DELETE" });
  };

  const restaurarLibroCategoria = async (id: string) => {
    await fetch(`/libros-categorias/${id}/restore`, { method: "PATCH" });
  };

  useEffect(() => {
    void (async () => {
      await refetchAutores();
      await refetchLibros();
      await refetchCategorias();
      
       })();
  }, []);

  return (
    <DataContext.Provider
      value={{
        autores,
        libros,
        categorias,
        refetchAutores,
        refetchLibros,
        refetchCategorias,
        eliminarLibroCategoria,
        restaurarLibroCategoria 
      }}
    >
      {children}
    </DataContext.Provider>
  );
}


