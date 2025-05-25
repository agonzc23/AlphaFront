import React from "react";

export default function ConfirmAlert({ show, title, message, onConfirm, onCancel }) {
    if (!show) return null;
    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.3)", zIndex: 2000 }}
        >
            <div className="bg-white rounded shadow p-4" style={{ minWidth: 320 }}>
                <h5>{title}</h5>
                <p>{message}</p>
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <button className="btn btn-primary" onClick={onConfirm} style={{ backgroundColor: "#00abe4", borderColor: "#00abe4" }}>
                        Confirmar
                    </button>
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}