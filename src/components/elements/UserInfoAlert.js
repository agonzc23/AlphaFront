import React, { useState } from "react";

export default function UserInfoAlert({ show, user, onClose, onChangePassword }) {
    const [showChange, setShowChange] = useState(false);
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = async () => {
        setError("");
        setSuccess("");
        if (!currentPass || !newPass) {
            setError("Rellena ambos campos.");
            return;
        }
        try {
            await onChangePassword(currentPass, newPass);
            setSuccess("Contraseña cambiada correctamente.");
            setCurrentPass("");
            setNewPass("");
        } catch (e) {
            setError(e.message || "Error al cambiar la contraseña.");
        }
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
                <div className="mb-2"><strong>Nombre:</strong> {user?.username}</div>
                <div className="mb-2"><strong>Email:</strong> {user?.email}</div>
                <div className="mb-3"><strong>Rol:</strong> {user?.role}</div>
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
                        <input
                            type="password"
                            className="form-control mb-2"
                            value={currentPass}
                            onChange={e => setCurrentPass(e.target.value)}
                        />
                        <label className="form-label">Nueva contraseña</label>
                        <input
                            type="password"
                            className="form-control mb-2"
                            value={newPass}
                            onChange={e => setNewPass(e.target.value)}
                        />
                        {error && <div className="alert alert-danger py-1">{error}</div>}
                        {success && <div className="alert alert-success py-1">{success}</div>}
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
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}