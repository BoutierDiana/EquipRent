import { defineConfig } from 'vitest/config';

/**
 * Guía 14: Vitest prueba SOLO código TypeScript puro (dominio, validaciones,
 * mappers, cliente HTTP con fetch simulado). No arranca Android ni React Native:
 * lo nativo (SecureStore, SQLite, cámara) se prueba a mano según CONTROL_QA.md.
 */
export default defineConfig({
    test: {
        include: ['tests/**/*.test.ts'],
        environment: 'node',
        restoreMocks: true,
    },
});
