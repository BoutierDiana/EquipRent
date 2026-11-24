/**
 * postinstall: compatibilidad de React Native 0.85.3 con Gradle 9.
 *
 * @react-native/gradle-plugin declara el plugin foojay-resolver 0.5.0, que usa un campo
 * (JvmVendorSpec.IBM_SEMERU) eliminado en Gradle 9. La compilación de Android (local o EAS)
 * falla con: "Class JvmVendorSpec does not have member field IBM_SEMERU".
 * Este script lo sube a 1.0.0. Es idempotente y no hace nada si React Native ya lo corrigió.
 * Quitar cuando @react-native/gradle-plugin traiga foojay >= 1.0.0.
 */
const fs = require('fs');
const path = require('path');

let archivo;
try {
    const raiz = path.dirname(require.resolve('@react-native/gradle-plugin/package.json', {
        paths: [path.dirname(require.resolve('react-native/package.json'))],
    }));
    archivo = path.join(raiz, 'settings.gradle.kts');
} catch {
    process.exit(0); // sin React Native instalado: nada que corregir
}

if (!fs.existsSync(archivo)) process.exit(0);
const texto = fs.readFileSync(archivo, 'utf8');
const viejo = 'foojay-resolver-convention").version("0.5.0")';
if (texto.includes(viejo)) {
    fs.writeFileSync(archivo, texto.replace(viejo, 'foojay-resolver-convention").version("1.0.0")'));
    console.log('[postinstall] foojay-resolver 0.5.0 -> 1.0.0 (compatibilidad con Gradle 9)');
}
