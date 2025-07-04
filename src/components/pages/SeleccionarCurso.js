import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import CustomButton from "../elements/CustomButton";

export default function SeleccionarCurso() {
    const [cursos, setCursos] = useState([]);
    const { curso, setCurso } = useContext(AppContext);
    const { setCursoId } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8081/courses", { credentials: "include" })
            .then(response => response.json())
            .then(data => setCursos(data));
    }, []);

    // Si hay un curso seleccionado, lo elimina automáticamente al entrar
    useEffect(() => {
        if (curso) {
            setCurso(null);
        }
        // eslint-disable-next-line
    }, []);

    const handleSeleccion = (curso, id) => {
        setCurso(curso);
        setCursoId(id);
        navigate("/cursos");
    };

    return (
        <div style={{ fontFamily: "Poppins, sans-serif" }}>
            <div>
                <h1>Selecciona un bloque</h1>
                <p>Elige el bloque al que quieres acceder</p>
            </div>
            <div>
                {cursos.map((curso) => (
                    <div className="card mb-3" style={{ width: "40rem" }} key={curso.id}>
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="card-title">{curso.name}</h5>
                                <p className="card-text">{curso.description}</p>
                            </div>
                            <CustomButton
                                type="button"
                                className="btn-sm"
                                variant="custom-alpha"
                                onClick={() => handleSeleccion(curso, curso.id)}
                            >
                                Seleccionar
                            </CustomButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}