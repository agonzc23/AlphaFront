import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import CustomButton from "../elements/CustomButton";

export default function InicioCursos() {
    const [cursoInfo, setCursoInfo] = useState(null);
    const [hovered, setHovered] = useState(null);
    const { curso, setCurso } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!curso) {
            navigate("/seleccionar-curso");
            return;
        }
        fetch("http://localhost:8081/courses", { credentials: "include" })
            .then(response => response.json())
            .then(data => {
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

    // Paneles de acceso rápido
    const panels = [
        {
             label: "Contenidos",
             icon: "bi-book",
             path: "/contenido",
        },
        // {
        //     label: "Clases",
        //     icon: "bi-camera-reels",
        //     path: "/clases",
        //     disabled: true
        // },
        {
            label: "Exámenes",
            icon: "bi-check-square",
            path: "/examenes"
        },
        {
            label: "Resultados",
            icon: "bi-graph-up",
            path: "/resultados"
        }
    ];

    return (
        <div style={{ fontFamily: "Poppins, sans-serif" }}>
            <div>
                <h1>{cursoInfo.name}</h1>
                <p>{cursoInfo.description}</p>
            </div>
            <div className="row mb-4">
                {panels.map((panel, idx) => (
                    <div className="col-12 col-md-6 col-lg-4 mb-3" key={panel.label}>
                        <div
                            className={`card h-100 shadow-sm text-center transition ${panel.disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                            style={{
                                minHeight: 120,
                                maxWidth: 390,
                                cursor: panel.disabled ? "not-allowed" : "pointer",
                                transition: "transform 0.2s, background 0.2s",
                                transform: hovered === idx ? "scale(1.06)" : "scale(1)",
                                background: hovered === idx ? "#e6f4fb" : "#fff" // azul claro muy suave al hacer hover
                            }}
                            onMouseEnter={() => setHovered(idx)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => !panel.disabled && navigate(panel.path)}
                        >
                            <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                <i className={`bi ${panel.icon} mb-2`} style={{ fontSize: 32, color: "#00abe4" }}></i>
                                <span style={{ fontSize: 18 }}>{panel.label}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="card mb-3" style={{ width: "11rem" }}>
                <CustomButton
                    type="button"
                    className="btn-sm"
                    variant="custom-danger"
                    onClick={handleSalir}
                    style={{ width: "11rem" }}
                >
                    SALIR DEL BLOQUE
                </CustomButton>
            </div>
        </div>
    );
}