# EquipRent — Modelo conceptual v0.1 (Clase 02)

Proyecto oficial: **15. EquipRent — Alquiler de Equipos, Reservas, Entregas, Devoluciones y Daños**
Frontera: sin tablas, sin SQL, sin JPA.

## 1. Inventario conceptual

| Candidato | Clasificación | ¿Por qué? | Fuente |
|---|---|---|---|
| Cliente | Entidad | Tiene identidad (documento), datos propios y reservas. | C, F, RF-04 |
| CategoriaEquipo | Entidad (catálogo) | Agrupa equipos; se configura por el administrador. | F, RF-01 |
| Equipo | Entidad | Tipo/modelo del catálogo (ej. "Taladro 800W"). No se entrega físicamente. | F, RF-01 |
| UnidadEquipo | Entidad | Copia física concreta con código único y estado; es lo que se entrega. | RN-01, RF-02 |
| Tarifa | Entidad | Precio por unidad de tiempo con vigencia. | RF-03 |
| Reserva | Entidad | Intención de uso por rango de fechas con ciclo de estados. | RN-02..RN-05, RF-06 |
| ReservaDetalle | Entidad asociativa | Una reserva incluye varias unidades; una unidad aparece en muchas reservas. | RF-06 |
| Entrega | Entidad (evento) | Momento real de retiro; distinto de la reserva. | RN-04, RN-05, RF-09 |
| Devolucion | Entidad (evento) | Retorno físico con condición. | RN-06, RF-11 |
| Inspeccion | Entidad | Revisión técnica de una unidad. | RF-12 |
| Dano | Entidad | Daño detectado; puede bloquear la unidad. | RN-07, RF-13 |
| Mantenimiento | Entidad | Periodo en que la unidad no está disponible. | RF-14 |
| Deposito | Entidad | Garantía registrada operativamente, sin pasarela. | RN-08, RF-10 |
| Usuario / Rol | Entidad | Cuentas y permisos de los actores. | C, F |
| Auditoria | Entidad | Traza de quién hizo qué y cuándo. | RF-18, L |
| HistorialEstadoUnidad | Entidad | Historial del activo que no se elimina. | RN-10, RF-15 |
| Administrador, Operador, Técnico, Supervisor | Actor / Rol | Se representan como filas de Rol, no como tablas. | C |
| Estado de unidad / de reserva | Estado | Atributo con conjunto cerrado, no entidad. | RN-01, RF-08 |
| Disponibilidad | Resultado derivado | Se calcula por rango de fechas; no se guarda. | RN-03, RF-05 |
| Dashboard / utilización | Resultado derivado | Consulta agregada. | RF-17 |

## 2. Atributos conceptuales (núcleo)
- **Equipo**: código (único), nombre, marca, modelo, descripción, categoría, activo.
- **UnidadEquipo**: código de unidad (único, RN-01), número de serie, estado, fecha de adquisición, valor referencial, observación.
- **Cliente**: número de documento (único), nombre, email, teléfono, dirección, activo.
- **Reserva**: código, fecha inicio, fecha fin, estado, motivo de cancelación.
- **ReservaDetalle**: precio aplicado (congelado al reservar).
- **Entrega**: fecha/hora, autorización excepcional, autorizador.
- **Devolucion**: fecha/hora, observación.
- **Inspeccion**: condición, observación, técnico, fecha.
- **Dano**: descripción, severidad, bloquea unidad, costo estimado, estado.
- **Deposito**: monto, método, estado, referencia.

## 3. Relaciones y cardinalidades
| Relación | Frase del negocio | Cardinalidad |
|---|---|---|
| CategoriaEquipo – Equipo | Una categoría agrupa muchos equipos; cada equipo pertenece a una categoría. | 1 : N |
| **Equipo – UnidadEquipo** | **Un equipo tiene muchas unidades físicas; cada unidad es de un solo equipo.** | **1 : N (par elegido)** |
| Equipo – Tarifa | Un equipo tiene varias tarifas (día, semana); cada tarifa es de un equipo. | 1 : N |
| Cliente – Reserva | Un cliente hace muchas reservas; cada reserva es de un cliente. | 1 : N |
| Reserva – UnidadEquipo | Una reserva incluye varias unidades; una unidad está en muchas reservas en distintas fechas. | N : M (ReservaDetalle) |
| Reserva – Entrega | Una reserva puede no entregarse aún; como máximo una entrega. | 1 : 0..1 |
| Reserva – Devolucion | Igual que entrega. | 1 : 0..1 |
| Reserva – Deposito | Una reserva puede tener varios movimientos de depósito. | 1 : 0..N |
| Devolucion – Inspeccion | Una devolución genera una inspección por unidad devuelta. | 1 : N |
| UnidadEquipo – Dano | Una unidad acumula muchos daños. | 1 : N |
| UnidadEquipo – Mantenimiento | Una unidad tiene muchos mantenimientos. | 1 : N |
| UnidadEquipo – HistorialEstado | Una unidad tiene muchos cambios de estado. | 1 : N |
| Usuario – Rol | Un usuario tiene varios roles y un rol varios usuarios. | N : M (UsuarioRol) |
| Cliente – Usuario | Un cliente puede tener una cuenta móvil. | 0..1 : 0..1 |

## 4. Reglas de integridad conceptuales
- RN-01: cada unidad tiene código único y estado obligatorio.
- RN-02 / RN-03: una unidad no puede estar en dos reservas activas cuyos rangos se crucen.
- RN-04: reservar no cambia el estado físico de la unidad; entregar sí.
- RN-05: sólo se entrega una reserva CONFIRMADA o con autorización excepcional.
- RN-07: un daño puede dejar la unidad BLOQUEADA.
- RN-09: una reserva CANCELADA no cuenta para disponibilidad.
- RN-10: el historial no se elimina.

## 5. Dudas / decisiones
- D-01: ¿La tarifa se asocia al Equipo o a la Categoría? **Decisión:** al Equipo (precio por modelo).
- D-02: ¿Se permite alquilar por horas? **Supuesto:** sí, la tarifa admite HORA/DIA/SEMANA/MES.
- D-03: ¿La unidad tiene estado RESERVADA? **Decisión:** no; la reserva es por fechas (RN-03, RN-04).

## 6. Par 1:N seleccionado para el backend (Cap. 01–07)
**Equipo (padre) 1 : N UnidadEquipo (dependiente)**, porque la ficha exige distinguir el tipo del catálogo de la unidad física que se entrega (pregunta de defensa: "Diferencie Equipo y UnidadEquipo").
