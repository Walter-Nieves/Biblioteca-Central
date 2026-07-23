import Autores from "./Autores";
import Categorias from "./Categorias";
import Libros from "./Libros";

export default function Biblioteca() {
  return (
    <div className="min-h-screen bg-stone-100 px-[5%] py-[3%] pt-24">
      
      {/* HEADER */}
      <header className="mb-10 text-center">
        <h1 className="text-[2.5rem] font-bold text-stone-800">
          📚 Biblioteca Central
        </h1>
        <p className="text-[1.1rem] text-stone-600 mt-2">
          Gestión de autores, categorías y libros
        </p>
      </header>

      {/* CONTENIDO */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-[3%]">
        <Autores />
        <Categorias />
        <Libros />
      </section>
    </div>
  );
}
