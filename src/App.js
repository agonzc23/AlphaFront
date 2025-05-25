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
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
