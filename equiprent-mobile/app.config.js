// Guía 15: configuración dinámica. Parte de app.json y solo agrega lo que depende del PERFIL de compilación.
//
// Android bloquea HTTP sin cifrar ("cleartext") en las compilaciones release.
// - development / preview (APK de clase): se permite HTTP para llegar a http://<IP-de-la-PC>:8080/api.
// - production (AAB para Google Play): HTTP queda BLOQUEADO; el backend debe usar HTTPS.
// EAS define EAS_BUILD_PROFILE durante la compilación. En local (expo start) no existe y se
// permite HTTP, igual que en desarrollo.
module.exports = ({ config }) => {
    const perfil = process.env.EAS_BUILD_PROFILE ?? 'development';
    const permitirHttp = perfil !== 'production';

    return {
        ...config,
        plugins: [
            ...(config.plugins ?? []),
            ['expo-build-properties', { android: { usesCleartextTraffic: permitirHttp } }],
        ],
        extra: {
            ...(config.extra ?? {}),
            perfilCompilacion: perfil,
        },
    };
};
