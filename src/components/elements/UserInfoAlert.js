import React, { useState } from "react";

export default function UserInfoAlert({ show, user, onClose, onChangePassword }) {
    const [showChange, setShowChange] = useState(false);
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = async () => {
        setError("");
        setSuccess("");
        if (!currentPass || !newPass || !confirmPass) {
            setError("Rellena todos los campos.");
            return;
        }
        if (newPass !== confirmPass) {
            setError("La nueva contraseña y la confirmación no coinciden.");
            return;
        }
        try {
            await onChangePassword(currentPass, newPass);
            setSuccess("Contraseña cambiada correctamente.");
            setCurrentPass("");
            setNewPass("");
            setConfirmPass("");
            setShowChange(false); // Oculta el formulario
            // El mensaje de éxito se mantiene visible fuera del formulario
        } catch (e) {
            setError(e.message || "Error al cambiar la contraseña.");
        }
    };

    // Al cerrar el alert, resetea todos los estados
    const handleClose = () => {
        setShowChange(false);
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
        setError("");
        setSuccess("");
        onClose && onClose();
    };

    if (!show) return null;
    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.3)", zIndex: 2000 }}
        >
            <div
                className="bg-white rounded shadow p-4"
                style={{
                    minWidth: 320,
                    maxWidth: 400,
                    maxHeight: 700,
                    overflowY: "auto",
                    overflowX: "hidden"
                }}
            >
                <h5>Información de usuario</h5>
                <div className="mb-2"><strong>{user?.role}</strong></div>
                <div className="mb-2"><strong>Nombre:</strong> {user?.username}</div>
                <div className="mb-3"><strong>Email:</strong> {user?.email}</div>
                {success && !showChange && (
                    <div className="alert alert-success py-1">{success}</div>
                )}
                {!showChange && (
                    <button
                        className="btn btn-primary mb-3"
                        onClick={() => setShowChange(true)}
                        type="button"
                    >
                        Cambiar contraseña
                    </button>
                )}
                {showChange && (
                    <div className="mb-3">
                        <label className="form-label">Contraseña actual</label>
                        <div className="input-group mb-2">
                            <input
                                type={showCurrent ? "text" : "password"}
                                className="form-control"
                                value={currentPass}
                                onChange={e => setCurrentPass(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                tabIndex={-1}
                                onClick={() => setShowCurrent(v => !v)}
                            >
                                <i className={`bi bi-eye${showCurrent ? "-slash" : ""}`}></i>
                            </button>
                        </div>
                        <label className="form-label">Nueva contraseña</label>
                        <div className="input-group mb-2">
                            <input
                                type={showNew ? "text" : "password"}
                                className="form-control"
                                value={newPass}
                                onChange={e => setNewPass(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                tabIndex={-1}
                                onClick={() => setShowNew(v => !v)}
                            >
                                <i className={`bi bi-eye${showNew ? "-slash" : ""}`}></i>
                            </button>
                        </div>
                        <label className="form-label">Confirmar nueva contraseña</label>
                        <div className="input-group mb-2">
                            <input
                                type={showConfirm ? "text" : "password"}
                                className="form-control"
                                value={confirmPass}
                                onChange={e => setConfirmPass(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                tabIndex={-1}
                                onClick={() => setShowConfirm(v => !v)}
                            >
                                <i className={`bi bi-eye${showConfirm ? "-slash" : ""}`}></i>
                            </button>
                        </div>
                        {error && <div className="alert alert-danger py-1">{error}</div>}
                        {success && !showChange && (
                            <div className="alert alert-success py-1">{success}</div>
                        )}
                        <div className="d-flex gap-2 mt-2">
                            <button className="btn btn-primary" type="button" onClick={handleChange}>
                                Cambiar
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={() => setShowChange(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <button className="btn btn-secondary" onClick={handleClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}