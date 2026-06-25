# Guía de Despliegue en Vercel

Este documento detalla las instrucciones paso a paso para configurar y desplegar la mini app de **Seguimiento de Proyectos Cooperativa** en la plataforma **Vercel**, conectando el repositorio y asegurando el correcto aislamiento de las claves del API de Supabase.

---

## 🔒 Variables de Entorno en Producción

Para que la aplicación en producción pueda conectarse de forma real a la base de datos de Supabase, se deben configurar las siguientes variables de entorno en el panel administrativo de Vercel. 

> [!CAUTION]
> **Seguridad de Claves**:
> Nunca escribas credenciales reales en el código del proyecto ni subas archivos `.env.local` al repositorio Git. Vercel inyectará estas variables de manera segura en el contenedor de compilación.

*   `VITE_SUPABASE_URL`: La dirección API de tu proyecto de Supabase (ej: `https://xxxxxxxxxxxxxx.supabase.co`).
*   `VITE_SUPABASE_ANON_KEY`: La clave anónima pública (`anon key`) generada en el panel de claves de Supabase.

---

## 🚀 Pasos para Desplegar en Vercel

### Paso 1: Subir el Proyecto a tu Repositorio Git
1. Asegúrate de tener los cambios consolidados en tu rama principal (`main` o `master`).
2. Verifica que tu archivo `.gitignore` contenga la regla `.env.local` para evitar subir tus claves de desarrollo.
3. Sube el código a tu cuenta de GitHub, GitLab o Bitbucket institucional.

### Paso 2: Crear un Nuevo Proyecto en Vercel
1. Inicia sesión en la consola de **Vercel** (`https://vercel.com`).
2. Haz clic en el botón **"Add New"** y selecciona **"Project"**.
3. Importa el repositorio de la aplicación desde tu proveedor Git.

### Paso 3: Configurar el Entorno y Build
En la sección de configuración de importación del proyecto en Vercel, ajusta los siguientes campos:

1.  **Framework Preset**: Selecciona **Vite**.
2.  **Root Directory**: Dejar en `./` (raíz).
3.  **Build Command**: `npm run build` (se autodetectará de forma predeterminada).
4.  **Output Directory**: `dist` (carpeta de compilación de Vite).
5.  **Environment Variables**:
    *   Despliega el bloque de variables de entorno.
    *   Ingresa `VITE_SUPABASE_URL` con tu URL de Supabase y presiona *Add*.
    *   Ingresa `VITE_SUPABASE_ANON_KEY` con tu clave anónima y presiona *Add*.

### Paso 4: Desplegar (*Deploy*)
1. Haz clic en el botón **"Deploy"**.
2. El pipeline de Vercel descargará las dependencias instaladas (`@supabase/supabase-js`, `@tailwindcss/vite`, etc.), ejecutará la compilación TypeScript y optimizará los recursos estáticos.
3. Al finalizar, Vercel te proporcionará una URL pública (`https://tu-proyecto.vercel.app`) para acceder a la aplicación.

---

## 🛡️ Ajustes de Seguridad y CORS en Supabase

Una vez desplegada la aplicación en Vercel, debes registrar tu dominio en Supabase para proteger el acceso:

1.  Ve a tu panel de **Supabase** (`https://supabase.com`).
2.  Navega a **Settings > API**.
3.  En la sección **CORS / Allowed Origins**, registra la URL del dominio proporcionado por Vercel (ej: `https://tu-proyecto.vercel.app`).
4.  Esto asegurará que únicamente tu aplicación desplegada pueda realizar solicitudes API HTTP a las tablas del portafolio.
