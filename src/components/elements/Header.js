import React, { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { user, curso, setUser, setCurso } = useContext(AppContext);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef();

    // Cierra el menú si se hace click fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setUser(null);
        setCurso(null);
        navigate("/");
    };

    return (
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom"
            style={{ marginLeft: "200px", position: "relative" }}>
            <a href="/cursos" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                <span className="fs-4">{curso ? curso.name : ""}</span>
            </a>
            <ul className="nav nav-pills" style={{ position: "relative" }}>
                <li className="nav-item me-2" ref={menuRef} style={{ position: "relative" }}>
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setShowMenu((v) => !v)}
                    >
                        {user} <i className="bi bi-person-circle"></i>
                    </button>
                    {showMenu && (
                        <div
                            className="dropdown-menu show"
                            style={{
                                position: "absolute",
                                top: "100%",
                                left: "0",
                                minWidth: "160px",
                                transform: "translateX(-60%)", // Ajusta este valor según lo que necesites
                                zIndex: 1050
                            }}
                        >
                            <button className="dropdown-item" type="button">
                                Ver Usuario
                            </button>
                            <button className="dropdown-item" type="button" onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </li>
                <li className="nav-item me-2">
                    <button type="button" className="btn btn-outline-primary">
                        <i className="bi bi-gear"></i>
                    </button>
                </li>
            </ul>
        </header>
    );
}
