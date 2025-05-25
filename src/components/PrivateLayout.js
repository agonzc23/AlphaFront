import React, { useContext, useEffect } from "react";
import Sidebar from "./elements/Sidebar";
import Header from "./elements/Header";
import Footer from "./elements/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";

export default function PrivateLayout() {

    const { curso, user } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/"); // Redirige al login si no hay usuario
            return;
        }
        if (!curso) {
            navigate("/seleccionar-curso");
            return;
        }
    }, [user, curso, navigate]);

    return (
        <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
            <Header />
            <Sidebar />
            <div style={{ flex: 1, marginLeft: "220px" }}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}