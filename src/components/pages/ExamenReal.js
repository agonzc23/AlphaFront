import React, { useEffect, useState, useRef } from "react";
import ConfirmAlert from "../elements/ConfirmAlert";

export default function ExamenReal({ examenId, onFinish }) {
    const [questions, setQuestions] = useState([]);
    const [examenName, setExamenName] = useState(""); // Nuevo estado para el nombre
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0); // tiempo restante en segundos
    const [showConfirm, setShowConfirm] = useState(false);
    const [resultJson, setResultJson] = useState(null);
    const timerRef = useRef();

    useEffect(() => {
        fetch("/dummyData/examns.json")
            .then(res => res.json())
            .then(data => {
                const examen = data.examns.find(e => e.id === examenId);
                setQuestions(examen?.questions || []);
                setExamenName(examen?.name || "Examen"); // Guardar el nombre
                setTimeLeft((examen?.duration || 0) * 60);
            });
    }, [examenId]);

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
                    ? q.options[answers[idx]].id
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
                    ? q.options[answers[idx]].id
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
                            {question.question || `Pregunta ${idx + 1}`}
                        </div>
                        <div>
                            {question.options && question.options.length > 0 ? (
                                <ul className="list-unstyled">
                                    {question.options.map((opt, rIdx) => (
                                        <li key={rIdx}>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name={`pregunta-${idx}`}
                                                    id={`pregunta-${idx}-resp-${rIdx}`}
                                                    checked={answers[idx] === rIdx}
                                                    onChange={() => handleChange(idx, rIdx)}
                                                />
                                                <label className="form-check-label" htmlFor={`pregunta-${idx}-resp-${rIdx}`}>
                                                    {opt.option}
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
                className="btn btn-success mt-4"
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