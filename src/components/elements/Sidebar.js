import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../AppContext";

export default function Sidebar() {
    const { curso } = useContext(AppContext);
    const disabled = !curso;
    const disabledClass = "disabled pointer-events-none opacity-50";

    // Función para prevenir navegación si está deshabilitado
    const handleDisabledClick = (e) => {
        if (disabled) {
            e.preventDefault();
        }
    };

    return (
        <div className="position-fixed top-0 start-0 h-100 p-3"
            style={{
                width: "180px",
                backgroundColor: "#00abe4",
                fontFamily: "'Poppins', sans-serif",
                boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
            }}>
            <h2 className="mb-4"
                style={{ color: "#E9F1FA", fontSize: "1.5rem" }}>Project Alpha</h2>
            <nav>
                <ul className="list-unstyled m-0 p-0">
                    <li className="mb-3">
                        <NavLink
                            to="/cursos"
                            className={({ isActive }) =>
                                "text-decoration-none fw-medium d-flex align-items-center" +
                                (isActive ? " bg-white bg-opacity-25 rounded px-2" : "") +
                                (disabled ? ` ${disabledClass}` : "")
                            }
                            tabIndex={disabled ? -1 : 0}
                            aria-disabled={disabled}
                            onClick={handleDisabledClick}
                        >
                            <i className="bi bi-house-door-fill me-2" style={{ color: "#E9F1FA" }}></i>
                            <span style={{ color: "#E9F1FA" }}>Inicio</span>
                        </NavLink>
                    </li>
                    <li className="mb-3">
                        <NavLink
                            to="/contenido"
                            className={({ isActive }) =>
                                "text-decoration-none fw-medium d-flex align-items-center" +
                                (isActive ? " bg-white bg-opacity-25 rounded px-2" : "") +
                                (disabled ? ` ${disabledClass}` : "")
                            }
                            tabIndex={disabled ? -1 : 0}
                            aria-disabled={disabled}
                            onClick={handleDisabledClick}
                        >
                            <i className="bi bi-book me-2" style={{ color: "#E9F1FA" }}></i>
                            <span style={{ color: "#E9F1FA" }}>Contenidos</span>
                        </NavLink>
                    </li>
                    <li className="mb-3">
                        <NavLink
                            to="/examenes"
                            className={({ isActive }) =>
                                "text-decoration-none fw-medium d-flex align-items-center" +
                                (isActive ? " bg-white bg-opacity-25 rounded px-2" : "") +
                                (disabled ? ` ${disabledClass}` : "")
                            }
                            tabIndex={disabled ? -1 : 0}
                            aria-disabled={disabled}
                            onClick={handleDisabledClick}
                        >
                            <i className="bi bi-check-square me-2" style={{ color: "#E9F1FA" }}></i>
                            <span style={{ color: "#E9F1FA" }}>Examenes</span>
                        </NavLink>
                    </li>
                    <li className="mb-3">
                        <NavLink
                            to="/clases"
                            className={({ isActive }) =>
                                "text-decoration-none fw-medium d-flex align-items-center" +
                                (isActive ? " bg-white bg-opacity-25 rounded px-2" : "") +
                                (disabled ? ` ${disabledClass}` : "")
                            }
                            tabIndex={disabled ? -1 : 0}
                            aria-disabled={disabled}
                            onClick={handleDisabledClick}
                        >
                            <i className="bi bi-camera-reels me-2" style={{ color: "#E9F1FA" }}></i>
                            <span style={{ color: "#E9F1FA" }}>Clases</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
