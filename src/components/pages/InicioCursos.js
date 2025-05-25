import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";

export default function InicioCursos() {
    const [cursoInfo, setCursoInfo] = useState(null);
    const { curso, setCurso } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!curso) {
            navigate("/seleccionar-curso");
            return;
        }
        fetch("dummyData/cursos.json")
            .then(response => response.json())
            .then(data => {
                // Busca el curso por id o name según tu estructura
                const found = data.find(c => c.id === curso.id);
                setCursoInfo(found);
            });
    }, [curso, navigate]);

    const handleSalir = () => {
        setCurso(null);
        navigate("/seleccionar-curso");
    };

    if (!cursoInfo) {
        return null; // O un loader/spinner si prefieres
    }

    return (
        <div style={{ fontFamily: "Poppins, sans-serif" }}>
            <div>
                <h1>{cursoInfo.name}</h1>
                <p>{cursoInfo.desc}</p>
            </div>
            <div className="card mb-3" style={{ width: "11rem" }}>
                {/* Aquí puedes mostrar más info del curso si tienes */}
                <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleSalir}
                    style={{ width: "11rem" }}
                >
                    SALIR DEL CURSO
                </button>
            </div>
        </div>
    );
}