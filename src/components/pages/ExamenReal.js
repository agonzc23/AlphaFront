import React, { useEffect, useState, useRef } from "react";
import ConfirmAlert from "../elements/ConfirmAlert";

export default function ExamenReal({ examenName, questions, duration, onFinish }) {
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(() => (duration || 0) * 60);
    const [showConfirm, setShowConfirm] = useState(false);
    const [resultJson, setResultJson] = useState(null);
    const [pagina, setPagina] = useState(1);
    const preguntasPorPagina = 10;
    const totalPaginas = Math.ceil((questions.length || 0) / preguntasPorPagina);
    const preguntasMostradas = questions.slice(
        (pagina - 1) * preguntasPorPagina,
        pagina * preguntasPorPagina
    ) || [];
    const timerRef = useRef();

    useEffect(() => {
        if (duration) setTimeLeft(duration * 60);
    }, [duration]);

    useEffect(() => {
        if (timeLeft <= 0 && questions.length > 0) {
            handleFinish(true); // true: forzar finalización por tiempo
            return;
        }
        if (timeLeft > 0) {
            timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerRef.current);
        }
        // eslint-disable-next-line
    }, [timeLeft, questions]);

    const handleChange = (qIdx, rIdx) => {
        setAnswers(prev => ({ ...prev, [qIdx]: rIdx }));
    };

    const handleFinish = (force = false) => {
        if (!force) {
            setShowConfirm(true);
            return;
        }
        if (timerRef.current) clearTimeout(timerRef.current);
        const result = questions.map((q, idx) => ({
            questionId: q.id,
            selectedOptionId:
                typeof answers[idx] !== "undefined"
                    ? q.answers[answers[idx]].id
                    : null
        }));
        setResultJson(JSON.stringify(result, null, 2));
    };

    const handleConfirmFinish = () => {
        setShowConfirm(false);
        if (timerRef.current) clearTimeout(timerRef.current);
        const result = questions.map((q, idx) => ({
            questionId: q.id,
            selectedOptionId:
                typeof answers[idx] !== "undefined"
                    ? q.answers[answers[idx]].id
                    : null
        }));
        setResultJson(JSON.stringify(result, null, 2));
    };

    const handleCloseResult = () => {
        setResultJson(null);
        if (onFinish) onFinish();
    };

    // Formatea el tiempo restante mm:ss
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div style={{ fontFamily: "Poppins, sans-serif" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>{examenName}</h2>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge fs-5" style={{ background: '#00abe4', color: '#fff' }}>
                    Tiempo restante: {formatTime(timeLeft)}
                </span>
            </div>
            <div className="row">
                <div className="col-12">
                    {/* Grid de navegación de preguntas */}
                    <div className="card shadow-sm" style={{ marginTop: 0, marginBottom: 24, maxWidth: 870 }}>
                        <div className="card-header text-center fw-bold">Preguntas</div>
                        <div className="card-body d-flex flex-wrap" style={{ gap: 4, justifyContent: 'flex-start' }}>
                            {questions.map((q, idx) => {
                                const answered = typeof answers[idx] !== "undefined";
                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            width: 38,
                                            height: 38,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: 6,
                                            background: answered ? "#198754" : "#ffc107",
                                            color: answered ? "#fff" : "#212529",
                                            fontWeight: 600,
                                            fontSize: 18,
                                            border: "2px solid #212529",
                                            margin: 0,
                                            cursor: "pointer"
                                        }}
                                        title={`Ir a la pregunta ${q.orderQuestion}`}
                                        onClick={() => setPagina(Math.floor(idx / preguntasPorPagina) + 1)}
                                    >
                                        {q.orderQuestion}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Preguntas */}
                    <button
                        className="btn btn-success mt-4 mb-4"
                        onClick={() => handleFinish(false)}
                    >
                        Finalizar Examen
                    </button>
                    <ul className="list-group" style={{ paddingLeft: 0 }}>
                        {preguntasMostradas.map((question, idx) => {
                            const globalIdx = (pagina - 1) * preguntasPorPagina + idx;
                            return (
                                <li className="list-group-item" key={globalIdx} style={{ width: "100%", borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', margin: '0 0 16px 0' }}>
                                    <div className="mb-2 fw-bold">
                                        <span className="me-2">{question.orderQuestion}.</span>
                                        {question.questionText || `Pregunta ${globalIdx + 1}`}
                                    </div>
                                    <div>
                                        {question.answers && question.answers.length > 0 ? (
                                            <ul className="list-unstyled">
                                                {question.answers.map((answ, rIdx) => (
                                                    <li key={rIdx}>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name={`pregunta-${globalIdx}`}
                                                                id={`pregunta-${globalIdx}-resp-${rIdx}`}
                                                                checked={answers[globalIdx] === rIdx}
                                                                onChange={() => handleChange(globalIdx, rIdx)}
                                                                style={{ border: "2px solid #212529" }}
                                                            />
                                                            <label className="form-check-label" htmlFor={`pregunta-${globalIdx}-resp-${rIdx}`}>
                                                                <strong>{answ.orderAnswer}.</strong> {answ.answerText}
                                                            </label>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-muted">Sin respuestas</span>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <nav className="mt-4">
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
            </div>
            <ConfirmAlert
                show={showConfirm}
                title="Confirmar"
                message={
                    <>
                    ¿Seguro que quieres finalizar el examen?<br />
                    No podrás modificar tus respuestas.
                    </>
                }
                onConfirm={handleConfirmFinish}
                onCancel={() => setShowConfirm(false)}
            />
            {resultJson && (
                <ConfirmAlert
                    show={true}
                    title="Respuestas enviadas"
                    message={
                        <div>
                            <div className="mb-2">Este es el JSON generado:</div>
                            <pre style={{ fontSize: 13, background: "#f8f9fa", padding: 10, borderRadius: 4 }}>
                                {resultJson}
                            </pre>
                        </div>
                    }
                    onConfirm={handleCloseResult}
                    onCancel={handleCloseResult}
                />
            )}
        </div>
    );
}