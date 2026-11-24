import React, { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { registrarAlNoAutorizado } from '../infra/http/apiClient';
import { authApi } from '../infra/http/authApi';
import { tokenStorage } from '../security/tokenStorage';

type AuthValue = {
    token: string | null;
    usuario: string | null;
    /** true mientras se lee el token guardado al abrir la app. */
    cargando: boolean;
    /** Se pone en true cuando el backend respondió 401 y la sesión se cerró sola. */
    sesionExpirada: boolean;
    login: (usuario: string, contrasena: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

/**
 * Sesión de EquipRent Mobile (Guía 11).
 * - Al abrir la app recupera el token de SecureStore (la sesión sobrevive al reinicio).
 * - login(): POST /api/auth/login y guarda el token.
 * - logout(): borra el token del dispositivo.
 * - Si cualquier petición recibe 401, cierra la sesión automáticamente.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [usuario, setUsuario] = useState<string | null>(null);
    const [cargando, setCargando] = useState(true);
    const [sesionExpirada, setSesionExpirada] = useState(false);

    useEffect(() => {
        Promise.all([tokenStorage.leer(), tokenStorage.leerUsuario()])
            .then(([t, u]) => {
                setToken(t);
                setUsuario(u);
            })
            .catch(() => setToken(null))
            .finally(() => setCargando(false));
    }, []);

    const logout = useCallback(async () => {
        await tokenStorage.borrar().catch(() => undefined);
        setToken(null);
        setUsuario(null);
    }, []);

    useEffect(() => {
        registrarAlNoAutorizado(() => {
            setSesionExpirada(true);
            void logout();
        });
        return () => registrarAlNoAutorizado(null);
    }, [logout]);

    async function login(nombre: string, contrasena: string) {
        const respuesta = await authApi.login(nombre, contrasena);
        await tokenStorage.guardar(respuesta.accessToken, respuesta.username);
        setToken(respuesta.accessToken);
        setUsuario(respuesta.username);
        setSesionExpirada(false);
    }

    return (
        <AuthContext.Provider value={{ token, usuario, cargando, sesionExpirada, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthValue {
    const contexto = useContext(AuthContext);
    if (!contexto) throw new Error('useAuth requiere AuthProvider en src/app/_layout.tsx');
    return contexto;
}
