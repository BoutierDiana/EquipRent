package com.equiprent.shared.web;

import com.equiprent.shared.domain.exception.ConflictoNegocioException;
import com.equiprent.shared.domain.exception.RecursoNoEncontradoException;
import com.equiprent.shared.domain.exception.ReglaNegocioException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Traduce excepciones a respuestas HTTP con un cuerpo ApiError uniforme.
 * Mapa de estados:
 *   400 -> validación de DTO, JSON/fechas mal formados, id no numérico, regla de negocio
 *   404 -> recurso inexistente o ruta inexistente
 *   405 -> método HTTP no soportado por la ruta
 *   409 -> conflicto con los datos actuales (duplicados, dependencias, integridad)
 *   415 -> Content-Type distinto de application/json
 *   500 -> cualquier otro error no previsto
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 404 - Not Found (UnidadEquipoNoEncontradaException, MantenimientoNoEncontradoException)
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ApiError> handleNotFound(RecursoNoEncontradoException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI(), Map.of());
    }

    // 404 - Ruta inexistente (antes caía en el 500 genérico)
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiError> handleNoResource(NoResourceFoundException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.NOT_FOUND, "La ruta solicitada no existe", request.getRequestURI(), Map.of());
    }

    // 409 - Conflict de negocio (NumeroSerieDuplicadoException, UnidadEquipoConDependenciasException)
    @ExceptionHandler(ConflictoNegocioException.class)
    public ResponseEntity<ApiError> handleConflict(ConflictoNegocioException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage(), request.getRequestURI(), Map.of());
    }

    // 409 - Restricción de PostgreSQL no anticipada por el servicio (FK, UNIQUE, CHECK)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
        log.warn("Violación de integridad en {}: {}", request.getRequestURI(), ex.getMostSpecificCause().getMessage());
        return buildResponse(HttpStatus.CONFLICT,
                "La operación viola una restricción de integridad de la base de datos "
                        + "(registro relacionado inexistente, duplicado o con dependencias)",
                request.getRequestURI(), Map.of());
    }

    // 400 - Bad Request (Errores de validación @Valid en DTOs)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return buildResponse(HttpStatus.BAD_REQUEST, "Error de validación en los campos enviados", request.getRequestURI(), errors);
    }

    // 400 - Regla de negocio (FechasMantenimientoInvalidasException)
    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<ApiError> handleReglaNegocio(ReglaNegocioException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI(), Map.of());
    }

    // 400 - JSON mal formado o fecha que no respeta ISO-8601 (ej. "2026-10-20T08:00:00-04:00")
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleNotReadable(HttpMessageNotReadableException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST,
                "El cuerpo de la petición no es un JSON válido o tiene un campo con formato incorrecto "
                        + "(las fechas deben ir en ISO-8601 con zona horaria)",
                request.getRequestURI(), Map.of());
    }

    // 400 - Parámetro de ruta con tipo incorrecto (ej. /api/unidades-equipo/abc)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST,
                "El parámetro '" + ex.getName() + "' tiene un valor inválido: " + ex.getValue(),
                request.getRequestURI(), Map.of());
    }

    // 400 - Bad Request (Valores inválidos en Enums o formato JSON)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI(), Map.of());
    }

    // 405 - Método no soportado (ej. PATCH sobre una ruta que solo acepta PUT)
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiError> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.METHOD_NOT_ALLOWED,
                "El método " + ex.getMethod() + " no está soportado en esta ruta",
                request.getRequestURI(), Map.of());
    }

    // 415 - Content-Type incorrecto
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiError> handleMediaType(HttpMediaTypeNotSupportedException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                "El cuerpo debe enviarse con Content-Type: application/json",
                request.getRequestURI(), Map.of());
    }

    // 500 - Internal Server Error (el detalle completo queda en el log de IntelliJ)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneralException(Exception ex, HttpServletRequest request) {
        log.error("Error no controlado en {}", request.getRequestURI(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Ha ocurrido un error interno en el servidor", request.getRequestURI(), Map.of());
    }

    private ResponseEntity<ApiError> buildResponse(HttpStatus status, String message, String path, Map<String, String> fieldErrors) {
        ApiError apiError = new ApiError(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                path,
                fieldErrors
        );
        return ResponseEntity.status(status).body(apiError);
    }
}
