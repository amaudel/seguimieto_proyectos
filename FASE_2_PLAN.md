# Plan de Implementación: Modelo de Datos para Supabase (Fase 2)

Este documento detalla el plan, alcance, decisiones y criterios de aceptación establecidos para la **Fase 2** del proyecto **Seguimiento de Proyectos Cooperativa**.

---

## 🎯 Objetivo de la Fase 2
Diseñar, estructurar e implementar el modelo de base de datos relacional físico para Supabase PostgreSQL partiendo de la maqueta y los requerimientos funcionales aprobados en la Fase 1, sin alterar el funcionamiento en memoria del frontend React.

---

## 🛠️ Alcance y Entregables Aprobados
En esta fase se definieron e implementaron de forma exclusiva los siguientes entregables técnicos:

1. **`supabase/schema.sql`**: Script DDL completo con la definición de tablas, tipos, enums, llaves primarias/foráneas, índices, restricciones CHECK y triggers automáticos de auditoría.
2. **`supabase/seed.sql`**: Script DML para poblar el modelo relacional con datos de prueba realistas correspondientes a los 4 proyectos de la cooperativa maquetados en la Fase 1.
3. **`DATA_MODEL.md`**: Documentación integral del diccionario de datos físico, diagramas de relación (Mermaid) y justificaciones de diseño técnico.
4. **`FASE_2_PLAN.md`**: Este plan que documenta la gobernanza, decisiones aplicadas y criterios de aceptación.

---

## 🚫 Restricciones Críticas Aplicadas (Fase 2)
Para mantener el desarrollo controlado y no comprometer la estabilidad local, se aplicaron estrictamente las siguientes prohibiciones:
* **Sin integración frontend**: No se modificó ningún componente, tipo ni archivo de la aplicación React.
* **Sin conexión a Supabase**: La aplicación web continúa consumiendo datos simulados en memoria desde `src/mockData.ts`.
* **Sin configuración de red / API**: No se crearon archivos de variables de entorno `.env` ni se inicializó el cliente de conexión SDK.
* **Sin instalación de dependencias**: No se ejecutaron comandos de instalación (`npm install`, `yarn`, `pnpm`, etc.) ni se agregaron paquetes al proyecto.
* **Sin políticas RLS reales**: Se definió la base de datos estructuralmente pero no se implementó seguridad de filas ni lógica RBAC de la Fase 3.
* **Sin dependencia de Auth**: El seed de base de datos no requiere la existencia previa ni la interacción con usuarios reales del módulo de autenticación de Supabase (`auth.users`).

---

## 📋 Ajustes Técnicos de Diseño Obligatorios

### 1. IDs Técnicos y Código Institucional
* Las tablas principales usan **UUID** autogenerados (`id uuid primary key default gen_random_uuid()`) como identificador técnico interno para garantizar la escalabilidad y compatibilidad de base de datos.
* El código visible institucional de cada proyecto se maneja a través de un campo independiente: `project_code text unique not null` (ej: `PRJ-2026-001`), permitiendo desvincular la visualización para el usuario de la lógica técnica relacional.

### 2. Mock de Perfiles y Auth Desacoplado
* Se preparó la tabla `profiles` para futura compatibilidad con `auth.users` de Supabase.
* El archivo `seed.sql` inicializa perfiles de prueba de la cooperativa asignándoles UUIDs estáticos predecibles. Esto permite que el seed se ejecute autónomamente sin obligar a la creación interactiva de cuentas de acceso.
* Los campos de auditoría `created_by` y `updated_by` hacen referencia a estos perfiles mock estáticos.

### 3. Esfuerzo vs. Presupuesto Financiero
* Se eliminaron todas las columnas de presupuestos financieros, dinero o movimientos contables.
* El control se gestiona puramente a través del esfuerzo planificado y consumido medido en **horas**, utilizando los campos:
  * `estimated_effort_hours` (Proyectos)
  * `estimated_hours` y `actual_hours` (Actividades Kanban)
  * `actual_hours` (Registro detallado de tiempos diarios en `time_logs`)

### 4. Asociación de Evidencias Centralizada
* La tabla `project_evidence` permite enlazar soportes documentales a las siguientes entidades estratégicas:
  * Proyectos (`project_id`)
  * Avances de bitácora (`advance_id`)
  * Actividades Kanban (`activity_id`)
  * Reuniones / Minutas (`meeting_id`)
  * Compromisos pactados (`commitment_id`)
  * Riesgos y bloqueos identificados (`risk_id`)
* Se implementó una **restricción CHECK excluyente** (`check_only_one_parent`) para asegurar que un registro de evidencia pertenezca únicamente a una entidad específica a la vez (evitando ambigüedades relacionales).

### 5. Auditoría y Automatización de Tiempos
* Todas las tablas operativas cuentan con columnas de auditoría mínima: `created_at`, `created_by`, `updated_at`, `updated_by`.
* Se configuraron triggers automáticos en PostgreSQL vinculados a la función `update_updated_at_column()` para actualizar el campo `updated_at` al momento de modificar cualquier fila.

### 6. Trazabilidad e Integridad de Datos (Evitar Cascade Deletes)
* Se eliminó el borrado físico automático en cascada (`ON DELETE CASCADE`) para las relaciones de entidades secundarias que apuntan al proyecto, configurando en su lugar `ON DELETE RESTRICT` para salvaguardar el historial.
* Se incorporaron columnas de eliminación lógica (`is_deleted`, `deleted_at`, `deleted_by`) en `projects` para permitir remover elementos del panel visual a nivel de software sin destruir la base de datos subyacente.

---

## 📈 Criterios de Aceptación
Esta Fase 2 se considera satisfactoriamente completada al validar que:
1. Los archivos SQL (`schema.sql` y `seed.sql`) compilen y puedan ser importados/ejecutados en PostgreSQL sin errores relacionales.
2. Los datos cargados por el seed reflejen fielmente los estados, horas y descripciones operativas de la cooperativa definidas en la maqueta de la Fase 1.
3. Las variables de esfuerzo y tiempos estén correctamente documentadas en formato numérico entero de horas.
4. El servidor de desarrollo React continúe levantando en `http://localhost:5173/` de manera exitosa a partir de los datos mock en memoria.
