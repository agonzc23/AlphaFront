import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";

export default function CrearExamen() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tiempo, setTiempo] = useState(90);
    const [archivo, setArchivo] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const { curso } = useContext(AppContext);
    const navigate = useNavigate();

    const handleArchivoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            setError("El archivo debe ser un .docx");
            setArchivo(null);
            setNombre("");
        } else if (file) {
            setError("");
            setArchivo(file);
            const nombreSinExtension = file.name.replace(/\.docx$/i, "");
            setNombre(nombreSinExtension);
        } else {
            setArchivo(null);
            setNombre("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        if (!nombre || !descripcion || !tiempo || !archivo) {
            setError("Completa todos los campos y selecciona un archivo .docx");
            setLoading(false);
            return;
        }
        if (!curso) {
            setError("No hay bloque/curso seleccionado.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("title", nombre);
        formData.append("description", descripcion);
        formData.append("duration", tiempo);
        formData.append("course", curso.id || curso);
        formData.append("file", archivo);

        try {
            const response = await fetch("http://localhost:8081/exams/upload", {
                method: "POST",
                body: formData,
                credentials: "include"
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || "Error al crear el examen");
            }
            const examenCreado = await response.json();
            setSuccess("Examen creado correctamente.");
            setError("");
            // Redirige a summary-exam y pasa el examen creado por estado
            navigate("/summary-exam", { state: { examen: examenCreado } });
        } catch (err) {
            setError(err.message || "Error al crear el examen");
            setSuccess("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 d-flex justify-content-start" style={{ fontFamily: "Poppins, sans-serif", position: "relative" }}>
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
            <div style={{ maxWidth: 700, width: "100%" }}>
                <h2 className="mb-4">Crear Examen</h2>
                <div className="alert alert-info py-2 mb-4">
                    Para la creación de examen será necesario adjuntar un Documento de Microsoft Word (.docx) con el formato adecuado para su posterior procesado
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Archivo (.docx)</label>
                        <input
                            type="file"
                            className="form-control"
                            accept=".docx"
                            onChange={handleArchivoChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={nombre}
                            disabled
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea
                            className="form-control"
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            rows={3}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Tiempo (minutos)</label>
                        <input
                            type="number"
                            className="form-control"
                            min={5}
                            max={240}
                            step={5}
                            value={tiempo}
                            onChange={e => setTiempo(Number(e.target.value))}
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger py-1">{error}</div>}
                    {success && <div className="alert alert-success py-1">{success}</div>}
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#00abe4", borderColor: "#00abe4" }}>
                        Generar Examen
                    </button>
                </form>
            </div>
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
        </div>
    );
}