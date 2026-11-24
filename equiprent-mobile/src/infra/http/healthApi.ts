import { requestHttp } from './apiClient';

/** Forma EXACTA del JSON de GET /api/health (HealthController de Spring Boot). */
export type HealthResponse = {
    status: string; // 'OK' cuando el backend está arriba
    application: string;
    stage: string;
    timestamp: string;
};

/** Resultado del diagnóstico: la respuesta y cuánto tardó (ms). */
export type ResultadoSalud = { salud: HealthResponse; latenciaMs: number };

export const healthApi = {
    /** GET /api/health : prueba de conexión real desde el emulador Android. */
    async consultar(): Promise<ResultadoSalud> {
        const inicio = Date.now();
        const salud = await requestHttp<HealthResponse>('/health');
        return { salud, latenciaMs: Date.now() - inicio };
    },
};
