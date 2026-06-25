# Modelo de Datos Físico: Seguimiento de Proyectos de Cooperativa (Fase 2)

Este documento describe el diseño relacional y físico de la base de datos PostgreSQL de Supabase para la mini aplicación institucional de seguimiento de proyectos.

---

## 📊 Diagrama Entidad-Relación (ER)

```mermaid
erDiagram
    roles ||--o{ profiles : "tiene"
    profiles ||--o{ projects : "lidera"
    projects ||--o{ project_advances : "tiene"
    projects ||--o{ project_items : "contiene"
    projects ||--o{ project_meetings : "agenda"
    projects ||--o{ project_risks : "registra"
    
    project_meetings ||--o{ meeting_attendees : "asistentes"
    profiles ||--o{ meeting_attendees : "participa"
    
    project_meetings ||--o{ meeting_commitments : "genera"
    projects ||--o{ meeting_commitments : "asigna"
    
    project_items ||--o{ time_logs : "registra horas"
    profiles ||--o{ time_logs : "reporta"
    projects ||--o{ time_logs : "asigna a"
    
    project_evidence }o--|| projects : "pertenece"
    project_evidence }o--|? project_advances : "evidencia"
    project_evidence }o--|? project_items : "evidencia"
    project_evidence }o--|? project_meetings : "evidencia"
    project_evidence }o--|? meeting_commitments : "evidencia"
    project_evidence }o--|? project_risks : "evidencia"
    
    audit_logs }o--|? profiles : "realizado por"
```

---

## 🗄️ Diccionario de Datos y Tablas

### 1. `roles` (Catálogo de Roles de Usuario)
Define el catálogo base para la gestión de accesos futuros.
* **Propósito**: Soportar una gobernanza de permisos modular.
* **Campos**:
  * `id` (`uuid`, PK): Llave primaria por defecto con `gen_random_uuid()`.
  * `name` (`text`, UNIQUE, NOT NULL): Nombre restrictivo del rol. Valores: `admin`, `leader`, `viewer`.
  * `description` (`text`): Descripción funcional del rol.
  * `created_at` (`timestamp with time zone`): Auditoría de creación.

### 2. `profiles` (Perfiles de Usuario)
Asociado a las identidades del sistema. Se prepara para la vinculación con `auth.users` de Supabase en la Fase 3.
* **Propósito**: Almacenar los datos de contacto y rol de líderes de proyecto, sponsors y directivos.
* **Campos**:
  * `id` (`uuid`, PK): ID técnico por defecto con `gen_random_uuid()`.
  * `email` (`text`, UNIQUE, NOT NULL): Correo institucional.
  * `first_name` (`text`, NOT NULL): Nombre del usuario.
  * `last_name` (`text`, NOT NULL): Apellido del usuario.
  * `role_id` (`uuid`, FK): Relación con `roles(id)`.
  * `created_at` (`timestamp with time zone`): Auditoría.

### 3. `projects` (Proyectos - Datos Maestros)
Contiene la información de control ejecutivo de cada iniciativa o proyecto de la cooperativa.
* **Propósito**: Tabla maestra de la aplicación.
* **Campos**:
  * `id` (`uuid`, PK): Identificador técnico interno.
  * `project_code` (`text`, UNIQUE, NOT NULL): Código institucional visible (ej: `PRJ-2026-001`).
  * `name` (`text`, NOT NULL): Nombre descriptivo de la iniciativa.
  * `description` (`text`): Alcance resumido.
  * `estimated_effort_hours` (`integer`, NOT NULL): Esfuerzo planificado acumulado en horas (sustituye campos financieros).
  * `status` (`text`, NOT NULL): Restricción CHECK (`Borrador`, `En curso`, `En revisión`, `Pausado`, `Con retraso`, `Cerrado`, `Cancelado`).
  * `leader_id` (`uuid`, FK): Líder del proyecto referenciado a `profiles(id)`.
  * `sponsor` (`text`, NOT NULL): Directivo / Sponsor responsable del proyecto.
  * `responsible_func` (`text`, NOT NULL): Responsable del área funcional solicitante.
  * `responsible_exec` (`text`, NOT NULL): Responsable del área técnica ejecutora.
  * `area_solicitante` (`text`, NOT NULL): Departamento institucional que solicita el proyecto.
  * `start_date` (`date`, NOT NULL): Fecha de inicio del proyecto.
  * `end_date` (`date`, NOT NULL): Fecha objetivo final. Restricción CHECK: `end_date >= start_date`.
  * `objective` (`text`, NOT NULL): Objetivo estratégico del proyecto.
  * `scope` (`text`, NOT NULL): Declaración de alcance.
  * `expected_result` (`text`, NOT NULL): Resultado final o valor institucional esperado.
  * `execution_style` (`text`, NOT NULL): Enfoque metodológico. Restricción CHECK (`Cascada`, `Ágil`, `Híbrido`).
  * `is_deleted` (`boolean`, default false, NOT NULL): Estado de eliminación lógica.
  * `deleted_at` (`timestamp with time zone`): Marca de tiempo de la eliminación.
  * `deleted_by` (`uuid`, FK): Colaborador que eliminó el registro de `profiles(id)`.
  * `created_at` / `updated_at` (`timestamp with time zone`): Auditoría de tiempos.
  * `created_by` / `updated_by` (`uuid`, FK): Auditoría de autores referenciado a `profiles(id)`.

### 4. `project_advances` (Bitácora de Avances)
Historial periódico de avance de los proyectos.
* **Propósito**: Registrar el progreso y valor entregado objetivamente.
* **Campos**:
  * `id` (`uuid`, PK): Llave de avance.
  * `project_id` (`uuid`, FK): Proyecto asociado.
  * `date` (`date`, NOT NULL): Fecha del reporte de avance.
  * `progress_pct` (`integer`, NOT NULL): Restricción CHECK (`between 0 and 100`).
  * `summary` (`text`, NOT NULL): Breve resumen descriptivo del estado actual.
  * `completed_tasks` (`text`): Tareas completadas en este periodo.
  * `value_delivered` (`text`): Valor generado para los socios o la cooperativa.
  * `reporter_id` (`uuid`, FK): Colaborador que reporta referenciado a `profiles(id)`.
  * `next_steps` / `notes` (`text`): Siguientes acciones y comentarios adicionales.
  * *Campos de Auditoría Estándar*.

### 5. `project_items` (Actividades / Backlog / Kanban)
Desglose de tareas del proyecto.
* **Propósito**: Alimentar la vista Kanban y gestionar la asignación de esfuerzo.
* **Campos**:
  * `id` (`uuid`, PK): Llave de la actividad.
  * `project_id` (`uuid`, FK): Proyecto de origen.
  * `name` (`text`, NOT NULL): Título corto del entregable o actividad.
  * `description` (`text`): Detalles y especificaciones.
  * `type` (`text`): Tipo de actividad (ej: `Base de Datos`, `Desarrollo Backend`, `QA`).
  * `assignee_id` (`uuid`, FK): Colaborador asignado referenciado a `profiles(id)`.
  * `priority` (`text`, NOT NULL): Restricción CHECK (`Baja`, `Media`, `Alta`, `Crítica`).
  * `kanban_status` (`text`, NOT NULL): Restricción CHECK (`Por hacer`, `En progreso`, `Bloqueado`, `En revisión`, `Terminado`).
  * `start_date` / `due_date` / `end_date` (`date`): Control temporal de la actividad.
  * `estimated_hours` (`integer`, NOT NULL): Horas de esfuerzo planificado.
  * `actual_hours` (`integer`): Horas reales acumuladas de esfuerzo consumido.
  * `progress_pct` (`integer`): Progreso de la tarea (`between 0 and 100`).
  * `acceptance_criteria` / `notes` (`text`): Criterios de aprobación técnica e información extra.
  * *Campos de Auditoría Estándar*.

### 6. `project_meetings` (Reuniones y Comités)
Registro documental de las minutas técnicas y estratégicas.
* **Propósito**: Trazabilidad de las decisiones y acuerdos institucionales.
* **Campos**:
  * `id` (`uuid`, PK).
  * `project_id` (`uuid`, FK).
  * `date_time` (`timestamp with time zone`, NOT NULL): Fecha y hora del comité.
  * `type` (`text`, NOT NULL): Restricción CHECK (`Seguimiento ejecutivo`, `Comité`, `Técnica`, `Funcional`, `Daily`, `Planning`, `Review / Demo`, `Retrospectiva`, `Cierre`).
  * `topics` (`text`, NOT NULL): Temas tratados en la reunión.
  * `decisions` / `agreements` / `impediments` / `notes` (`text`): Resumen ejecutivo del acta.
  * *Campos de Auditoría Estándar*.

### 7. `meeting_attendees` (Asistentes de Reunión)
Tabla relacional intermedia de muchos a muchos.
* **Propósito**: Control de participantes y quorum de cada reunión.
* **Campos**:
  * `meeting_id` (`uuid`, PK, FK): Reunión referenciada.
  * `profile_id` (`uuid`, PK, FK): Perfil asistente referenciado.

### 8. `meeting_commitments` (Compromisos Críticos)
Control de entregas pactadas en reuniones o asociadas a la gobernanza del proyecto.
* **Propósito**: Seguimiento del cumplimiento individual de compromisos (enfoque ejecutivo).
* **Campos**:
  * `id` (`uuid`, PK).
  * `project_id` (`uuid`, FK).
  * `meeting_id` (`uuid`, FK): Reunión origen (nullable si se genera fuera de minutas).
  * `description` (`text`, NOT NULL): Tarea a cumplir.
  * `assignee_id` (`uuid`, FK): Colaborador responsable de la entrega.
  * `due_date` (`date`, NOT NULL): Fecha límite de cumplimiento.
  * `status` (`text`, NOT NULL): Restricción CHECK (`Pendiente`, `En proceso`, `Cumplido`, `Vencido`).
  * `notes` (`text`).
  * *Campos de Auditoría Estándar*.

### 9. `time_logs` (Registro de Tiempos)
Asociación del esfuerzo diario reportado por los colaboradores.
* **Propósito**: Calcular la desviación de esfuerzo global y por actividad.
* **Campos**:
  * `id` (`uuid`, PK).
  * `project_id` (`uuid`, FK).
  * `activity_id` (`uuid`, FK): Tarea asociada de `project_items`.
  * `date` (`date`, NOT NULL): Fecha del día trabajado.
  * `user_id` (`uuid`, FK): Colaborador que reporta.
  * `description` (`text`, NOT NULL): Tarea específica realizada.
  * `type` (`text`, NOT NULL): Tipo de labor (ej. `Diseño`, `Programación`, `Reuniones`).
  * `actual_hours` (`integer`, NOT NULL): Horas reportadas. Restricción CHECK: `actual_hours > 0`.
  * *Campos de Auditoría Estándar*.

### 10. `project_risks` (Gestión de Riesgos e Impedimentos)
Control de amenazas y bloqueos que afectan el flujo normal del proyecto.
* **Propósito**: Clasificar y alertar oportunamente para la acción del Sponsor y BPMO.
* **Campos**:
  * `id` (`uuid`, PK).
  * `project_id` (`uuid`, FK).
  * `type` (`text`, NOT NULL): Restricción CHECK (`Riesgo`, `Bloqueo`, `Dependencia`, `Incidencia`, `Impedimento`).
  * `description` (`text`, NOT NULL): Detalle y causa raíz.
  * `impact` (`text`, NOT NULL): Restricción CHECK (`Bajo`, `Medio`, `Alto`).
  * `probability` (`text`, NOT NULL): Restricción CHECK (`Baja`, `Media`, `Alta`).
  * `assignee_id` (`uuid`, FK): Encargado del plan de mitigación.
  * `date_identified` (`date`, NOT NULL): Fecha en que se detectó.
  * `resolution_date` (`date`): Fecha en que se resolvió/cerró.
  * `status` (`text`, NOT NULL): Restricción CHECK (`Abierto`, `En tratamiento`, `Mitigado`, `Cerrado`).
  * `mitigation_action` / `notes` (`text`).
  * *Campos de Auditoría Estándar*.

### 11. `project_evidence` (Evidencias y Entregables Adjuntos)
Gestión unificada de soportes digitales (links de almacenamiento o SharePoint).
* **Propósito**: Validar documentalmente el avance, compromisos, actividades o riesgos sin ambigüedades.
* **Campos**:
  * `id` (`uuid`, PK).
  * `project_id` (`uuid`, FK): Relación directa con el proyecto.
  * `file_name` (`text`, NOT NULL): Nombre visible del archivo o recurso.
  * `file_url` (`text`, NOT NULL): Enlace al repositorio de almacenamiento.
  * `advance_id` (`uuid`, FK): Relación opcional con bitácora de avance.
  * `activity_id` (`uuid`, FK): Relación opcional con tarea.
  * `meeting_id` (`uuid`, FK): Relación opcional con minuta de reunión.
  * `commitment_id` (`uuid`, FK): Relación opcional con compromiso.
  * `risk_id` (`uuid`, FK): Relación opcional con riesgo.
  * `uploaded_by` (`uuid`, FK): Colaborador que adjuntó.
  * `uploaded_at` (`timestamp with time zone`): Fecha de subida.
* **Restricción Excluyente Clave (Mutually Exclusive Relation)**:
  Una evidencia debe asociarse a una sola entidad a la vez además del proyecto, controlada por la restricción CHECK `check_only_one_parent`:
  $$\sum (\text{parent\_id is not null}) = 1$$
  ```sql
  constraint check_only_one_parent check (
      (
          (advance_id is not null)::integer +
          (activity_id is not null)::integer +
          (meeting_id is not null)::integer +
          (commitment_id is not null)::integer +
          (risk_id is not null)::integer
      ) = 1
  )
  ```

### 12. `audit_logs` (Auditoría de Estado)
Control transaccional para historiales y semáforos.
* **Propósito**: Auditar de forma simple los cambios en los estados ejecutivos de proyectos y tareas.
* **Campos**:
  * `id` (`uuid`, PK).
  * `entity_type` (`text`, NOT NULL): Tipo de entidad auditada (ej: `projects`, `project_items`).
  * `entity_id` (`uuid`, NOT NULL): ID del registro afectado.
  * `action` (`text`, NOT NULL): Acción realizada (`INSERT`, `UPDATE`, `DELETE`).
  * `old_values` (`jsonb`): Estado anterior.
  * `new_values` (`jsonb`): Estado nuevo.
  * `performed_by` (`uuid`, FK): Autor del cambio.
  * `performed_at` (`timestamp with time zone`).

---

## 🛠️ Decisiones Técnicas Aplicadas

1. **Uso Mandatorio de UUIDs**: Se descartó la utilización de llaves autoincrementales enteras (`SERIAL`) en favor de `UUID` generados automáticamente mediante `default gen_random_uuid()` para garantizar compatibilidad con bases de datos distribuidas y el módulo nativo de Supabase Auth.
2. **Desacoplamiento del Código Visible**: El código de proyecto (`project_code`, ej: `PRJ-2026-001`) se trata como un campo de texto visible para el usuario con restricciones de unicidad (`UNIQUE NOT NULL`), evitando depender del ID relacional interno para la identificación institucional del proyecto.
3. **Poblamiento Seed sin Autenticación**: Para el archivo `seed.sql` se crearon perfiles mock controlados en `public.profiles` con UUIDs deterministas fijos (ej: `11111111-1111-1111-1111-111111111101`). Esto permite correr e inicializar la base de datos de manera autónoma sin requerir el registro previo de usuarios en la tabla interna de Supabase `auth.users`.
4. **Soporte de Auditoría Automática**: Se diseñó una función de base de datos en PL/pgSQL y un conjunto de triggers a nivel de tabla para actualizar automáticamente la columna `updated_at = NOW()` en todas las tablas principales ante cualquier sentencia `UPDATE`, quitando la responsabilidad al servidor de backend o la interfaz React.
5. **Polimorfismo en Evidencias con Restricción CHECK**: En lugar de crear múltiples tablas de evidencias o usar relaciones virtuales no tipadas, se centralizó el control en `project_evidence` implementando llaves foráneas explícitas hacia todas las entidades origen con una restricción CHECK que impide que un archivo esté asociado a más de una entidad (mutuamente excluyentes).
6. **Esfuerzo Basado en Horas de Trabajo**: Siguiendo el requerimiento estratégico, el sistema de datos no incluye variables de presupuesto, costos financieros ni monedas. Todo el control de capacidad se gestiona en horas mediante variables como `estimated_effort_hours`, `actual_hours` y registros detallados en `time_logs`.
7. **Gobernanza de Eliminación Segura (Trazabilidad vs Borrado en Cascadas)**:
   Para salvaguardar el historial institucional y evitar pérdidas accidentales de datos de soporte (avances, actividades, riesgos, minutas y registros de horas), se tomaron dos medidas clave:
   * **Sin borrado físico en cascada**: Se cambiaron todas las declaraciones `ON DELETE CASCADE` de las relaciones hijas hacia `projects(id)` por `ON DELETE RESTRICT`. Esto impide que se eliminen proyectos de la base de datos si existen registros históricos dependientes.
   * **Esquema de Eliminación Lógica**: Se incorporaron las columnas `is_deleted`, `deleted_at` y `deleted_by` a la tabla `projects`. La remoción de un proyecto se gestionará a nivel de software/lógica (marcando `is_deleted = true`), preservando la integridad del historial transaccional de la cooperativa para fines de auditoría.

---

## ⏳ Pendiente para la Fase 3

Durante la Fase 3 (Integración Real con Supabase) se abordarán los siguientes puntos:

1. **Configuración de Supabase Auth**: Creación de triggers en PostgreSQL para sincronizar de forma automática la creación de registros en la tabla interna `auth.users` con nuestra tabla `public.profiles`.
2. **Políticas de Seguridad a Nivel de Fila (RLS)**: Activación de RLS en todas las tablas del esquema `public` y diseño de políticas para limitar quién puede editar (`INSERT`, `UPDATE`) proyectos y avances, basándose en el rol del perfil (`admin`, `leader`, `viewer`).
3. **Conexión de Frontend**:
   * Instalación del SDK `@supabase/supabase-js`.
   * Creación del archivo de variables de entorno `.env.local` con las claves de acceso de la API de Supabase.
   * Reemplazo de los datos mock en memoria de `mockData.ts` por llamadas directas al cliente Supabase en React.
4. **Módulo de Login en UI**: Implementación de la pantalla de inicio de sesión y protección de rutas en React basadas en la sesión del usuario.
5. **Auditoría Avanzada**: Enlazar los disparadores automáticos para registrar cambios en `audit_logs` ante eventos `UPDATE` críticos.
