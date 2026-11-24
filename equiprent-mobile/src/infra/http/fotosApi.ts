import { API_BASE_URL, requestHttp } from './apiClient';

/** Respuesta del backend (record FotoEvidencia de Spring Boot). */
export type FotoEvidenciaDto = {
    filename: string; // UUID generado por el servidor, ej. "3f2a...c1.jpg"
    size: number; // bytes
    contentType: string; // image/jpeg | image/png
    subidaEn: string; // ISO-8601
};

/** Subir puede tardar más que un GET (imagen de 1-4 MB por Wi-Fi). */
const LIMITE_SUBIDA_MS = 30000;

/** Foto elegida en el teléfono (ImagePickerAsset reducido a lo que se envía). */
export type FotoLocal = { uri: string; mimeType?: string | null; fileName?: string | null };

export const fotosApi = {
    /** GET /api/mantenimientos/{id}/fotos -> 200 | 404 */
    listar: (mantenimientoId: number) =>
        requestHttp<FotoEvidenciaDto[]>(`/mantenimientos/${mantenimientoId}/fotos`),

    /**
     * POST /api/mantenimientos/{id}/fotos (multipart, campo "foto") -> 201 | 400 | 404 | 413.
     * React Native envía el archivo con { uri, name, type }; NO se fija Content-Type a mano
     * (apiClient lo omite con FormData para que fetch agregue el boundary).
     */
    subir: (mantenimientoId: number, foto: FotoLocal) => {
        const tipo = foto.mimeType === 'image/png' ? 'image/png' : 'image/jpeg';
        const formulario = new FormData();
        formulario.append('foto', {
            uri: foto.uri,
            name: `evidencia_${mantenimientoId}.${tipo === 'image/png' ? 'png' : 'jpg'}`,
            type: tipo,
        } as unknown as Blob);
        return requestHttp<FotoEvidenciaDto>(
            `/mantenimientos/${mantenimientoId}/fotos`,
            { method: 'POST', body: formulario },
            LIMITE_SUBIDA_MS
        );
    },

    /** URL de la imagen para <Image>; el token va en headers (ver pantalla de fotos). */
    url: (mantenimientoId: number, filename: string) =>
        `${API_BASE_URL}/mantenimientos/${mantenimientoId}/fotos/${encodeURIComponent(filename)}`,
};
