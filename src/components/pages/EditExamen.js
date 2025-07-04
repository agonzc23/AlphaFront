import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import ConfirmAlert from "../elements/ConfirmAlert";
import CustomButton from "../elements/CustomButton";

export default function EditExamen() {
    const location = useLocation();
    const examen = location.state?.examen;
    const { curso } = useContext(AppContext);
    const navigate = useNavigate();

    // Paginación
    const [pagina, setPagina] = useState(1);
    const preguntasPorPagina = 10;

    // Estado para edición
    const [editandoId, setEditandoId] = useState(null);
    const [preguntasEditadas, setPreguntasEditadas] = useState(
        examen?.questions ? JSON.parse(JSON.stringify(examen.questions)) : []
    );
    const [confirmando, setConfirmando] = useState(false);
    const [loading, setLoading] = useState(false);

    // Estado para ConfirmAlert
    const [alertConfig, setAlertConfig] = useState({
        show: false,
        title: "",
        message: "",
        onConfirm: null,
        onCancel: null
    });

    // Estado para mostrar resultado final
    const [finalAlert, setFinalAlert] = useState({
        show: false,
        title: "",
        message: ""
    });

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

    // Confirmar edición del examen
    const handleConfirmar = async () => {
        if (confirmando) return;
        setConfirmando(true);

        const seHaModificado = !preguntasSonIguales(examen.questions || [], preguntasEditadas);

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
            courseId:
                examen.courseId && typeof examen.courseId === "object"
                    ? examen.courseId.id
                    : examen.courseId ?? null,
            courseName: curso?.name || "",
            userCreatedId: examen.userCreatedId?.id || examen.userCreatedId
        };

        // Mostrar confirmación antes de enviar
        setAlertConfig({
            show: true,
            title: "Confirmar edición",
            message: seHaModificado
                ? "Se han modificado preguntas o respuestas. ¿Deseas guardar los cambios en el examen?"
                : "¿Deseas guardar el examen sin cambios?",
            onConfirm: async () => {
                setAlertConfig(a => ({ ...a, show: false }));
                if (!seHaModificado) {
                    navigate("/examenes");
                    setConfirmando(false);
                    return;
                }
                try {
                    setLoading(true);
                    await fetch(`http://localhost:8081/exams/${examen.id}`, {
                        method: "DELETE",
                        credentials: "include"
                    });
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
                            errorMsg += "\n" + (errorData.message || JSON.stringify(errorData, null, 2));
                        } catch {
                            try {
                                const text = await response.text();
                                errorMsg += "\n" + (text || "");
                            } catch {}
                        }
                        setFinalAlert({
                            show: true,
                            title: "Error",
                            message: errorMsg
                        });
                        throw new Error(errorMsg);
                    }
                    navigate("/examenes");
                } catch (err) {
                    setFinalAlert({
                        show: true,
                        title: "Error",
                        message: "Error al editar el examen: " + (err.message || err)
                    });
                } finally {
                    setLoading(false);
                    setConfirmando(false);
                }
            },
            onCancel: () => {
                setAlertConfig(a => ({ ...a, show: false }));
                setConfirmando(false);
            }
        });
    };

    return (
        <div className="container mt-4" style={{ fontFamily: "Poppins, sans-serif", maxWidth: 900 }}>
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(255,255,255,0.7)",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <i className="bi bi-gear-fill spin" style={{ fontSize: 80, color: "#00abe4" }}></i>
                </div>
            )}
            <style>
                {`
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
            <h2 className="mb-3">Editar Examen</h2>
            <div className="card mb-4">
                <div className="card-body">
                    <h4 className="card-title">{examen.title}</h4>
                    <p className="card-text">{examen.description}</p>
                    <ul className="list-unstyled mb-0">
                        <li><strong>Duración:</strong> {examen.duration} minutos</li>
                        <li><strong>Número total de preguntas:</strong> {preguntasEditadas.length}</li>
                    </ul>
                    <CustomButton
                        className="ml-2 mt-2"
                        variant="custom-alpha"
                        onClick={handleConfirmar}
                        disabled={confirmando}
                    >
                        Guardar Cambios
                    </CustomButton>
                    <CustomButton
                        type="button"
                        className="mx-2 mt-2"
                        variant="custom-danger"
                        onClick={() => navigate("/examenes")}
                    >
                        Cancelar
                    </CustomButton>
                </div>
            </div>

            <ConfirmAlert
                show={alertConfig.show}
                title={alertConfig.title}
                message={alertConfig.message}
                onConfirm={alertConfig.onConfirm}
                onCancel={alertConfig.onCancel}
            />
            <ConfirmAlert
                show={finalAlert.show}
                title={finalAlert.title}
                message={finalAlert.message}
                onConfirm={() => setFinalAlert({ ...finalAlert, show: false })}
                onCancel={() => setFinalAlert({ ...finalAlert, show: false })}
            />

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
                                <CustomButton
                                    className="btn-sm mt-2"
                                    variant="custom-save"
                                    onClick={handleGuardar}
                                >
                                    Guardar
                                </CustomButton>
                            ) : (
                                <CustomButton
                                    className="btn-sm mt-2"
                                    variant="custom-edit"
                                    onClick={() => setEditandoId(pregunta.id)}
                                >
                                    Editar
                                </CustomButton>
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
