import React from "react";

export default function AlertMessage({ type = "info", message }) {
    if (!message) return null;
    const className = `alert alert-${type} py-1`;
    return <div className={className} role="alert" aria-live="polite">{message}</div>;
}
