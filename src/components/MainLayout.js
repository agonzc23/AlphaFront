import React from "react";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
    return (
        <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
            <div>
                <Outlet />
            </div>
        </div>
    );
}