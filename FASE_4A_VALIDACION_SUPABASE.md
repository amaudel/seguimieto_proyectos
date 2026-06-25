# Guía de Validación y Ejecución de Base de Datos en Supabase (Fase 4A)

Esta guía detalla el proceso para inicializar tu base de datos en Supabase y ejecutar las consultas de validación técnica de la **Fase 4A**.

---

## 1. Guía Paso a Paso para Inicializar Supabase

Si aún no has creado tu proyecto en Supabase, sigue estos pasos:

1.  **Crear Proyecto**: Inicia sesión en [Supabase](https://supabase.com) y crea un nuevo proyecto llamado `Seguimiento Proyectos Cooperativa`.
2.  **Abrir el Editor SQL**: En el menú lateral izquierdo de tu proyecto en Supabase, haz clic en **"SQL Editor"** (icono de hoja con código).
3.  **Ejecutar el Esquema DDL**:
    *   Crea una nueva consulta haciendo clic en **"New query"**.
    *   Copia la totalidad del archivo local [supabase/schema.sql](file:///c:/Users/andres.delgado/Desktop/seguimiento-proyectos-cooperativa/supabase/schema.sql).
    *   Pega el código en el editor y haz clic en **"Run"**.
    *   Verifica que aparezca el mensaje de éxito indicando que las tablas, llaves foráneas, triggers y enums se crearon de forma correcta.
4.  **Ejecutar los Datos Seed DML**:
    *   Crea otra nueva consulta ("New query").
    *   Copia la totalidad del archivo local [supabase/seed.sql](file:///c:/Users/andres.delgado/Desktop/seguimiento-proyectos-cooperativa/supabase/seed.sql).
    *   Pega el código en el editor y haz clic en **"Run"**.
    *   Verifica que aparezca el mensaje de éxito, indicando que se insertaron los roles, perfiles, proyectos, avances, actividades, reuniones, compromisos, horas de trabajo, riesgos y evidencias de prueba.

---

## 2. Consultas SQL de Validación Técnica

Ejecuta estas consultas en el **SQL Editor** de Supabase para validar las restricciones lógicas y relacionales aplicadas en la Fase 2 y Fase 3.

### A. Conteo General de Registros
Esta consulta verifica que el volumen total de registros cargados coincida con el seed del proyecto:
```sql
select 'roles' as tabla, count(*) as cantidad from roles
union all
select 'profiles', count(*) from profiles
union all
select 'projects', count(*) from projects
union all
select 'project_advances', count(*) from project_advances
union all
select 'project_items', count(*) from project_items
union all
select 'project_meetings', count(*) from project_meetings
union all
select 'meeting_commitments', count(*) from meeting_commitments
union all
select 'time_logs', count(*) from time_logs
union all
select 'project_risks', count(*) from project_risks
union all
select 'project_evidence', count(*) from project_evidence;
```
* **Resultado Esperado**: Proyectos = 4, Perfiles = 12, Roles = 3, Evidencias = 4, etc.

### B. Validación de los 4 Proyectos Demo y Unicidad de Código
Confirma que existan exactamente los 4 proyectos simulados y que no existan códigos institucionales duplicados:
```sql
-- Verificar que existan 4 proyectos
select count(*) = 4 as tiene_4_proyectos_demo from projects;

-- Verificar la unicidad de project_code (debe retornar 0 registros con cantidad > 1)
select project_code, count(*) 
from projects 
group by project_code 
having count(*) > 1;

-- Consultar código, nombre y estado de los proyectos ordenados por código
select project_code, name, status from projects order by project_code;
```
> [!NOTE]
> **Sobre la columna `progress`**:
> La tabla `projects` **no** cuenta con un campo físico llamado `progress` ni `progress_pct` (el progreso real del proyecto es una agregación dinámica calculada a partir de la bitácora de avances en la tabla `project_advances` o actividades en `project_items`). Por lo tanto, consultas que involucren una columna `progress` directa en la tabla de proyectos resultarán en el error `column "progress" does not exist`.

### C. Validación de Ausencia de Campos Financieros
Verifica que no exista ninguna columna relacionada con dinero, presupuestos o costos en la estructura de todas las tablas del esquema `public`:
```sql
select table_name, column_name, data_type 
from information_schema.columns 
where table_schema = 'public' 
  and (column_name like '%budget%' 
    or column_name like '%costo%' 
    or column_name like '%monto%' 
    or column_name like '%presupuesto%'
    or column_name like '%dolar%'
    or column_name like '%moneda%');
```
* **Resultado Esperado**: Cero (0) filas devueltas. El esfuerzo de planificación se gestiona en horas en todo el modelo de datos.

### D. Validación de la Eliminación Lógica
Confirma la presencia y estructura de los campos de eliminación lógica en la tabla `projects`:
```sql
-- Verificar la estructura de eliminación lógica
select column_name, data_type, is_nullable
from information_schema.columns 
where table_name = 'projects' 
  and column_name in ('is_deleted', 'deleted_at', 'deleted_by');

-- Confirmar que todos los proyectos seed estén activos por defecto (is_deleted = false)
select project_code, name, is_deleted from projects;
```

### E. Validación de Datos en Relaciones Principales
Confirma la consistencia de las llaves foráneas y que los proyectos tengan sus respectivos datos de soporte enlazados:
```sql
select p.project_code, p.name, 
       (select count(*) from project_advances a where a.project_id = p.id) as avances,
       (select count(*) from project_items i where i.project_id = p.id) as actividades,
       (select count(*) from meeting_commitments c where c.project_id = p.id) as compromisos,
       (select count(*) from project_risks r where r.project_id = p.id) as riesgos
from projects p;
```
* **Evidencia de Validación Relacional (Exitosa)**:
  Al ejecutar esta consulta, se obtienen los siguientes conteos correctos de relaciones por proyecto:
  * `PRJ-2026-001` (Migración del Core Financiero v4): 2 avances, 4 actividades, 3 compromisos, 2 riesgos.
  * `PRJ-2026-002` (Nueva App Móvil Cooperativa): 2 avances, 4 actividades, 2 compromisos, 1 riesgo.
  * `PRJ-2026-003` (Implementación BPMO): 0 avances, 0 actividades, 0 reuniones, 0 compromisos, 0 riesgos.
    > [!NOTE]
    > **Proyecto Inicial / Pantalla Vacía**:
    > El proyecto `PRJ-2026-003` queda intencionalmente registrado como un proyecto en estado `Borrador` sin datos relacionados de soporte. Esto sirve como caso de prueba demo para validar el comportamiento del frontend al renderizar listas vacías y estados iniciales.
  * `PRJ-2026-004` (Automatización de Crédito de Consumo Web): 1 avance, 2 actividades, 0 compromisos, 1 riesgo.

### F. Confirmación de Datos No Sensibles
Verifica que los perfiles y datos del seed no contengan correos reales ni información transaccional confidencial:
```sql
select email, first_name, last_name from profiles;
```
* **Resultado Esperado**: Todos los correos deben pertenecer al dominio ficticio simulado `@coopac.fin.ec`.

---

## 3. Pruebas Controladas de Restricciones

Estas pruebas ejecutan operaciones de modificación e inserción para validar las restricciones e integridad referencial a nivel de base de datos.

> [!IMPORTANT]
> **Instrucciones de Ejecución**:
> Si se ejecutan como consultas SQL estándar directas, **deben ejecutarse una por una** (con transacciones `begin; ... rollback;`) ya que cada consulta está diseñada para producir un error intencional y abortará cualquier lote/batch completo de comandos SQL.
>
> Como alternativa recomendada para ejecutar todo junto de forma limpia, se proporcionan bloques `DO $$ ... EXCEPTION ... $$` de PL/pgSQL. Estos bloques capturan los errores esperados a nivel interno sin interrumpir el flujo del editor SQL de Supabase y sin dejar datos residuales.

### Prueba 1: Validación de Restricción de Borrado (`ON DELETE RESTRICT`)
Comprueba que no se pueda borrar físicamente un proyecto si posee avances, tareas o compromisos relacionados (`foreign_key_violation`).

**Opción A: Bloque PL/pgSQL controlado (Recomendado)**
```sql
do $$
begin
    -- Intentar borrar el proyecto 'PRJ-2026-001' que posee actividades y avances dependientes
    delete from projects where project_code = 'PRJ-2026-001';
    
    -- Si no lanza excepción, forzar un error indicando fallo de validación
    raise exception 'Error de validación: Se permitió borrar un proyecto con dependencias activas.';
exception
    when foreign_key_violation then
        raise notice 'Prueba superada con éxito: Se capturó correctamente foreign_key_violation al intentar borrar un proyecto con dependencias.';
end $$;
```

**Opción B: Consulta individual manual**
```sql
begin;
-- Intentar borrar el proyecto 'PRJ-2026-001' con dependencias
delete from projects where project_code = 'PRJ-2026-001';
-- Esperado: Error "update or delete on table 'projects' violates foreign key constraint..."
rollback;
```

### Prueba 2: Validación de Evidencia con Asociación Única (`CHECK`)
Comprueba que la tabla `project_evidence` rechace registros que intenten asociarse a más de una entidad a la vez (`check_violation`).

**Opción A: Bloque PL/pgSQL controlado (Recomendado)**
```sql
do $$
begin
    -- Intentar insertar una evidencia vinculada a un avance Y a una actividad al mismo tiempo
    insert into project_evidence (project_id, file_name, file_url, advance_id, activity_id)
    values (
        '22222222-2222-2222-2222-222222222201',
        'evidencia_ambigua.pdf',
        'https://coopac.storage/evidences/evidencia_ambigua.pdf',
        '33333333-3333-3333-3333-333333333301', -- ID de Avance 1
        '44444444-4444-4444-4444-444444444401'  -- ID de Actividad 1
    );
    
    -- Si no lanza excepción, forzar un error indicando fallo de validación
    raise exception 'Error de validación: Se permitió asociar evidencia a múltiples entidades.';
exception
    when check_violation then
        raise notice 'Prueba superada con éxito: Se capturó correctamente check_violation al intentar asociar evidencia a más de una entidad.';
end $$;
```

**Opción B: Consulta individual manual**
```sql
begin;
-- Intentar insertar una evidencia vinculada a avance Y a actividad al mismo tiempo
insert into project_evidence (project_id, file_name, file_url, advance_id, activity_id)
values (
    '22222222-2222-2222-2222-222222222201',
    'evidencia_ambigua.pdf',
    'https://coopac.storage/evidences/evidencia_ambigua.pdf',
    '33333333-3333-3333-3333-333333333301',
    '44444444-4444-4444-4444-444444444401'
);
-- Esperado: Error "new row for relation 'project_evidence' violates check constraint 'check_only_one_parent'"
rollback;
```
