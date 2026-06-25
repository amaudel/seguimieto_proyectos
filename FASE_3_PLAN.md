# Plan de Trabajo - Fase 3: Integración de Supabase y Preparación para Vercel

Este documento detalla el plan estratégico, alcance y gobernanza de la **Fase 3** para el sistema **Seguimiento de Proyectos Cooperativa**.

---

## 🎯 Objetivo de la Fase 3
Establecer la conexión física entre el frontend React y la base de datos Supabase PostgreSQL para consultar datos reales en tiempo real, garantizando la continuidad operativa local mediante un mecanismo de fallback automático a los datos simulados (`mockData.ts`) si no hay configuración o falla la conexión.

---

## 📋 Estado e Hitos de la Fase 3

### 1. Dependencia de Conexión
* Se instaló únicamente la librería oficial del SDK de Supabase: `@supabase/supabase-js` (versión ^2.x).
* Cero dependencias adicionales añadidas.

### 2. Configuración y Fallback
* Se definió la inicialización del cliente en `src/lib/supabaseClient.ts`, validando la existencia de las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
* Si las variables no existen en el entorno, la app captura la ausencia de forma silenciosa, levanta una advertencia en la consola de desarrollo, y opera con normalidad cargando los datos simulados en memoria.

### 3. Capa de Servicios de Lectura
* Se implementaron servicios de consulta de datos (`SELECT`) en `src/services/projectsService.ts` para todas las entidades del sistema:
  * Proyectos (filtrando eliminados lógicos)
  * Avances de bitácora (con joins de reportador y archivo adjunto)
  * Actividades del Backlog Kanban (con join de colaborador asignado)
  * Minutas de reuniones y comités (con join de nombres de asistentes)
  * Compromisos (con join de responsables y archivos)
  * Registros de tiempos (`time_logs`, con join de actividad y usuario)
  * Riesgos e impedimentos/bloqueos
* Cada servicio captura errores mediante `try-catch` y, ante fallas de red o base de datos offline, retorna la sección equivalente de datos mock.

### 4. Flexibilidad de Tipos e IDs
* Se definió el alias de tipo `EntityId = string | number` en `src/types.ts` para unificar la representación de IDs secuenciales (mock) y UUIDs (Supabase).
* Se actualizaron los componentes (`App.tsx`, `Dashboard.tsx`, `ProjectList.tsx`, `ProjectDetail.tsx`) para normalizar las comparaciones de IDs mediante `String(id)`.

### 5. Reemplazo de Terminología Financiera
* Se retiró todo rastro de la propiedad `budget` en los tipos e interfaces del frontend.
* Se implementaron propiedades basadas en esfuerzo: `estimatedEffortHours` (horas estimadas de esfuerzo), alineando el código de la app con el modelo de base de datos de la Fase 2.

---

## 🚫 Alcance Diferido (Fuera de la Fase 3)
Para mantener un desarrollo controlado, quedan aplazados los siguientes hitos:
* **Autenticación real**: No hay login de usuario; el sistema continúa simulando la sesión del administrador BPMO.
* **Escritura (CRUD)**: Los formularios de creación de proyectos, bitácoras de avance y registros de tiempos solo operan en memoria local. No hay APIs de escritura (`INSERT`, `UPDATE`, `DELETE`) en esta fase.
* **RLS Activo**: La base de datos es de libre lectura pública; las políticas restrictivas de RLS se implementarán en la siguiente etapa.
* **Subida de Archivos**: Los adjuntos son enlaces de texto simulados. No hay buckets de almacenamiento activos.

---

## 📊 Criterios de Aceptación de la Fase 3
La Fase 3 se declara aprobada y lista para despliegue cuando:
1. La aplicación compile exitosamente con Vite y TypeScript (`npm run build`).
2. La aplicación funcione con normalidad en ausencia de credenciales de red, cargando instantáneamente el mock local en memoria.
3. Se disponga de plantillas `.env.example` y guías de despliegue en Vercel actualizadas.
