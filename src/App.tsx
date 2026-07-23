import { Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataContext";

import Biblioteca from "./pages/Biblioteca";
import CrearLibroConCategoria from "./pages/CrearLibroConCategoria";
import ConsultasBiblioteca from "./pages/ConsultasBiblioteca";
import Navbar from "./components/Navbar";
import Restaurar from "./pages/Restaurar";
import Eliminar from "./pages/Eliminar";

export default function App() {
  return (
    <DataProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Biblioteca />} />
        <Route path="/crear-relacion" element={<CrearLibroConCategoria />} />
        <Route path="/consultas" element={<ConsultasBiblioteca />} />
        <Route path="/restaurar" element={<Restaurar/>}/>
        <Route path="/eliminar" element={<Eliminar/>}/>
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DataProvider>
  );
}
