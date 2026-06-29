# Plan de Trabajo - Fase 4B: Seguridad, Autenticación y RLS (Alcance Simplificado)

Este documento define el plan estratégico y el alcance aprobado para la **Fase 4B** de la aplicación **Seguimiento de Proyectos Cooperativa**, enfocado exclusivamente en la protección perimetral del sistema y la restricción de datos en producción.

---

## 1. Objetivos de la Fase 4B
* **Autenticación Obligatoria**: Implementar el inicio de sesión mediante correo y contraseña haciendo uso de Supabase Auth para restringir el acceso a la app.
* **Seguridad de Datos (RLS)**: Habilitar Row Level Security (RLS) en todas las tablas del esquema `public` para prohibir la lectura no autenticada de datos corporativos a través de PostgREST.
* **Control de Acceso Restringido**: Permitir únicamente el rol conceptual de administrador (`admin` en base de datos) para el Asistente de Mejora Continua y Proyectos. No se implementará registro público ni múltiples perfiles de usuario en esta fase.
* **Tolerancia a Fallos en Desarrollo**: Preservar el fallback local (mockData) únicamente cuando no existan variables de entorno configuradas (entorno de desarrollo offline).

---

## 2. Alcance Aprobado

1. **Supabase Auth**:
   * Login por Email y Contraseña.
   * Sin flujo de registro público en el cliente (registro manual desde la consola de Supabase Auth).
2. **Control de Sesión React**:
   * Escucha dinámica de estados de sesión con `onAuthStateChange`.
   * Bloqueo estricto del Dashboard, mockData y menús si no hay sesión activa.
   * Logout funcional para limpiar credenciales.
3. **Row Level Security (RLS)**:
   * Activar RLS en las 12 tablas públicas.
   * Definición de función auxiliar helper con propiedad `SECURITY DEFINER` y `search_path = public, auth` para validar rol de administrador sin caer en recursión infinita en PostgreSQL.
   * Políticas RLS restrictivas para cada tabla de modo que solo los usuarios vinculados a perfiles `'admin'` puedan leer datos.
4. **Solo Lectura**:
   * No se permite la escritura (CRUD) desde la app.
   * Sin modificación de componentes visuales (salvo el componente Login y el banner de origen de datos tras iniciar sesión).

---

## 3. Entregables Técnicos
* **`supabase/migrations/auth_rls_setup.sql`**: Script de migración idempotente para aplicar cambios de RLS, crear columna de vínculo y función helper en Supabase.
* **`src/components/Login.tsx`**: Componente de inicio de sesión visual.
* **`src/App.tsx`**: Integración del wrapper de login, carga de sesión, logout y banner de origen de datos (Fase 4B.1).
* **`SUPABASE_AUTH_RLS.md`**: Guía explicativa para la configuración del RLS y la autenticación de usuarios.
* **`FASE_4B_PLAN.md`**: Este plan de trabajo.

---

## 4. Cronograma de Tareas

| Hito / Tarea | Responsable | Estado | Detalle |
| :--- | :---: | :---: | :--- |
| Definición de Plan e Idempotencia SQL | A. Delgado / AI | Finalizado | Creación de plan de trabajo y estructuración del script SQL con `drop policy if exists`. |
| Creación de componente Login React | A. Delgado / AI | Finalizado | Desarrollo de `Login.tsx` con Tailwind CSS y control de carga. |
| Vinculación de sesión en App.tsx | A. Delgado / AI | Finalizado | Integración de Auth state en el componente raíz y bloqueo de interfaz. |
| Banner de Origen de Datos (Fase 4B.1) | A. Delgado / AI | Finalizado | Añadido de banner condicional visible solo tras login. |
| Compilación de Producción | A. Delgado / AI | Finalizado | Validación y testeo con `npm run build` (Build Exitoso). |
| Documentación Técnica de Auth y RLS | A. Delgado / AI | En Progreso | Creación de `SUPABASE_AUTH_RLS.md` y actualización de bitácoras. |
