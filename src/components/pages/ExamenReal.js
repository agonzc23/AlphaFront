import React, { useEffect, useState, useRef } from "react";
import ConfirmAlert from "../elements/ConfirmAlert";

export default function ExamenReal({ examenName, questions, duration, onFinish }) {
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(() => (duration || 0) * 60);
    const [showConfirm, setShowConfirm] = useState(false);
    const [resultJson, setResultJson] = useState(null);
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
                <span className="badge bg-warning fs-5">
                    Tiempo restante: {formatTime(timeLeft)}
                </span>
            </div>
            <ul className="list-group">
                {questions.map((question, idx) => (
                    <li className="list-group-item me-4" key={idx}>
                        <div className="mb-2 fw-bold">
                            {/* Muestra el número de orden de la pregunta */}
                            <span className="me-2">{question.orderQuestion}.</span>
                            {question.questionText || `Pregunta ${idx + 1}`}
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
                                                    name={`pregunta-${idx}`}
                                                    id={`pregunta-${idx}-resp-${rIdx}`}
                                                    checked={answers[idx] === rIdx}
                                                    onChange={() => handleChange(idx, rIdx)}
                                                    style={{ border: "2px solid #212529" }}
                                                />
                                                <label className="form-check-label" htmlFor={`pregunta-${idx}-resp-${rIdx}`}>
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
                ))}
            </ul>
            <button
                className="btn btn-success mt-4 mb-4" // Añade mb-5 para más espacio abajo
                onClick={() => handleFinish(false)}
            >
                Finalizar Examen
            </button>
            <ConfirmAlert
                show={showConfirm}
                title="Confirmar"
                message="¿Seguro que quieres finalizar el examen? No podrás modificar tus respuestas."
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