# Plan de Trabajo - Fase 4A: Validación de Supabase y Despliegue en Vercel

Este documento detalla el plan estratégico, alcance, restricciones y bitácora de control para la **Fase 4A** del proyecto **Seguimiento de Proyectos Cooperativa**.

---

## 🎯 Objetivo de la Fase 4A
Validar en un ambiente demo que la aplicación web (React) logre leer la estructura física de base de datos desde Supabase PostgreSQL y preparar la guía técnica para desplegar la app en Vercel como demo, conservando al 100% el fallback mock ante ausencias de conexión.

---

## 🚫 Restricciones Críticas de la Fase
Para garantizar la seguridad de la información y la gobernanza del proyecto, se aplican estrictamente las siguientes prohibiciones:
* **Sin código React ni cambios en `src/`**: No se realiza ninguna modificación a los componentes, lógica, estilos ni tipos de la app.
* **Sin dependencias**: No se ejecuta `npm install` ni se añaden librerías externas.
* **Sin escritura / CRUD**: Esta fase es exclusivamente de **lectura**. Queda prohibido conectar formularios a operaciones de inserción, edición o borrado.
* **Sin Login ni Roles reales**: No hay control de accesos ni sesiones integradas.
* **Sin RLS (Seguridad de filas) activo**: Las tablas se exponen temporalmente con políticas libres para simplificar la demo de lectura.
* **Sin datos reales sensibles**: Queda terminantemente prohibido cargar datos reales de la cooperativa, socios, cuentas o créditos.
* **Sin claves en repositorio**: No se subirán archivos `.env.local` ni contraseñas.

---

## ⚠️ Advertencia de Seguridad Obligatoria
> [!WARNING]
> **Uso Exclusivo de Prueba y Demo**:
> Esta Fase 4A es válida únicamente para un ambiente demo con información ficticia simulada en `seed.sql`.
> Si en fases posteriores se decide utilizar información institucional o de socios real, se deberá implementar de manera obligatoria y previa el módulo de autenticación (Auth), la activación de RLS en todas las tablas y el diseño de políticas de acceso a nivel de fila para resguardar la confidencialidad.

---

## 📋 Hitos y Entregables de la Fase 4A
En esta fase se generan exclusivamente los siguientes recursos documentales:
1. **`FASE_4A_PLAN.md`**: Este plan con los objetivos y bitácora de control.
2. **`FASE_4A_VALIDACION_SUPABASE.md`**: Guía paso a paso para crear el proyecto en Supabase, ejecutar los scripts SQL y correr las consultas de validación (conteos, unicidad, esfuerzo en horas, restricciones e integridad referencial en transacciones con `ROLLBACK`).
3. **`FASE_4A_DESPLIEGUE_VERCEL.md`**: Manual de despliegue en Vercel, inyección segura de variables de entorno y alertas de no exposición de llaves privadas (`service_role`).

---

## 📈 Criterios de Aceptación de la Fase 4A
La Fase 4A se considera cerrada con éxito cuando:
1. Los archivos documentales sean creados y consolidados en la raíz del proyecto.
2. Se verifique que el build local de Vite (`npm run build`) siga compilando exitosamente con cero errores.
3. Se registre el tiempo de desarrollo en `REGISTRO_TIEMPOS.md`.
