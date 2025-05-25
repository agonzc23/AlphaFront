import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";

export default function LoginPage() {

    const navigate = useNavigate();
    const { setUser } = useContext(AppContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.target;
        const email = form.elements.email.value;
        const username = email.split("@")[0];
        setUser(username);
        // Aquí podrías validar la autenticación si quisieras
        navigate("/seleccionar-curso", { state: { email } }); // Redirige a /cursos
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light" style={{ fontFamily: 'sans-serif' }}>
            <div className="card p-4 shadow" style={{ minWidth: "320px", maxWidth: "400px" }}>
                <h1 className="mb-4"
                    style={{
                        color: "#00ABE4",
                        fontSize: "2.5rem",
                        width: "280px",
                        fontFamily: "'Poppins', sans-serif",
                    }}>Project Alpha</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="usuario@ejemplo.com"
                            required
                        />
                    </div>
                    <div className="mb-3 position-relative">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="********"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Entrar</button>
                </form>
            </div>
        </div>
    );
}
