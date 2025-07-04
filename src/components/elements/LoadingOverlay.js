import React from "react";

export default function LoadingOverlay({ show }) {
    if (!show) return null;
    return (
        <div className="loading-overlay">
            <i className="bi bi-gear-fill spin"></i>
        </div>
    );
}
