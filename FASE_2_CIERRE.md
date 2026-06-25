# Cierre Formal de la Fase 2: Modelo de Datos para Supabase

Este documento certifica el cierre formal de la **Fase 2** del proyecto **Seguimiento de Proyectos Cooperativa** (Vite + React + TS), habiendo diseñado y validado con éxito el esquema físico relacional para Supabase PostgreSQL sin alterar el código de la maqueta funcional de la Fase 1.

---

## 1. Información General del Proyecto
* **Nombre del Proyecto**: Mini App de Seguimiento de Proyectos de Cooperativa
* **Líder BPMO**: Jefa de Planificación (Patricia Silva)
* **Sponsor Ejecutivo**: Gerente General (Dr. Roberto Ortiz)

---

## 2. Objetivo de la Fase 2
El objetivo de esta fase consistió en diseñar el modelo de base de datos relacional físico para Supabase PostgreSQL, abstrayendo los tipos y la información en memoria de la Fase 1, estructurando los scripts DDL y DML requeridos, y documentando todas las decisiones técnicas de diseño sin alterar el funcionamiento en memoria del frontend React.

---

## 3. Alcance Implementado
Se ha completado el diseño del esquema de la base de datos PostgreSQL, implementado scripts de inicialización y poblamiento de datos seed, y actualizado la documentación de arquitectura del proyecto. Todo bajo un enfoque riguroso de trazabilidad de datos corporativa.

---

## 4. Archivos Creados y Modificados
* **`[NEW]`** `supabase/schema.sql`: Script DDL con la creación de tablas, triggers automáticos para `updated_at`, índices de rendimiento y restricciones.
* **`[NEW]`** `supabase/seed.sql`: Script transaccional con la carga de datos de prueba realistas para 4 proyectos, bitácora de avances, tareas Kanban, actas de reuniones, compromisos, tiempos y evidencias.
* **`[NEW]`** `FASE_2_PLAN.md`: Plan de control de calidad relacional y metodologías de diseño para la Fase 2.
* **`[NEW]`** `FASE_2_CIERRE.md`: Este documento de cierre formal.
* **`[MODIFY]`** `DATA_MODEL.md`: Documento maestro de arquitectura de datos actualizado con los diagramas ER de base física y diccionario de datos.

---

## 5. Modelo de Datos Diseñado y Tablas Creadas
El modelo consta de **12 tablas** en el esquema `public`:
1. **`roles`**: Catálogo funcional de roles del sistema (`admin`, `leader`, `viewer`).
2. **`profiles`**: Información extendida de los usuarios (líderes, sponsors) mapeada a perfiles.
3. **`projects`**: Tabla maestra de proyectos, incluyendo campos de eliminación lógica.
4. **`project_advances`**: Bitácora histórica con porcentaje de progreso (`0-100`).
5. **`project_items`**: Tareas, requerimientos y backlog del tablero Kanban.
6. **`project_meetings`**: Minutas y detalles de reuniones y comités.
7. **`meeting_attendees`**: Tabla intermedia de muchos a muchos para el quorum de reuniones.
8. **`meeting_commitments`**: Compromisos y entregas asignadas con fecha límite.
9. **`time_logs`**: Registro diario de horas trabajadas vinculadas a tareas.
10. **`project_risks`**: Control de amenazas (Riesgos) e incidentes críticos (Bloqueos).
11. **`project_evidence`**: Evidencias y entregables adjuntos por URL.
12. **`audit_logs`**: Bitácora simplificada de cambios de estados en formato JSONB.

---

## 6. Relaciones Principales
El modelo relacional mantiene la integridad de datos a través de las siguientes dependencias clave:
* Los proyectos (`projects`) se asocian a un responsable en `profiles(id)`.
* Avances, tareas, reuniones, riesgos y evidencias tienen llaves foráneas directas hacia `projects(id)`.
* Las evidencias se enlazan de forma polimórfica y excluyente a bitácoras, tareas, reuniones, compromisos o riesgos.
* El registro de horas de trabajo (`time_logs`) une al usuario con la tarea específica (`project_items(id)`).

---

## 7. Decisiones Técnicas Aplicadas
Habiendo alineado el diseño con las regulaciones institucionales de la cooperativa, se aplicaron las siguientes directrices técnicas obligatorias:

* **UUID como Identificador Técnico**: Todas las llaves primarias usan UUID de forma predeterminada (`default gen_random_uuid()`) para facilitar la replicación y compatibilidad con Supabase.
* **Código de Proyecto Independiente**: Se definió `project_code text unique not null` separado del ID técnico, asegurando códigos visibles como `PRJ-2026-001`.
* **Perfiles Mock sin Dependencia de Auth**: El seed utiliza perfiles estáticos simulados en `profiles` con UUIDs deterministas. Permite inicializar la base de datos sin obligar a la creación interactiva de usuarios reales de autenticación.
* **Esfuerzo en Horas (Sin Presupuesto)**: Se eliminaron campos financieros y de costos, gestionando la capacidad laboral mediante variables cuantitativas de horas (`estimated_effort_hours`, `estimated_hours`, `actual_hours`).
* **Evidencias con Restricción Excluyente**: Implementación de una restricción CHECK `check_only_one_parent` en `project_evidence` que impide asociar un mismo archivo de soporte a más de una entidad a la vez.
* **Triggers para `updated_at`**: Triggers PL/pgSQL automatizan el refresco de fechas de modificación en las tablas maestras.
* **Eliminación Lógica y `ON DELETE RESTRICT`**: Se inhabilitó el borrado físico automático en cascada. Todas las tablas secundarias tienen configurado `ON DELETE RESTRICT` al apuntar a `projects`. Para remover proyectos visualmente, se agregaron los campos `is_deleted`, `deleted_at` y `deleted_by` a la tabla `projects` para dar soporte a eliminación lógica de forma segura.

---

## 8. Restricciones Respetadas
Se cumplieron rigurosamente los lineamientos de no alteración de código y aislamiento:
* **Sin conexión Supabase en frontend**: React sigue consumiendo datos simulados locales.
* **Sin autenticación ni RLS**: No se crearon pantallas de login ni políticas de seguridad activa en base de datos.
* **Sin variables de entorno**: No se añadieron archivos `.env` ni credenciales del sistema.
* **Sin instalación de dependencias**: No se agregaron paquetes nuevos (`npm install` no fue ejecutado).
* **Sin cambios en React**: Ningún componente de la carpeta `/src` fue editado.

---

## 9. Observaciones Técnicas
* **Validación de Compilación**: Se ejecutó exitosamente el comando `npm run build` en el entorno React+TypeScript local, arrojando cero errores de importación o estructuración en el frontend.
* **Prueba de SQL Posterior**: La base de datos y el poblamiento del seed están listos a nivel sintáctico en PostgreSQL. Su ejecución e interacción real con el cliente de base de datos se validará una vez iniciada la Fase 3 en un contenedor o entorno de desarrollo de Supabase.

---

## 10. Pendientes para la Fase 3 (Próxima Fase)
Al iniciar la Fase 3 se deberán abordar las siguientes integraciones físicas:
1. Instalar el paquete `@supabase/supabase-js`.
2. Crear variables de entorno `.env.local` con las llaves de la API.
3. Crear el cliente de conexión Supabase en el frontend.
4. Implementar políticas de seguridad de nivel de fila (RLS) en PostgreSQL.
5. Desarrollar la pantalla de Login y configurar triggers para sincronizar `auth.users` con `profiles`.
6. Migrar el consumo de datos de `mockData.ts` hacia las llamadas API del cliente de Supabase.

---

## 11. Recomendación de Siguiente Paso
Aprobar formalmente este informe de cierre de la Fase 2 y autorizar el inicio de la Fase 3, donde se creará el proyecto en la consola de Supabase, se importará el esquema diseñado, y se procederá a codificar la conexión real con el frontend React de la mini app.
