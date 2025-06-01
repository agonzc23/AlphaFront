import React, { useState, useEffect, useContext } from "react";
import ExamenReal from "./ExamenReal";
import ConfirmAlert from "../elements/ConfirmAlert";
import { AppContext } from "../AppContext"; // Ajusta la ruta si es necesario

export default function Examenes() {
    const { cursoId } = useContext(AppContext); // courseId desde el contexto
    const [examenes, setExamenes] = useState([]);
    const [examenActivo, setExamenActivo] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedExamen, setSelectedExamen] = useState(null);

    useEffect(() => {
        fetch("/dummyData/realExams.json")
            .then(res => res.json())
            .then(data => setExamenes(data || []));
    }, []);

    // Filtra los exámenes por el courseId del contexto
    const examenesFiltrados = examenes.filter(e => e.courseId === cursoId);

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

    return (
        <div style={{ fontFamily: "Poppins, sans-serif" }}>
            <h1>Examenes</h1>
            <div>
                {examenesFiltrados.map(examen => (
                    <div className="card mb-3" style={{ width: "40rem" }} key={examen.id}>
                        <div className="card-body">
                            <h5 className="card-title">{examen.title}</h5>
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
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    style={{ width: "11rem", backgroundColor: "#FFA500", borderColor: "#FFA500" }}
                                >
                                    EDITAR EXAMEN
                                </button>
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
        </div>
    );
}