# Guía 15: verificación previa a la entrega de EquipRent Mobile.
# Ejecutar en PowerShell DESDE la carpeta equiprent-mobile:
#   powershell -ExecutionPolicy Bypass -File .\scripts\verificar_entrega.ps1
#   powershell -ExecutionPolicy Bypass -File .\scripts\verificar_entrega.ps1 -Backend   (también corre JUnit)
param([switch]$Backend)

$ErrorActionPreference = 'Continue'
$resultados = New-Object System.Collections.ArrayList

function Add-Resultado([string]$paso, [string]$estado, [string]$detalle) {
    [void]$resultados.Add([pscustomobject]@{ Paso = $paso; Estado = $estado; Detalle = $detalle })
    $color = if ($estado -eq 'OK') { 'Green' } elseif ($estado -eq 'AVISO') { 'Yellow' } else { 'Red' }
    Write-Host ("[{0}] {1} {2}" -f $estado, $paso, $detalle) -ForegroundColor $color
}

if (-not (Test-Path '.\package.json') -or -not ((Get-Content '.\package.json' -Raw) -match '"name":\s*"equiprent-mobile"')) {
    Write-Host 'Ejecuta este script desde la carpeta equiprent-mobile.' -ForegroundColor Red
    exit 1
}

Write-Host '1) Archivos sensibles versionados en Git' -ForegroundColor Cyan
$versionados = git ls-files
$prohibidos = $versionados | Where-Object { $_ -match '(^|/)\.env(\..+)?\.local$|\.jks$|\.keystore$|\.p12$|\.pem$|archivos-dev/' }
if ($prohibidos) { Add-Resultado 'Secretos' 'FALLA' ("Quitar de Git: " + ($prohibidos -join ', ')) }
else { Add-Resultado 'Secretos' 'OK' 'Sin .env.local, keystores ni fotos subidas en Git' }

$publicas = Select-String -Path '.\.env.example', '.\eas.json', '.\app.json' -Pattern 'EXPO_PUBLIC_\w*(SECRET|PASSWORD|CLAVE|JWT)' -ErrorAction SilentlyContinue
if ($publicas) { Add-Resultado 'Variables públicas' 'FALLA' 'Hay un secreto en una variable EXPO_PUBLIC_' }
else { Add-Resultado 'Variables públicas' 'OK' 'Solo la URL del backend es EXPO_PUBLIC_' }

Write-Host '2) TypeScript' -ForegroundColor Cyan
npx tsc --noEmit
if ($LASTEXITCODE -eq 0) { Add-Resultado 'TypeScript' 'OK' '0 errores' } else { Add-Resultado 'TypeScript' 'FALLA' 'Revisar errores arriba' }

Write-Host '3) Pruebas Vitest' -ForegroundColor Cyan
$salida = npx vitest run 2>&1 | Out-String
Write-Host $salida
$conteo = [regex]::Match($salida, 'Tests\s+(\d+) passed').Groups[1].Value
if ($LASTEXITCODE -eq 0) { Add-Resultado 'Vitest' 'OK' "$conteo pruebas aprobadas" } else { Add-Resultado 'Vitest' 'FALLA' 'Hay pruebas fallidas' }

Write-Host '4) Salud de Expo' -ForegroundColor Cyan
npx expo-doctor
if ($LASTEXITCODE -eq 0) { Add-Resultado 'expo-doctor' 'OK' 'Sin problemas' }
else { Add-Resultado 'expo-doctor' 'AVISO' 'Revisar; la regresión de Hermes del SDK 56 está documentada en CONTROL_QA.md' }

Write-Host '5) Configuración de compilación' -ForegroundColor Cyan
$config = npx expo config --json --type public 2>$null | Out-String
if ($config -match '"package":\s*"([^"]+)"') { Add-Resultado 'Paquete Android' 'OK' $Matches[1] }
else { Add-Resultado 'Paquete Android' 'FALLA' 'Falta expo.android.package en app.json' }
if (Test-Path '.\eas.json') { Add-Resultado 'eas.json' 'OK' 'Perfiles development / preview (APK) / production (AAB)' }
else { Add-Resultado 'eas.json' 'FALLA' 'No existe eas.json' }

Write-Host '6) Bundle de Android (lo mismo que empaqueta el APK)' -ForegroundColor Cyan
$destino = Join-Path $env:TEMP 'equiprent-export-verificacion'
npx expo export --platform android --output-dir $destino | Out-Null
if ($LASTEXITCODE -eq 0) { Add-Resultado 'Bundle Android' 'OK' 'Metro compila toda la app' } else { Add-Resultado 'Bundle Android' 'FALLA' 'El bundle no compila' }
Remove-Item -Recurse -Force $destino -ErrorAction SilentlyContinue

if ($Backend) {
    Write-Host '7) Pruebas del backend (JUnit)' -ForegroundColor Cyan
    Push-Location '..\docs\equiprent-backend'
    .\mvnw.cmd -q -B test
    $okBackend = ($LASTEXITCODE -eq 0)
    Pop-Location
    if ($okBackend) { Add-Resultado 'JUnit backend' 'OK' 'Todas las pruebas aprobadas' } else { Add-Resultado 'JUnit backend' 'FALLA' 'Revisar docs/equiprent-backend/target/surefire-reports' }
}

Write-Host ''
$resultados | Format-Table -AutoSize
$fallas = @($resultados | Where-Object { $_.Estado -eq 'FALLA' }).Count
if ($fallas -gt 0) {
    Write-Host "$fallas verificación(es) fallaron: corrige antes de compilar el APK." -ForegroundColor Red
    exit 1
}
Write-Host 'Listo para compilar. Falta la prueba MANUAL en emulador/dispositivo (CONTROL_QA.md, sección 4).' -ForegroundColor Green
exit 0
