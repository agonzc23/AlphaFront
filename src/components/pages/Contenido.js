import React from "react";
export default function Contenido() {
    const grupos = [
        {
            titulo: "Documentos PDF",
            icono: <i className="bi bi-filetype-pdf me-2 text-danger"></i>,
            archivos: [
                { nombre: "Manual_Usuario.pdf", descripcion: "Manual completo de uso de la plataforma (PDF)" },
                { nombre: "Tutorial_Plataforma.pdf", descripcion: "Tutorial paso a paso de la plataforma (PDF)" }
            ]
        },
        {
            titulo: "Presentaciones",
            icono: <i className="bi bi-file-earmark-ppt me-2 text-warning"></i>,
            archivos: [
                { nombre: "Presentacion_Curso.pptx", descripcion: "Presentación introductoria del curso (PowerPoint)" },
                { nombre: "Clase_1.pptx", descripcion: "Presentación de la clase 1 (PowerPoint)" }
            ]
        },
        {
            titulo: "Videos",
            icono: <i className="bi bi-camera-reels me-2 text-primary"></i>,
            archivos: [
                { nombre: "Video_Bienvenida.mp4", descripcion: "Video de bienvenida al curso (MP4)" },
                { nombre: "Clase_Introductoria.mp4", descripcion: "Grabación de la clase introductoria (MP4)" }
            ]
        },
        {
            titulo: "Documentos Word",
            icono: <i className="bi bi-file-earmark-word me-2 text-primary"></i>,
            archivos: [
                { nombre: "Guia_Rapida.docx", descripcion: "Guía rápida de referencia (Word)" },
                { nombre: "Plantilla_Informe.docx", descripcion: "Plantilla para informes de prácticas (Word)" }
            ]
        },
        {
            titulo: "Hojas de Cálculo",
            icono: <i className="bi bi-file-earmark-spreadsheet me-2 text-success"></i>,
            archivos: [
                { nombre: "Ejercicios_Practica.xlsx", descripcion: "Ejercicios prácticos en hoja de cálculo (Excel)" },
                { nombre: "Datos_Ejemplo.xlsx", descripcion: "Datos de ejemplo para análisis (Excel)" }
            ]
        }
    ];

    return (
        <div style={{ fontFamily: "Poppins, sans-serif" }}>
            <h1>Contenidos</h1>
            <div className="card mb-3" style={{ width: "11rem" }}>
                {/* Aquí puedes mostrar más info del curso si tienes */}
                <button
                    type="button"
                    className="btn btn-success btn-sm"
                    style={{ width: "11rem" }}
                >
                    AÑADIR CONTENIDO
                </button>
            </div>
            {grupos.map((grupo, idx) => (
                <div key={idx} className="mb-4">
                    <h4 className="mb-2">{grupo.titulo}</h4>
                    <ul className="list-group d-flex flex-row flex-wrap" style={{ gap: "1rem" }}>
                        {grupo.archivos.map((archivo, aIdx) => (
                            <li
                                className="list-group-item d-flex align-items-center me-4"
                                key={aIdx}
                                style={{
                                    minWidth: "620px",
                                    maxWidth: "620px",
                                    minHeight: "110px",
                                    marginBottom: "1rem",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                                }}
                            >
                                <div className="flex-grow-1">
                                    <span className="fw-bold">
                                        {grupo.icono}
                                        {archivo.nombre}
                                    </span>
                                    <br />
                                    <span className="text-muted">{archivo.descripcion}</span>
                                </div>
                                <a
                                    href={`/dummyData/${archivo.nombre}`}
                                    download
                                    className="btn btn-outline-primary ms-3"
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    <i className="bi bi-download"></i>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}