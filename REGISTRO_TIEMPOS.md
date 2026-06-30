# Registro de Tiempos y Esfuerzo de Desarrollo

Este documento registra las horas de esfuerzo invertidas en el diseño, desarrollo y pruebas de la mini app **Seguimiento de Proyectos Cooperativa**. Sirve como bitácora oficial para reportar a gerencia el esfuerzo requerido para construir la aplicación.

---

## 📊 Resumen Consolidado de Esfuerzo

| Fase | Descripción | Estado | Horas Estimadas | Horas Reales | Desviación (Horas) | Desviación (%) |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **Fase 1** | Maqueta visual, Layout y Datos Mock | Completado | 10.0 | 8.5 | -1.5 | -15.0% |
| **Fase 2** | Modelo de Datos Físico y SQL | Completado | 5.0 | 4.0 | -1.0 | -20.0% |
| **Fase 3** | Integración de Supabase y Auth | Completado | 12.0 | 3.5 | -8.5 | -70.8% |
| **Fase 4A** | Validación Supabase y Vercel | Completado | 4.0 | 2.7 | -1.3 | -32.5% |
| **Fase 4B** | Seguridad, Autenticación y RLS | Completado | 4.0 | 2.5 | -1.5 | -37.5% |
| **Fase 4C** | Refactor y Mejoras Visuales UX | Completado | 6.0 | 4.8 | -1.2 | -20.0% |
| **Fase 4D** | Pulido Visual y QA Responsivo | Completado | 4.0 | 3.5 | -0.5 | -12.5% |
| **Fase 5A** | Formulario Guiado de Proyectos | Completado | 6.0 | 4.9 | -1.1 | -18.3% |
| **Fase 5B** | Creación de Avances del Proyecto | Completado | 5.0 | 3.9 | -1.1 | -22.0% |
| **Fase 5C** | Registro de Riesgos e Impedimentos | Completado | 5.0 | 4.0 | -1.0 | -20.0% |
| **Fase 5D** | Registro de Compromisos del Proyecto| Completado | 5.0 | 3.9 | -1.1 | -22.0% |
| **Fase 6A** | Estado Controlado de Compromisos | Completado | 4.0 | 3.2 | -0.8 | -20.0% |
| **Fase 6B** | Estado Controlado de Riesgos | Completado | 4.0 | 3.2 | -0.8 | -20.0% |
| **Fase 6C** | Gestión de Actividades del Proyecto | Completado | 5.0 | 4.0 | -1.0 | -20.0% |
| **Fase 6D** | Registro de Tiempos de Esfuerzo | Completado | 4.0 | 3.2 | -0.8 | -20.0% |
| **Fase 6E** | Gestión de Reuniones y Minutas | Completado | 5.0 | 4.0 | -1.0 | -20.0% |
| **Total** | **Gobernanza Completa del Proyecto** | **En Progreso**| **88.0** | **63.8** | -- | -- |

---

## 📝 Bitácora Detallada de Tareas y Horas

### Fase 1: Maqueta Visual y Componentes en Memoria
* **Fecha de Inicio**: 2026-06-23
* **Fecha de Fin**: 2026-06-25

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Inicialización del proyecto React + TS | 2026-06-23 | A. Delgado / AI | 1.5 | 1.0 | Finalizado | Estructura base de Vite, TS y Tailwind CSS. |
| Diseño de Layout y Menú Lateral | 2026-06-23 | A. Delgado / AI | 1.5 | 1.5 | Finalizado | Menú colapsable y navegación responsiva. |
| Dashboard Ejecutivo Inicial (KPIs) | 2026-06-24 | A. Delgado / AI | 2.0 | 2.0 | Finalizado | Tarjetas de semáforos e indicadores globales. |
| Detalle de Proyecto en Pestañas | 2026-06-24 | A. Delgado / AI | 3.0 | 2.5 | Finalizado | Pestañas de avances, Kanban, minutas, compromisos, tiempos y riesgos. |
| Ajustes de Pulido y Reporte Ejecutivo | 2026-06-25 | A. Delgado / AI | 2.0 | 1.5 | Finalizado | Separación de bloqueos y riesgos. Ficha Ejecutiva BPMO. |

---

### Fase 2: Diseño de Datos y SQL de Inicialización
* **Fecha de Inicio**: 2026-06-25
* **Fecha de Fin**: 2026-06-25

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Análisis de Tipos y Planificación | 2026-06-25 | A. Delgado / AI | 1.0 | 0.5 | Finalizado | Definición de las 12 tablas en base a mockData.ts. |
| Creación de Esquema Físico SQL | 2026-06-25 | A. Delgado / AI | 1.5 | 1.5 | Finalizado | `supabase/schema.sql`, UUIDs, FKs, triggers. |
| Creación de Datos de Prueba (Seed) | 2026-06-25 | A. Delgado / AI | 1.5 | 1.0 | Finalizado | `supabase/seed.sql` con 4 proyectos, minutas y tiempos. |
| Validación de Borrados y Eliminación Lógica | 2026-06-25 | A. Delgado / AI | 1.0 | 1.0 | Finalizado | Cambio a `ON DELETE RESTRICT` y campos en `projects`. |
| Documentación Técnica de Datos y Cierre | 2026-06-25 | A. Delgado / AI | 1.0 | 1.0 | Finalizado | `DATA_MODEL.md`, `FASE_2_PLAN.md` y `FASE_2_CIERRE.md`. |

---

### Fase 3: Integración de Supabase y Control de Sesión (Completado)
* **Fecha de Inicio**: 2026-06-25
* **Fecha de Fin**: 2026-06-25

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Instalación de SDK `@supabase/supabase-js` | 2026-06-25 | A. Delgado / AI | 1.0 | 0.5 | Finalizado | Configuración de dependencia en package.json. |
| Flexibilización de Tipos (`EntityId`) e IDs | 2026-06-25 | A. Delgado / AI | 2.5 | 1.5 | Finalizado | Normalización de `String(id)` en App.tsx, Dashboard y Lists. |
| Creación de Cliente Supabase y Fallback | 2026-06-25 | A. Delgado / AI | 2.0 | 0.5 | Finalizado | `supabaseClient.ts` y `.env.example` con fallback. |
| Creación de Capa de Servicios de Lectura | 2026-06-25 | A. Delgado / AI | 3.5 | 0.5 | Finalizado | `projectsService.ts` para las 7 entidades con joins. |
| Documentación de Integración y Vercel | 2026-06-25 | A. Delgado / AI | 3.0 | 0.5 | Finalizado | `FASE_3_PLAN.md`, `SUPABASE_INTEGRATION.md`, `VERCEL_DEPLOYMENT.md`. |

---

### Fase 4A: Validación de Supabase y Despliegue Demo en Vercel (Completado)
* **Fecha de Inicio**: 2026-06-25
* **Fecha de Fin**: 2026-06-25

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Creación de Plan y Guías Técnicas de Validación | 2026-06-25 | A. Delgado / AI | 1.0 | 1.0 | Finalizado | `FASE_4A_PLAN.md`, `FASE_4A_VALIDACION_SUPABASE.md`, `FASE_4A_DESPLIEGUE_VERCEL.md`. |
| Aplicación de Ajustes y Observaciones de Documentación | 2026-06-25 | A. Delgado / AI | 0.5 | 0.5 | Finalizado | Ajuste de consulta financiera global, bloques DO para excepciones y advertencias de seguridad en variables de entorno. |
| Corrección de error de sintaxis en seed.sql | 2026-06-25 | A. Delgado / AI | 0.1 | 0.1 | Finalizado | Corrección de error 42601 en la inserción de asistentes (tabla meeting_attendees) e inserción de bloque de limpieza seguro (TRUNCATE). |
| Validación de consultas y corrección de columna progress | 2026-06-25 | A. Delgado / AI | 0.1 | 0.1 | Finalizado | Corrección de consulta SQL y adición de evidencia de conteo relacional en FASE_4A_VALIDACION_SUPABASE.md. |
| Creación de plantilla .env.local para pruebas locales | 2026-06-25 | A. Delgado / AI | 0.1 | 0.1 | Finalizado | Creación del archivo .env.local en la raíz del proyecto para ingreso de credenciales de desarrollo. |
| Corrección relacional PostgREST en projectsService.ts | 2026-06-25 | A. Delgado / AI | 0.1 | 0.1 | Finalizado | Aplicación de desambiguación explícita mediante foreign keys en queries de lectura a Supabase para corregir error PGRST201. |
| Carga de schema.sql y seed.sql en Supabase | 2026-06-25 | A. Delgado / AI | 1.5 | 0.0 | Finalizado | Ejecución en consola web de Supabase (realizado por el usuario). |
| Ejecución de Consultas SQL de Validación | 2026-06-25 | A. Delgado / AI | 1.5 | 0.0 | Finalizado | Validación de conteos y restricciones (realizado por el usuario). |
| Carga segura de código y documentación a GitHub | 2026-06-25 | A. Delgado / AI | 0.5 | 0.3 | Finalizado | Push exitoso a través de API y limpieza de PATs temporales. |
| Diagnóstico y fallback defensivo ante BD vacía | 2026-06-26 | A. Delgado / AI | 0.5 | 0.5 | Finalizado | Implementación de fallback local en proyectos, avances, riesgos, etc., si la respuesta de Supabase es vacía. |

---

### Fase 4B: Seguridad, Autenticación y RLS (Completado)
* **Fecha de Inicio**: 2026-06-26
* **Fecha de Fin**: 2026-06-29

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Plan de Trabajo e Idempotencia SQL | 2026-06-26 | A. Delgado / AI | 0.5 | 0.5 | Finalizado | Creación del plan Fase 4B y migración `auth_rls_setup.sql`. |
| Componente Login React y Control de Sesión | 2026-06-29 | A. Delgado / AI | 1.5 | 1.2 | Finalizado | Creación de `Login.tsx` y wrapper de sesión en `App.tsx` que bloquea la app sin login. |
| Logout e Indicador Origen Datos (Fase 4B.1) | 2026-06-29 | A. Delgado / AI | 0.5 | 0.5 | Finalizado | Botón de cerrar sesión en Sidebar y banner superior dinámico visible tras iniciar sesión. |
| Pruebas de compilación | 2026-06-29 | A. Delgado / AI | 0.5 | 0.3 | Finalizado | Validación con `npm run build` exitosa. |
| Documentación Técnica de Auth y RLS | 2026-06-29 | A. Delgado / AI | 1.0 | 0.0 | Finalizado | Creación de `SUPABASE_AUTH_RLS.md` y guías. |

---

### Fase 4C: Refactor y Mejoras Visuales UX (Completado)
* **Fecha de Inicio**: 2026-06-29
* **Fecha de Fin**: 2026-06-29

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Stepper de Fases en Resumen | 2026-06-29 | A. Delgado / AI | 2.0 | 1.5 | Finalizado | Componente visual interactivo en Resumen de Proyecto basado en status. |
| Vista de Tarjetas Ejecutivas | 2026-06-29 | A. Delgado / AI | 2.5 | 2.0 | Finalizado | Alternador de vistas en ProjectList.tsx y maquetación de tarjetas con KPIs. |
| Caso de Negocio (beneficios cooperativos) | 2026-06-29 | A. Delgado / AI | 1.5 | 1.0 | Finalizado | Incorporación visual del Caso de Negocio sin alterar base de datos. |
| Validación final y build | 2026-06-29 | A. Delgado / AI | 0.5 | 0.3 | Finalizado | Pruebas de compilación exitosas. |

---

### Fase 4D: Pulido Visual, Responsive y QA Ejecutivo (Completado)
* **Fecha de Inicio**: 2026-06-29
* **Fecha de Fin**: 2026-06-29

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Plan de Trabajo e Inspección QA | 2026-06-29 | A. Delgado / AI | 0.5 | 0.5 | Finalizado | Creación de plan de trabajo y diagnóstico visual móvil/desktop. |
| Rediseño de Login Premium | 2026-06-29 | A. Delgado / AI | 1.5 | 1.0 | Finalizado | Fondo degradado, tarjeta esmerilada e iconos de campo (User/Lock). |
| Stepper Adaptativo Responsivo | 2026-06-29 | A. Delgado / AI | 1.5 | 1.2 | Finalizado | Vista horizontal centrada en desktop y vista compacta de paso en móviles. |
| Banner de Datos y Botón de Logout | 2026-06-29 | A. Delgado / AI | 0.5 | 0.5 | Finalizado | Rediseño de banner con icono Database y corrección de clase de color en Sidebar. |
| Verificación final y build de producción | 2026-06-29 | A. Delgado / AI | 0.5 | 0.3 | Finalizado | Testeo de responsividad y build de producción exitoso. |

---

### Fase 5A: Formulario Guiado para Nuevos Proyectos (Completado)
* **Fecha de Inicio**: 2026-06-29
* **Fecha de Fin**: 2026-06-29

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Diagnóstico, Plan y Migración SQL | 2026-06-29 | A. Delgado / AI | 0.5 | 0.5 | Finalizado | Inspección del esquema projects y creación de script `5a_business_case_columns.sql`. |
| Tipado TypeScript de Projects | 2026-06-29 | A. Delgado / AI | 1.0 | 0.8 | Finalizado | Actualización de interfaz Project en `types.ts` y mappers en `projectsService.ts`. |
| Wizard Component de Nuevos Proyectos | 2026-06-29 | A. Delgado / AI | 2.5 | 2.0 | Finalizado | Maquetación del wizard en 5 pasos controlado con validaciones de fechas y esfuerzo. |
| Integración de Auditoría y RLS | 2026-06-29 | A. Delgado / AI | 1.5 | 1.2 | Finalizado | Recuperación de profile_id asíncrona al iniciar sesión, control de ruteo y handler de inserción. |
| Testeo Local y Validación de Compilación | 2026-06-29 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Compilación exitosa con `npm run build` en 553ms sin advertencias. |

---

### Fase 5B: Creación de Avances del Proyecto (Completado)
* **Fecha de Inicio**: 2026-06-30
* **Fecha de Fin**: 2026-06-30

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Diagnóstico, RLS y Migraciones SQL | 2026-06-30 | A. Delgado / AI | 1.0 | 0.8 | Finalizado | Inspección del esquema `project_advances` y creación de scripts `5b_project_advances_fields.sql` y `5b_project_advances_rls.sql`. |
| Formulario de Nuevo Avance (Modal) | 2026-06-30 | A. Delgado / AI | 2.0 | 1.5 | Finalizado | Maquetación del componente modal controlado `NewAdvanceModal.tsx` con restricciones numéricas (0-100). |
| Integración de API y Callbacks | 2026-06-30 | A. Delgado / AI | 1.5 | 1.2 | Finalizado | Vinculación del handler de inserción con la prop `onAddAdvance` y el `userProfileId` de auditoría. |
| Compilación y Validación Final | 2026-06-30 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Ejecución de `npm run build` exitosa en 832ms para verificación de tipos. |

---

### Fase 5C: Registro de Riesgos e Impedimentos (Completado)
* **Fecha de Inicio**: 2026-06-30
* **Fecha de Fin**: 2026-06-30

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Diagnóstico de Esquema y SQL RLS | 2026-06-30 | A. Delgado / AI | 1.0 | 0.8 | Finalizado | Inspección del esquema `project_risks` en schema.sql, confirmación de assignee_id y type, y creación del script RLS `5c_project_risks_rls.sql`. |
| Formulario de Nuevo Riesgo (Modal) | 2026-06-30 | A. Delgado / AI | 2.0 | 1.6 | Finalizado | Maquetación del componente modal controlado `NewRiskModal.tsx` con dropdowns para tipo, impacto, probabilidad y estado conformes con los CHECK constraints. |
| Integración de API y Callback en App | 2026-06-30 | A. Delgado / AI | 1.5 | 1.2 | Finalizado | Implementación del helper `createProjectRisk` y vinculación del callback `onAddRisk` para refresco reactivo del listado en el detalle. |
| Compilación y Corrección Linter | 2026-06-30 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Ejecución exitosa de `npm run build` en 607ms solucionando advertencias de imports no utilizados. |

---

### Fase 5D: Registro de Compromisos del Proyecto (Completado)
* **Fecha de Inicio**: 2026-06-30
* **Fecha de Fin**: 2026-06-30

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Diagnóstico de Esquema y SQL RLS | 2026-06-30 | A. Delgado / AI | 1.0 | 0.8 | Finalizado | Inspección del esquema `meeting_commitments` en schema.sql, confirmación de assignee_id y project_id, y creación del script RLS `5d_project_commitments_rls.sql`. |
| Formulario de Nuevo Compromiso (Modal) | 2026-06-30 | A. Delgado / AI | 2.0 | 1.5 | Finalizado | Maquetación del componente modal controlado `NewCommitmentModal.tsx` con dropdowns para responsables (Profiles), validación de fecha límite en el futuro y panel de auditoría. |
| Integración de API y Callback en App | 2026-06-30 | A. Delgado / AI | 1.5 | 1.2 | Finalizado | Implementación del helper `createProjectCommitment` y vinculación del callback `onAddCommitment` para refresco reactivo del listado en el detalle. |
| Compilación y Corrección Linter | 2026-06-30 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Ejecución exitosa de `npm run build` en 409ms solucionando advertencias de imports de lucide-react. |

---

### Fase 6A: Actualización Controlada de Estado de Compromisos (Completado)
* **Fecha de Inicio**: 2026-06-30
* **Fecha de Fin**: 2026-06-30

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Diagnóstico de Esquema y SQL RLS | 2026-06-30 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Inspección del trigger de updated_at de la tabla `meeting_commitments` y creación del script RLS `6a_project_commitments_update_rls.sql`. |
| Modal de Cambio de Estado (React) | 2026-06-30 | A. Delgado / AI | 1.5 | 1.2 | Finalizado | Maquetación del componente modal controlado `CommitmentStatusModal.tsx` con reglas opcionales/obligatorias de notas para Cumplido y Vencido. |
| Integración de API y Callbacks | 2026-06-30 | A. Delgado / AI | 1.5 | 1.2 | Finalizado | Vinculación del dropdown select en la tabla con la función `updateProjectCommitmentStatus` e integración del callback `onUpdateCommitment`. |
| Compilación y Validación Final | 2026-06-30 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Ejecución exitosa de `npm run build` en 640ms solucionando errores de tipo de variables en ProjectDetail.tsx. |

---

### Fase 6B: Actualización Controlada de Estado de Riesgos e Impedimentos (Completado)
* **Fecha de Inicio**: 2026-06-30
* **Fecha de Fin**: 2026-06-30

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Diagnóstico de Esquema y SQL RLS | 2026-06-30 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Inspección del trigger de updated_at de la tabla `project_risks` y creación del script RLS `6b_project_risks_update_rls.sql`. |
| Modal de Cambio de Estado (React) | 2026-06-30 | A. Delgado / AI | 1.5 | 1.2 | Finalizado | Maquetación del componente modal controlado `RiskStatusModal.tsx` con reglas opcionales/obligatorias de notas para Mitigado y Cerrado. |
| Integración de API y Reversión UX | 2026-06-30 | A. Delgado / AI | 1.5 | 1.2 | Finalizado | Vinculación del dropdown select en la tabla con `updateProjectRiskStatus` con mecanismo de fallback de reversión si falla el API. |
| Compilación y Validación Final | 2026-06-30 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Ejecución exitosa de `npm run build` en 443ms garantizando la robustez de los callbacks. |

---

### Fase 6C: Gestión de Actividades del Proyecto (Completado)
* **Fecha de Inicio**: 2026-06-30
* **Fecha de Fin**: 2026-06-30

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Diagnóstico de Esquema y SQL RLS | 2026-06-30 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Verificación física de description y progress_pct en schema.sql, e implementación del script RLS `6c_project_items_rls.sql`. |
| Formulario de Nueva Actividad (Modal) | 2026-06-30 | A. Delgado / AI | 2.0 | 1.6 | Finalizado | Maquetación del componente modal controlado `NewActivityModal.tsx` forzando la asignación obligatoria del responsable y validación de horas estimadas. |
| Integración de API y Callbacks | 2026-06-30 | A. Delgado / AI | 2.0 | 1.6 | Finalizado | Implementación de createProjectActivity, updateProjectActivityStatus y vinculación con la UI y dropdown select interactivo con reversión en caso de error. |
| Compilación y Validación Final | 2026-06-30 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Ejecución exitosa de `npm run build` en 696ms con cero errores en types.ts y componentes. |

---

### Fase 6D: Registro Controlado de Tiempos de Esfuerzo (Completado)
* **Fecha de Inicio**: 2026-06-30
* **Fecha de Fin**: 2026-06-30

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Diagnóstico de Esquema y SQL RLS | 2026-06-30 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Diagnóstico físico de `time_logs` (actual_hours, user_id, type) y creación del script RLS `6d_time_logs_rls.sql`. |
| Formulario de Registro de Tiempos | 2026-06-30 | A. Delgado / AI | 1.5 | 1.2 | Finalizado | Maquetación del componente modal controlled `NewTimeLogModal.tsx` con reglas estrictas de enteros mayores a cero, fecha no futura y actividad obligatoria. |
| Integración de API y KPIs | 2026-06-30 | A. Delgado / AI | 1.5 | 1.2 | Finalizado | Creación del query helper `createTimeLog` en projectsService con mapeo relacional y callback `onAddTimeLog` para actualización en caliente. |
| Compilación y Validación Final | 2026-06-30 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Ejecución exitosa de `npm run build` en 539ms garantizando la robustez de los tipos y vistas TSX. |

---

### Fase 6E: Gestión de Reuniones y Minutas del Proyecto (Completado)
* **Fecha de Inicio**: 2026-06-30
* **Fecha de Fin**: 2026-06-30

| Actividad / Tarea | Fecha | Responsable | Horas Estimadas | Horas Reales | Estado | Detalle / Entregables |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| Diagnóstico de Esquema y SQL RLS | 2026-06-30 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Diagnóstico físico de `project_meetings` y `meeting_attendees` en schema.sql, y creación de políticas RLS en `6e_project_meetings_rls.sql`. |
| Formulario de Nueva Reunión (Minuta) | 2026-06-30 | A. Delgado / AI | 2.0 | 1.6 | Finalizado | Maquetación del modal controlled `NewMeetingModal.tsx` que valida campos requeridos, asocia asistentes reales y bloquea campos vacíos. |
| Integración de Cascada y Cards UI | 2026-06-30 | A. Delgado / AI | 2.0 | 1.6 | Finalizado | Implementación en projectsService de la cascada de inserción en `project_meetings` y `meeting_attendees` secuencialmente, y rediseño de la UI con tarjetas expandibles. |
| Compilación y Validación Final | 2026-06-30 | A. Delgado / AI | 0.5 | 0.4 | Finalizado | Ejecución exitosa de `npm run build` en 958ms con cero errores en types.ts y componentes. |

