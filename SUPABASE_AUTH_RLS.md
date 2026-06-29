# Guía de Configuración: Supabase Auth y Row Level Security (RLS)

Esta guía detalla los pasos requeridos para inicializar la autenticación, aplicar las políticas RLS y validar el estado de seguridad física de la base de datos de Supabase en la aplicación de **Seguimiento de Proyectos Cooperativa**.

---

## 1. Conceptos de Seguridad Implementados

### Vinculación de Sesión por Nueva Columna
No alteramos la llave primaria `profiles.id` para preservar todas las relaciones de integridad física del modelo de datos actual. En su lugar, agregamos la columna:
`auth_user_id uuid unique references auth.users(id) on delete set null`
Esto asocia el identificador interno del perfil de la base de datos pública con el identificador de autenticación generado por Supabase Auth.

### Prevención de Bucle / Recursión Infinita en RLS
En PostgreSQL, si una política en `public.profiles` hace un SELECT sobre la misma tabla `profiles`, se produce una recursión infinita que causa que las consultas de Supabase fallen.
* **Solución**: Se implementó la función auxiliar `public.is_admin()` configurada con:
  * `SECURITY DEFINER`: Permite que la función se ejecute omitiendo el RLS sobre la tabla `profiles` durante la validación del rol del usuario autenticado.
  * `set search_path = public, auth`: Una buena práctica crítica que asegura que la resolución de tablas y esquemas esté acotada únicamente a los esquemas seguros, evitando vulnerabilidades de inyección.

---

## 2. Paso a Paso para Configurar Supabase

### Paso A: Ejecutar el SQL de Migración
Abre la consola web de tu proyecto en Supabase, navega a **SQL Editor**, crea un nuevo script y ejecuta los contenidos del archivo:
👉 **[`supabase/migrations/auth_rls_setup.sql`](file:///c:/Users/andres.delgado/Desktop/seguimiento-proyectos-cooperativa/supabase/migrations/auth_rls_setup.sql)**

Este script creará la columna `auth_user_id`, habilitará RLS en las 12 tablas, creará la función helper y definirá las políticas idempotentes.

### Paso B: Registrar el Usuario Administrador en Supabase Auth
1. En tu panel de Supabase, ve a la sección **Authentication** (icono de candado/llave) en el menú lateral.
2. Ve a **Users** y haz clic en el botón **Add User** > **Create User**.
3. Ingresa tu correo (ej. `tu_email@cooperativa.com`) y una contraseña segura.
4. Asegúrate de marcar **Auto-confirm User** para que la cuenta se active inmediatamente sin requerir envío de correo.
5. Copia el **User UID** generado para este usuario (ej. `d8b58a10-8b29-450a-810a-3abf4e7c10b1`).

### Paso C: Vincular el Usuario Auth con tu Perfil en la Base de Datos
En el **SQL Editor** de Supabase, ejecuta la siguiente consulta reemplazando el valor con tu UUID copiado en el paso anterior para asignarle privilegios de administrador a tu cuenta:

```sql
update public.profiles
set auth_user_id = 'UUID_COPIADO_DE_SUPABASE_AUTH' -- Reemplazar con tu User UID real
where email = 'tu_email@cooperativa.com';
```

---

## 3. Consultas de Validación de Seguridad

Ejecuta estas consultas en el **SQL Editor** de Supabase para verificar que todo esté correctamente configurado:

```sql
-- 1. Validar que la columna auth_user_id existe en profiles
select column_name, data_type 
from information_schema.columns 
where table_schema = 'public' 
  and table_name = 'profiles' 
  and column_name = 'auth_user_id';

-- 2. Validar que el RLS esté habilitado en las 12 tablas
select tablename, rowsecurity 
from pg_tables 
where schemaname = 'public' 
  and tablename in (
    'roles', 'profiles', 'projects', 'project_advances', 'project_items', 
    'project_meetings', 'meeting_attendees', 'meeting_commitments', 
    'time_logs', 'project_risks', 'project_evidence', 'audit_logs'
  );

-- 3. Validar la vinculación correcta y rol del usuario
select p.email, p.first_name, p.last_name, r.name as role_name, p.auth_user_id
from public.profiles p
join public.roles r on r.id = p.role_id
where p.auth_user_id is not null;
```
