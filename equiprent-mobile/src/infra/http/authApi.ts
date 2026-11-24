import { requestHttp } from './apiClient';

/** Respuesta de POST /api/auth/login (record LoginResponse de Spring Boot). */
export type LoginResponse = {
    accessToken: string;
    tokenType: string; // 'Bearer'
    expiresIn: number; // segundos
    username: string;
};

export const authApi = {
    /** POST /api/auth/login -> 200 | 400 campos vacíos | 401 credenciales incorrectas */
    login: (username: string, password: string) =>
        requestHttp<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: username.trim(), password }),
        }),
};
