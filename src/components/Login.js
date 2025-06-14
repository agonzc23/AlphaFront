import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";

export default function LoginPage() {
    const navigate = useNavigate();
    const { setUser } = useContext(AppContext);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const form = e.target;
        const email = form.elements.email.value;
        const password = form.elements.password.value;

        try {
            const response = await fetch("http://localhost:8081/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // Importante para recibir la cookie JWT
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                setUser(email.split("@")[0]);
                navigate("/seleccionar-curso", { state: { email } });
            } else {
                setError("Usuario o contraseña incorrectos");
            }
        } catch (err) {
            setError("Error de conexión con el servidor" + err.message);
        }
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
                    {error && <div className="alert alert-danger py-1">{error}</div>}
                    <button type="submit" className="btn btn-primary w-100">Entrar</button>
                </form>
            </div>
        </div>
    );
}
