import * as SecureStore from 'expo-secure-store';

/**
 * Almacenamiento SEGURO del token (Guía 11).
 * En Android, expo-secure-store cifra el valor con Android Keystore; a diferencia de
 * AsyncStorage, otra app o un respaldo no pueden leerlo en texto plano.
 * Regla: se guarda SOLO el token, nunca la contraseña del usuario.
 */
const CLAVE_TOKEN = 'equiprent_access_token';
const CLAVE_USUARIO = 'equiprent_usuario';

export const tokenStorage = {
    leer: () => SecureStore.getItemAsync(CLAVE_TOKEN),
    leerUsuario: () => SecureStore.getItemAsync(CLAVE_USUARIO),
    async guardar(token: string, usuario: string) {
        await SecureStore.setItemAsync(CLAVE_TOKEN, token);
        await SecureStore.setItemAsync(CLAVE_USUARIO, usuario);
    },
    async borrar() {
        await SecureStore.deleteItemAsync(CLAVE_TOKEN);
        await SecureStore.deleteItemAsync(CLAVE_USUARIO);
    },
};
