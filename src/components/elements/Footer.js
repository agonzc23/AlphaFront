import React from "react";

export default function Footer() {
    const year = new Date().getFullYear();
    const version = "v1.0.0";

    return (
        <footer
            className="bg-light border-top py-2"
            style={{ marginLeft: "180px" }}
        >
            <div className="container d-flex justify-content-between align-items-center px-0">
                <span className="text-muted ms-3">
                    © {year} Project Alpha. Todos los derechos reservados.
                </span>
                <span className="text-muted me-3">
                    {version}
                </span>
            </div>
        </footer>
    );
}