import React, { useState, useEffect, useContext } from "react";
import ExamenReal from "./ExamenReal";
import ConfirmAlert from "../elements/ConfirmAlert";
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";

export default function Examenes() {
    const { cursoId, user } = useContext(AppContext);
    const navigate = useNavigate();
    const [examenes, setExamenes] = useState([]);
    const [examenActivo, setExamenActivo] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedExamen, setSelectedExamen] = useState(null);

    // Estado para eliminar examen
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [examenAEliminar, setExamenAEliminar] = useState(null);
    const [errorAlert, setErrorAlert] = useState({ show: false, message: "" });

    useEffect(() => {
        fetch("http://localhost:8081/exams", {
            method: "GET",
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => setExamenes(data || []));
    }, []);

    // Filtra los exámenes por el courseId del contexto y visibilidad
    const examenesFiltrados = examenes.filter(e => {
        const id = typeof e.courseId === "object" && e.courseId !== null ? e.courseId.id : e.courseId;
        // Si no es admin/profesor, solo muestra exámenes activos
        if (!(user?.role === "admin" || user?.role === "Profesor")) {
            return String(id) === String(cursoId) && !!e.active;
        }
        return String(id) === String(cursoId);
    });

    if (examenActivo) {
        const examen = examenes.find(e => e.id === examenActivo);
        return (
            <ExamenReal
                examenId={examenActivo}
                examenName={examen?.title}
                questions={examen?.questions || []}
                duration={examen?.duration}
                onFinish={() => setExamenActivo(null)}
            />
        );
    }

    const handleRealizarClick = (examenId) => {
        setSelectedExamen(examenId);
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        setExamenActivo(selectedExamen);
        setShowConfirm(false);
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setSelectedExamen(null);
    };

    // Eliminar examen
    const handleDeleteExamen = async () => {
        setShowDeleteConfirm(false);
        if (examenAEliminar) {
            try {
                const response = await fetch(`http://localhost:8081/exams/${examenAEliminar.id}`, {
                    method: "DELETE",
                    credentials: "include"
                });
                if (response.ok) {
                    setExamenes(examenes => examenes.filter(e => e.id !== examenAEliminar.id));
                } else {
                    setErrorAlert({ show: true, message: "Error al eliminar el examen" });
                }
            } catch (err) {
                setErrorAlert({ show: true, message: "Error al eliminar el examen" });
            }
        }
        setExamenAEliminar(null);
    };

    const handleToggleActive = async (examen) => {
        try {
            const response = await fetch(`http://localhost:8081/exams/${examen.id}/activate`, {
                method: "POST",
                credentials: "include"
            });
            if (response.ok) {
                setExamenes(examenes =>
                    examenes.map(e =>
                        e.id === examen.id ? { ...e, active: !e.active } : e
                    )
                );
            } else {
                setErrorAlert({ show: true, message: "Error al cambiar visibilidad del examen" });
            }
        } catch (err) {
            setErrorAlert({ show: true, message: "Error al cambiar visibilidad del examen" });
        }
    };

    return (
        <div style={{ fontFamily: "Poppins, sans-serif" }}>
            <h1>Examenes</h1>
            {(user?.role === "admin" || user?.role === "Profesor") && (
                <button
                    type="button"
                    className="btn btn-success mb-4"
                    style={{ backgroundColor: "#00abe4", borderColor: "#00abe4" }}
                    onClick={() => navigate("/crear-examen")}
                >
                    Cargar Examen
                </button>
            )}
            <div>
                {examenesFiltrados.map(examen => (
                    <div className="card mb-3" style={{ width: "40rem" }} key={examen.id}>
                        <div className="card-body">
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <h5 className="card-title mb-0">{examen.title}</h5>
                                {(user?.role === "admin" || user?.role === "Profesor") && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <input
                                            type="checkbox"
                                            checked={!!examen.active}
                                            onChange={() => handleToggleActive(examen)}
                                            data-toggle="toggle"
                                            style={{ width: 24, height: 24, accentColor: examen.active ? "#198754" : "#6c757d" }}
                                        />
                                        <span style={{
                                            fontWeight: "bold",
                                            color: examen.active ? "#198754" : "#6c757d",
                                            minWidth: 60,
                                            display: "inline-block"
                                        }}>
                                            {examen.active ? "VISIBLE" : "OCULTO"}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="card-text">{examen.description}</p>
                            <ul className="list-unstyled mb-0">
                                <li><strong>Duración:</strong> {examen.duration} minutos</li>
                                <li><strong>Número de preguntas:</strong> {examen.questions ? examen.questions.length : 0}</li>
                            </ul>
                            <div className="mt-3">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm me-2"
                                    style={{ width: "11rem", backgroundColor: "#00abe4", borderColor: "#00abe4" }}
                                    onClick={() => handleRealizarClick(examen.id)}
                                >
                                    REALIZAR EXAMEN
                                </button>
                                {(user?.role === "admin" || user?.role === "Profesor") && (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm me-2"
                                            style={{ width: "11rem", backgroundColor: "#FFA500", borderColor: "#FFA500" }}
                                        >
                                            EDITAR EXAMEN
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            style={{ width: "11rem" }}
                                            onClick={() => {
                                                setExamenAEliminar(examen);
                                                setShowDeleteConfirm(true);
                                            }}
                                        >
                                            ELIMINAR EXAMEN
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ConfirmAlert
                show={showConfirm}
                title="Confirmar"
                message="¿Seguro que quieres comenzar este examen?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
            <ConfirmAlert
                show={showDeleteConfirm}
                title="Eliminar examen"
                message="¿Seguro que quieres eliminar este examen?"
                onConfirm={handleDeleteExamen}
                onCancel={() => {
                    setShowDeleteConfirm(false);
                    setExamenAEliminar(null);
                }}
            />
            <ConfirmAlert
                show={errorAlert.show}
                title="Error"
                message={errorAlert.message}
                onConfirm={() => setErrorAlert({ show: false, message: "" })}
                onCancel={() => setErrorAlert({ show: false, message: "" })}
            />
        </div>
    );
}