import React, { createContext, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);      // Guarda el email del usuario
    const [curso, setCurso] = useState(null);
    const [cursoId, setCursoId] = useState(null);    // Guarda el curso seleccionado

    return (
        <AppContext.Provider value={{ user, setUser, curso, setCurso, cursoId, setCursoId }}>
            {children}
        </AppContext.Provider>
    );
}