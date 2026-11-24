/**
 * Convierte un parámetro de ruta (siempre llega como texto) en un ID entero positivo.
 * Rechaza arreglos, ausencias, letras, ceros, negativos y enteros fuera del rango seguro.
 * Ejemplos: "1" -> 1 | "999" -> 999 | "abc" -> null | "0" -> null | "-3" -> null
 */
export function leerIdPositivo(valor: string | string[] | undefined): number | null {
    if (typeof valor !== 'string' || !/^[1-9]\d*$/.test(valor)) {
        return null;
    }
    const numero = Number(valor);
    return Number.isSafeInteger(numero) ? numero : null;
}