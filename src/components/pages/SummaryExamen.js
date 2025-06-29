import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../AppContext";

export default function SummaryExamen() {
    const location = useLocation();
    const examen = location.state?.examen;
    const { curso } = useContext(AppContext); // <-- Añade esto

    // Paginación
    const [pagina, setPagina] = useState(1);
    const preguntasPorPagina = 10;

    // Estado para edición
    const [editandoId, setEditandoId] = useState(null);
    const [preguntasEditadas, setPreguntasEditadas] = useState(
        examen?.questions ? JSON.parse(JSON.stringify(examen.questions)) : []
    );
    const [confirmando, setConfirmando] = useState(false);

    if (!examen) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">No hay datos de examen para mostrar.</div>
            </div>
        );
    }

    const totalPaginas = Math.ceil((preguntasEditadas.length || 0) / preguntasPorPagina);
    const preguntasMostradas = preguntasEditadas.slice(
        (pagina - 1) * preguntasPorPagina,
        pagina * preguntasPorPagina
    ) || [];

    // Guardar cambios de pregunta
    const handlePreguntaChange = (idx, value) => {
        const nuevas = [...preguntasEditadas];
        nuevas[idx].questionText = value;
        setPreguntasEditadas(nuevas);
    };

    // Guardar cambios de respuesta
    const handleRespuestaChange = (pregIdx, respIdx, value) => {
        const nuevas = [...preguntasEditadas];
        nuevas[pregIdx].answers[respIdx].answerText = value;
        setPreguntasEditadas(nuevas);
    };

    // Cambiar respuesta correcta
    const handleRespuestaCorrecta = (pregIdx, respIdx) => {
        const nuevas = [...preguntasEditadas];
        nuevas[pregIdx].answers = nuevas[pregIdx].answers.map((ans, i) => ({
            ...ans,
            correct: i === respIdx
        }));
        setPreguntasEditadas(nuevas);
    };

    // Guardar edición
    const handleGuardar = () => {
        setEditandoId(null);
    };

    // Función para comparar preguntas y respuestas
    function preguntasSonIguales(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i].questionText !== b[i].questionText) return false;
            if (a[i].answers.length !== b[i].answers.length) return false;
            for (let j = 0; j < a[i].answers.length; j++) {
                if (
                    a[i].answers[j].answerText !== b[i].answers[j].answerText ||
                    a[i].answers[j].correct !== b[i].answers[j].correct
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    // Confirmar creación del examen
    const handleConfirmar = async () => {
        if (confirmando) return;
        setConfirmando(true);

        const seHaModificado = !preguntasSonIguales(examen.questions || [], preguntasEditadas);

        let continuar = true;
        if (seHaModificado) {
            continuar = window.confirm(
                "Se han modificado preguntas o respuestas. ¿Deseas confirmar la creación del examen con los cambios?"
            );
        } else {
            continuar = window.confirm(
                "¿Deseas confirmar la creación del examen?"
            );
        }

        if (!continuar) {
            setConfirmando(false);
            return;
        }

        // --- Generar el JSON limpio según tu modelo DTO ---
        const preguntasLimpias = preguntasEditadas.map(q => ({
            questionText: q.questionText,
            orderQuestion: q.orderQuestion,
            type: q.type,
            answers: q.answers.map(a => ({
                answerText: a.answerText,
                orderAnswer: a.orderAnswer,
                correct: a.correct
            }))
        }));

        const examDto = {
            title: examen.title,
            description: examen.description,
            duration: examen.duration,
            createdAt: examen.createdAt,
            questions: preguntasLimpias,
            courseName: curso?.name || "", // <-- Usa el nombre del header (AppContext)
            userCreatedId: examen.userCreatedId?.id || examen.userCreatedId
        };

        try {
            if (seHaModificado) {
                // Primero elimina el examen original
                await fetch(`http://localhost:8081/exams/${examen.id}`, {
                    method: "DELETE",
                    credentials: "include"
                });
            }
            // Luego sube el examen (modificado o no)
            const response = await fetch("http://localhost:8081/exams/upload-json", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(examDto),
                credentials: "include"
            });
            if (!response.ok) {
                let errorMsg = `Error al subir el examen (HTTP ${response.status})`;
                try {
                    const errorData = await response.json();
                    errorMsg += "\n" + errorData;
                } catch {
                    try {
                        const text = await response.text();
                        errorMsg += "\n" + (text || "");
                    } catch {}
                }
                throw new Error(errorMsg);
            }
            alert("Examen confirmado correctamente.");
        } catch (err) {
            alert("Error al confirmar el examen: " + (err.message || err));
        } finally {
            setConfirmando(false);
        }
    };

    return (
        <div className="container mt-4" style={{ fontFamily: "Poppins, sans-serif", maxWidth: 900 }}>
            <h2 className="mb-3">Resumen del Examen</h2>
            <div className="card mb-4">
                <div className="card-body">
                    <h4 className="card-title">{examen.title}</h4>
                    <p className="card-text">{examen.description}</p>
                    <ul className="list-unstyled mb-0">
                        <li><strong>Duración:</strong> {examen.duration} minutos</li>
                        <li><strong>Número total de preguntas:</strong> {preguntasEditadas.length}</li>
                    </ul>
                    <button className="btn btn-success mt-3" onClick={handleConfirmar} disabled={confirmando}>
                        Confirmar
                    </button>
                </div>
            </div>

            <h5>Preguntas</h5>
            {preguntasMostradas.map((pregunta, idx) => {
                const globalIdx = (pagina - 1) * preguntasPorPagina + idx;
                const editando = editandoId === pregunta.id;
                return (
                    <div className="card mb-3" key={pregunta.id}>
                        <div className="card-body">
                            <strong>Pregunta {globalIdx + 1}:</strong>{" "}
                            {editando ? (
                                <input
                                    className="form-control mb-2"
                                    value={pregunta.questionText}
                                    onChange={e => handlePreguntaChange(globalIdx, e.target.value)}
                                />
                            ) : (
                                pregunta.questionText
                            )}
                            <ul className="mt-2">
                                {pregunta.answers.map((respuesta, rIdx) => (
                                    <li key={rIdx} className="mb-1">
                                        {editando ? (
                                            <div className="d-flex align-items-center gap-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    style={{ maxWidth: 350 }}
                                                    value={respuesta.answerText}
                                                    onChange={e => handleRespuestaChange(globalIdx, rIdx, e.target.value)}
                                                />
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={respuesta.correct}
                                                    onChange={() => handleRespuestaCorrecta(globalIdx, rIdx)}
                                                    style={{ marginLeft: 8, marginRight: 4 }}
                                                />
                                                <span style={{ fontSize: 14 }}>Correcta</span>
                                            </div>
                                        ) : (
                                            <span style={respuesta.correct ? { color: "#00abe4", fontWeight: "bold" } : {}}>
                                                {respuesta.orderAnswer}) {respuesta.answerText}
                                                {respuesta.correct && " ✔"}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {editando ? (
                                <button className="btn btn-primary btn-sm mt-2" onClick={handleGuardar}>
                                    Guardar
                                </button>
                            ) : (
                                <button className="btn btn-secondary btn-sm mt-2" onClick={() => setEditandoId(pregunta.id)}>
                                    Editar
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Paginación */}
            {totalPaginas > 1 && (
                <nav>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: "4px",
                            maxWidth: 600,
                            margin: "0 auto"
                        }}
                    >
                        <ul className="pagination flex-wrap justify-content-center" style={{ flexWrap: "wrap" }}>
                            <li className={`page-item${pagina === 1 ? " disabled" : ""}`}>
                                <button className="page-link" onClick={() => setPagina(pagina - 1)} disabled={pagina === 1}>
                                    Anterior
                                </button>
                            </li>
                            {Array.from({ length: totalPaginas }, (_, i) => (
                                <li key={i} className={`page-item${pagina === i + 1 ? " active" : ""}`}>
                                    <button className="page-link" onClick={() => setPagina(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item${pagina === totalPaginas ? " disabled" : ""}`}>
                                <button className="page-link" onClick={() => setPagina(pagina + 1)} disabled={pagina === totalPaginas}>
                                    Siguiente
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
            )}
        </div>
    );
}