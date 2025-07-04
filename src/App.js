import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./components/AppContext";
import Login from "./components/Login";
import InicioCursos from "./components/pages/InicioCursos";
import PrivateLayout from "./components/PrivateLayout";
import Clases from "./components/pages/Clases";
import Examenes from "./components/pages/Examenes";
import Contenido from "./components/pages/Contenido";
import SeleccionarCurso from "./components/pages/SeleccionarCurso";
import Results from "./components/pages/Results";
import CrearExamen from "./components/pages/CrearExamen";
import SummaryExamen from "./components/pages/SummaryExamen";
import EditExamen from "./components/pages/EditExamen";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateLayout />}>
            <Route path="/seleccionar-curso" element={<SeleccionarCurso />} />
            <Route path="/cursos" element={<InicioCursos />} />
            <Route path="/clases" element={<Clases />} />
            <Route path="/examenes" element={<Examenes />} />
            <Route path="/contenido" element={<Contenido />} />
            <Route path="/resultados" element={<Results />} />
            <Route path="/crear-examen" element={<CrearExamen />} />
            <Route path="/summary-exam" element={<SummaryExamen />} />
            <Route path="/editar-examen" element={<EditExamen />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
