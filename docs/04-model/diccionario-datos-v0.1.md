# Diccionario de Datos v0.1 — EquipRent

## 1. Tabla: `cliente`
| Campo | Significado en el Dominio | Obligatorio | PK / FK / UQ | Dominio / Regla | Origen |
|---|---|---|---|---|---|
| `cliente_id` | Identificador técnico sustituto del cliente. | Sí (NN) | **PK** | UUID / BIGINT estable. | Diseño técnico |
| `tipo_documento` | Tipo de acreditación legal del cliente. | Sí (NN) | **UQ (Compuesta)** | `'DNI'`, `'CI'`, `'NIT'`, `'PASAPORTE'` | RF-04 |
| `numero_documento` | Número oficial de identidad del cliente. | Sí (NN) | **UQ (Compuesta)** | Cadena alfanumérica sin espacios. | RF-04 |
| `nombre_completo` | Nombres y apellidos o razón social. | Sí (NN) | Ninguno | Texto no vacío. | RF-04 |
| `telefono` | Número telefónico principal de contacto. | Sí (NN) | Ninguno | Formato numérico / E.164. | RF-04 |
| `email` | Correo electrónico para notificaciones y contrato. | Sí (NN) | Ninguno | Formato de correo válido. | RF-04 |
| `estado_credito` | Condición comercial para autorizar alquileres. | Sí (NN) | Ninguno | `'HABILITADO'`, `'BLOQUEADO'` | RF-04 |

---

## 2. Tabla: `equipo` (Modelo / Catálogo)
| Campo | Significado en el Dominio | Obligatorio | PK / FK / UQ | Dominio / Regla | Origen |
|---|---|---|---|---|---|
| `equipo_id` | Identificador técnico del modelo de equipo. | Sí (NN) | **PK** | UUID / BIGINT estable. | Diseño técnico |
| `categoria_equipo_id` | Categoría a la que pertenece el modelo. | Sí (NN) | **FK** -> `categoria_equipo` | Clave foránea válida. | RF-01 |
| `codigo_modelo` | Código de catálogo o SKU comercial. | Sí (NN) | **UQ (Global)** | Texto único (ej. `TAL-BOSCH-750`). | RF-01 |
| `nombre` | Nombre comercial del modelo. | Sí (NN) | Ninguno | Texto no vacío. | RF-01 |
| `marca` | Fabricante del equipo. | Sí (NN) | Ninguno | Texto no vacío. | RF-01 |
| `descripcion` | Ficha técnica y especificaciones. | No (NULL) | Ninguno | Texto descriptivo opcional. | RF-01 |
| `deposito_base_sugerido` | Monto base sugerido de garantía. | Sí (NN) | Ninguno | Valor decimal > 0. | RF-01, RN-08 |

---

## 3. Tabla: `unidad_equipo` (Ejemplar Físico Individual)
| Campo | Significado en el Dominio | Obligatorio | PK / FK / UQ | Dominio / Regla | Origen |
|---|---|---|---|---|---|
| `unidad_equipo_id` | Identificador técnico del activo físico. | Sí (NN) | **PK** | UUID / BIGINT estable. | Diseño técnico |
| `equipo_id` | Modelo de catálogo al que corresponde la unidad. | Sí (NN) | **FK** -> `equipo` | Clave foránea válida. | RN-01, RF-02 |
| `numero_serie` | Serie de fábrica o placa patrimonial física. | Sí (NN) | **UQ (Global)** | Texto alfanumérico irrepetible. | RN-01, RF-02 |
| `estado_operativo` | Estado operativo actual del activo. | Sí (NN) | Ninguno | `'DISPONIBLE'`, `'RESERVADA'`, `'EN_USO'`, `'EN_MANTENIMIENTO'`, `'DE_BAJA'` | RN-01, RN-07 |
| `metrica_uso_acumulada`| Horómetro, kilometraje o contador acumulado. | Sí (NN) | Ninguno | Valor decimal >= 0. | RF-02, RF-15 |
| `notas_estado` | Observaciones estéticas o mecánicas previas. | No (NULL) | Ninguno | Texto libre. | RF-02 |

---

## 4. Tabla: `reserva`
| Campo | Significado en el Dominio | Obligatorio | PK / FK / UQ | Dominio / Regla | Origen |
|---|---|---|---|---|---|
| `reserva_id` | Identificador técnico de la reserva. | Sí (NN) | **PK** | UUID / BIGINT estable. | Diseño técnico |
| `codigo_reserva` | Código alfanumérico visible para el cliente. | Sí (NN) | **UQ (Global)** | Cadena única (ej. `RES-2026-0089`). | RF-06 |
| `cliente_id` | Cliente que solicita y asume la reserva. | Sí (NN) | **FK** -> `cliente` | Clave foránea válida. | RF-04, RF-06 |
| `usuario_creador_id` | Operador que registró la reserva. | Sí (NN) | **FK** -> `usuario` | Clave foránea válida. | RF-06, RF-18 |
| `fecha_inicio_programada` | Momento de inicio pactado para el alquiler. | Sí (NN) | Ninguno | Fecha/hora válida. | RN-02, RN-03 |
| `fecha_fin_programada` | Momento de fin pactado para el alquiler. | Sí (NN) | Ninguno | Fecha/hora > `fecha_inicio_programada`. | RN-02, RN-03 |
| `estado` | Estado dentro del ciclo de vida de la reserva. | Sí (NN) | Ninguno | `'CREADA'`, `'CONFIRMADA'`, `'CANCELADA'`, `'COMPLETADA'` | RN-04, RN-09 |

---

## 5. Tabla: `reserva_detalle` (Tabla Puente N:M)
| Campo | Significado en el Dominio | Obligatorio | PK / FK / UQ | Dominio / Regla | Origen |
|---|---|---|---|---|---|
| `reserva_detalle_id` | Identificador técnico de la línea de detalle. | Sí (NN) | **PK** | UUID / BIGINT estable. | Diseño técnico |
| `reserva_id` | Reserva a la que pertenece este ítem. | Sí (NN) | **FK** -> `reserva`, **UQ (Compuesta)** | Clave foránea válida. | RF-06 |
| `unidad_equipo_id` | Unidad física específica comprometida. | Sí (NN) | **FK** -> `unidad_equipo`, **UQ (Compuesta)** | Clave foránea válida. | RN-02, RF-06 |
| `tarifa_id` | Tarifa seleccionada al momento del pacto. | Sí (NN) | **FK** -> `tarifa` | Clave foránea válida. | RF-03 |
| `precio_pactado` | Precio unitario congelado para el contrato. | Sí (NN) | Ninguno | Valor decimal >= 0. | RF-06 |

---

## 6. Tabla: `deposito`
| Campo | Significado en el Dominio | Obligatorio | PK / FK / UQ | Dominio / Regla | Origen |
|---|---|---|---|---|---|
| `deposito_id` | Identificador técnico del registro de garantía. | Sí (NN) | **PK** | UUID / BIGINT estable. | Diseño técnico |
| `reserva_id` | Reserva asociada que garantiza. | Sí (NN) | **FK** -> `reserva`, **UQ (Global)** | Clave foránea única (1:1). | RN-08, RF-10 |
| `monto_recibido` | Importe total recibido como respaldo. | Sí (NN) | Ninguno | Valor decimal >= 0. | RN-08, RF-10 |
| `monto_retenido_danos`| Importe deducido por penalizaciones o averías. | Sí (NN) | Ninguno | Valor decimal >= 0 (Default: 0). | RN-07, RN-08 |
| `monto_devuelto` | Importe liquidado y reintegrado al cliente. | Sí (NN) | Ninguno | Valor decimal >= 0 (Default: 0). | RN-08 |
| `estado` | Estado de la custodia financiera. | Sí (NN) | Ninguno | `'EN_CUSTODIA'`, `'RETENIDO_PARCIAL'`, `'RETENIDO_TOTAL'`, `'LIQUIDADO'` | RN-08 |

---

## 7. Tabla: `entrega` (Despacho Físico)
| Campo | Significado en el Dominio | Obligatorio | PK / FK / UQ | Dominio / Regla | Origen |
|---|---|---|---|---|---|
| `entrega_id` | Identificador técnico del acta de despacho. | Sí (NN) | **PK** | UUID / BIGINT estable. | Diseño técnico |
| `reserva_id` | Reserva formal que habilita la entrega. | Sí (NN) | **FK** -> `reserva`, **UQ (Global)** | Clave foránea única (1:1). | RN-05, RF-09 |
| `usuario_operador_id` | Operador que entrega físicamente el activo. | Sí (NN) | **FK** -> `usuario` | Clave foránea válida. | RF-09 |
| `fecha_hora_salida` | Momento exacto de retiro de almacén. | Sí (NN) | Ninguno | Fecha/hora válida. | RN-04, RF-09 |
| `metrica_salida` | Horómetro u odómetro al momento del retiro. | Sí (NN) | Ninguno | Valor decimal >= 0. | RF-09 |
| `observaciones_salida`| Notas al momento de entregar el equipo. | No (NULL) | Ninguno | Texto descriptivo opcional. | RF-09 |

---

## 8. Tabla: `devolucion` (Retorno Físico)
| Campo | Significado en el Dominio | Obligatorio | PK / FK / UQ | Dominio / Regla | Origen |
|---|---|---|---|---|---|
| `devolucion_id` | Identificador técnico del acta de retorno. | Sí (NN) | **PK** | UUID / BIGINT estable. | Diseño técnico |
| `entrega_id` | Entrega previa que concluye con este retorno. | Sí (NN) | **FK** -> `entrega`, **UQ (Global)** | Clave foránea única (1:1). | RN-06, RF-11 |
| `usuario_operador_id` | Operador que recepciona el equipo en almacén. | Sí (NN) | **FK** -> `usuario` | Clave foránea válida. | RF-11 |
| `fecha_hora_retorno` | Momento exacto del ingreso físico. | Sí (NN) | Ninguno | Fecha/hora >= `fecha_hora_salida`. | RN-06, RF-11 |
| `metrica_retorno` | Horómetro u odómetro al retornar. | Sí (NN) | Ninguno | Valor decimal >= `metrica_salida`. | RF-11 |
| `observaciones_retorno`| Comentarios generales del operador. | No (NULL) | Ninguno | Texto descriptivo opcional. | RF-11 |

---

## 9. Tabla: `inspeccion` (Peritaje Técnico)
| Campo | Significado en el Dominio | Obligatorio | PK / FK / UQ | Dominio / Regla | Origen |
|---|---|---|---|---|---|
| `inspeccion_id` | Identificador técnico del reporte de peritaje. | Sí (NN) | **PK** | UUID / BIGINT estable. | Diseño técnico |
| `devolucion_id` | Devolución sobre la que se realiza la revisión.| Sí (NN) | **FK** -> `devolucion`, **UQ (Global)**| Clave foránea única (1:1). | RN-06, RF-12 |
| `usuario_tecnico_id` | Técnico responsable del peritaje. | Sí (NN) | **FK** -> `usuario` | Clave foránea válida. | RF-12 |
| `resultado` | Veredicto del estado técnico del activo. | Sí (NN) | Ninguno | `'CONFORME'`, `'CON_OBSERVACIONES'`, `'DANADO'` | RN-06, RF-12 |
| `checklist_aprobado` | Indicador binario de superación de pruebas. | Sí (NN) | Ninguno | Booleano (`true` / `false`). | RF-12 |
| `observaciones` | Informe técnico del perito. | No (NULL) | Ninguno | Texto libre explicativo. | RF-12 |

---

## 10. Tabla: `dano`
| Campo | Significado en el Dominio | Obligatorio | PK / FK / UQ | Dominio / Regla | Origen |
|---|---|---|---|---|---|
| `dano_id` | Identificador técnico del siniestro. | Sí (NN) | **PK** | UUID / BIGINT estable. | Diseño técnico |
| `inspeccion_id` | Inspección técnica que detectó el daño. | Sí (NN) | **FK** -> `inspeccion` | Clave foránea válida. | RF-13 |
| `unidad_equipo_id` | Unidad física que sufrió la avería. | Sí (NN) | **FK** -> `unidad_equipo` | Clave foránea válida. | RN-07, RF-13 |
| `descripcion` | Detalle específico de la rotura o falla. | Sí (NN) | Ninguno | Texto no vacío. | RF-13 |
| `costo_estimado_reparacion`| Presupuesto económico de reparación. | Sí (NN) | Ninguno | Valor decimal >= 0. | RF-13 |
| `imputable_cliente` | Determina si se descuenta de la garantía. | Sí (NN) | Ninguno | Booleano (`true` / `false`). | RN-07, RN-08 |

---

## 11. Tabla: `mantenimiento`
| Campo | Significado en el Dominio | Obligatorio | PK / FK / UQ | Dominio / Regla | Origen |
|---|---|---|---|---|---|
| `mantenimiento_id` | Identificador técnico de la orden de taller. | Sí (NN) | **PK** | UUID / BIGINT estable. | Diseño técnico |
| `unidad_equipo_id` | Unidad física bloqueada en mantenimiento. | Sí (NN) | **FK** -> `unidad_equipo` | Clave foránea válida. | RN-07, RF-14 |
| `dano_id` | Daño originario si es correctivo. | No (NULL) | **FK** -> `dano` | Clave foránea opcional. | RN-07, RF-14 |
| `tipo` | Clasificación del ingreso a taller. | Sí (NN) | Ninguno | `'PREVENTIVO'`, `'CORRECTIVO'` | RF-14 |
| `fecha_ingreso` | Inicio del bloqueo de disponibilidad. | Sí (NN) | Ninguno | Fecha/hora válida. | RN-07, RF-14 |
| `fecha_egreso_estimada`| Proyección de egreso del taller. | Sí (NN) | Ninguno | Fecha/hora >= `fecha_ingreso`. | RF-14 |
| `fecha_egreso_real` | Momento exacto de liberación efectiva. | No (NULL) | Ninguno | Fecha/hora (NULL si sigue en taller).| RN-07, RF-14 |
| `estado` | Estado de la orden de mantenimiento. | Sí (NN) | Ninguno | `'EN_TALLER'`, `'FINALIZADO'`, `'CANCELADO'` | RF-14 |