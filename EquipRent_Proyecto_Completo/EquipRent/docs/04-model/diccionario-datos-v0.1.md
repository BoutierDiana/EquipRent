# Diccionario de datos v0.1 — EquipRent (Clase 04)

## equipo
| Atributo | Significado | Obligatorio | Rol | Dominio/regla | Origen |
|---|---|---|---|---|---|
| equipo_id | Identificador técnico del tipo de equipo | Sí: identifica la fila | PK | autogenerado | Diseño |
| categoria_id | Categoría del catálogo a la que pertenece | Sí: todo equipo se clasifica | FK | debe existir y estar activa | RF-01 |
| codigo | Código comercial del equipo (EQ-TAL-001) | Sí | UQ | letras, números y guion; se guarda en mayúsculas | RF-01 |
| nombre | Nombre visible en catálogo | Sí | — | no vacío, ≤120 | RF-01, móvil "catálogo" |
| marca | Fabricante | No: equipos genéricos no la tienen | — | ≤60 | RF-01 |
| modelo | Modelo del fabricante | No | — | ≤60 | RF-01 |
| descripcion | Texto libre de accesorios/uso | No | — | texto | RF-01 |
| activo | Si admite nuevas unidades y reservas | Sí | — | boolean | RF-01 |
| created_at / updated_at | Auditoría mínima | Sí | — | instante | L (trazabilidad) |

## unidad_equipo
| Atributo | Significado | Obligatorio | Rol | Dominio/regla | Origen |
|---|---|---|---|---|---|
| unidad_id | Identificador técnico de la unidad física | Sí | PK | autogenerado | Diseño |
| equipo_id | Tipo de equipo al que pertenece | Sí: no hay unidad sin tipo | FK | debe existir | RN-01, RF-02 |
| codigo_unidad | Etiqueta física pegada al activo | Sí | UQ global | letras, números, guion | RN-01 |
| numero_serie | Serie del fabricante | No: herramientas menores no tienen | UQ | ≤80 | RF-02 |
| estado | Situación física actual | Sí | CK | DISPONIBLE, ENTREGADA, EN_INSPECCION, MANTENIMIENTO, BLOQUEADA, BAJA | RN-01, RN-07 |
| fecha_adquisicion | Día de compra | No: activos antiguos sin registro | — | no futura | RF-15 |
| valor_referencial | Valor para estimar daños | No | — | NUMERIC(12,2) ≥ 0 | RF-13 |
| observacion | Nota operativa | No | — | texto | RF-02 |

## cliente
| Atributo | Significado | Obligatorio | Rol | Dominio/regla | Origen |
|---|---|---|---|---|---|
| cliente_id | Identificador técnico | Sí | PK | — | Diseño |
| usuario_id | Cuenta móvil del cliente | No: no todos usan la app | FK, UQ | — | I (móvil) |
| numero_documento | CI/NIT | Sí | UQ | no vacío | RF-04 |
| nombre_completo | Nombre o razón social | Sí | — | ≤160 | RF-04 |
| email | Correo | No | UQ | formato email | RF-04 |
| telefono | Contacto | No | — | ≤30 | RF-04 |

## reserva
| Atributo | Significado | Obligatorio | Rol | Dominio/regla | Origen |
|---|---|---|---|---|---|
| reserva_id | Identificador técnico | Sí | PK | — | Diseño |
| codigo | Código visible para el cliente | Sí | UQ | RES-AAAA-NNNN | RF-16 |
| cliente_id | Quién reserva | Sí | FK | — | RF-06 |
| fecha_inicio / fecha_fin | Rango reservado | Sí | CK | fin > inicio | RN-03 |
| estado | Ciclo de vida | Sí | CK | PENDIENTE, CONFIRMADA, EN_CURSO, FINALIZADA, CANCELADA | RF-08 |
| motivo_cancelacion | Por qué se canceló | Condicional | CK | obligatorio si CANCELADA | RN-09 |

## reserva_detalle
| Atributo | Significado | Obligatorio | Rol | Dominio/regla | Origen |
|---|---|---|---|---|---|
| reserva_id | Reserva | Sí | FK, UQ compuesta | — | RF-06 |
| unidad_id | Unidad reservada | Sí | FK, UQ compuesta | sin solapes (RN-02) | RF-06, RF-07 |
| tarifa_id | Tarifa usada | No | FK | — | RF-03 |
| precio_aplicado | Precio congelado | Sí | CK | ≥ 0 | RF-03 |
