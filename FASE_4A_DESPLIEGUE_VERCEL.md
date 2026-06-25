# Guía de Despliegue en Vercel (Fase 4A)

Esta guía detalla los pasos para subir el proyecto a tu proveedor de Git, desplegar la aplicación en Vercel, y configurar de forma segura las variables de entorno de Supabase.

---

## ⚠️ Advertencia de Seguridad Obligatoria

> [!WARNING]
> **Alcance del Despliegue de la Demo**:
> Esta fase del proyecto (Fase 4A) está destinada exclusivamente a un despliegue de prueba y demostración ("demo") utilizando los datos simulados provistos en `seed.sql`.
> **Queda terminantemente prohibido utilizar o registrar datos reales de la cooperativa, socios, cuentas o créditos en esta fase**. Para poder procesar datos reales de manera segura en producción, se deberá implementar previamente el control de autenticación de usuarios (Auth) y las políticas de acceso a nivel de fila (RLS) en PostgreSQL (alcance diferido a la Fase 5).

---

## 1. Guía Paso a Paso para Conectar tu Repositorio Git

Si aún no has subido el proyecto a tu cuenta de GitHub, GitLab o Bitbucket, ejecuta los siguientes comandos desde tu terminal en la carpeta raíz del proyecto:

```bash
# 1. Inicializar el repositorio Git local
git init

# 2. Agregar los archivos al área de preparación
git add .

# 3. Confirmar los archivos con un mensaje descriptivo
git commit -m "feat: integracion de lectura supabase y fallback mock para vercel"

# 4. Crear o renombrar la rama a main
git branch -M main

# 5. Vincular el repositorio local con tu repositorio remoto
# (Reemplaza <URL_DE_TU_REPOSITORIO> por la URL de tu repositorio remoto)
git remote add origin <URL_DE_TU_REPOSITORIO>

# 6. Subir el código a la nube
git push -u origin main
```

---

## 2. Configuración en la Consola de Vercel

Una vez que el código esté subido a tu proveedor Git:

1.  **Iniciar Sesión**: Accede a tu panel en [Vercel](https://vercel.com).
2.  **Importar Proyecto**:
    *   Haz clic en **"Add New"** > **"Project"**.
    *   Selecciona tu proveedor Git e importa el repositorio de la app (`Seguimiento Proyectos Cooperativa`).
3.  **Configurar Build y Directorios**:
    *   **Framework Preset**: Selecciona **Vite** (se autodetecta de forma automática).
    *   **Root Directory**: Dejar en la raíz `./`.
    *   **Build Command**: `npm run build` (autodetectado).
    *   **Output Directory**: `dist` (autodetectado).
4.  **Configurar Variables de Entorno (Environment Variables)**:
    *   Despliega la sección de variables de entorno e ingresa los siguientes nombres y valores exactos:
        *   `VITE_SUPABASE_URL`: La URL del API de tu proyecto de Supabase (ej: `https://xxxxxxxxxxxxxx.supabase.co`).
        *   `VITE_SUPABASE_ANON_KEY`: La clave anónima pública de tu proyecto de Supabase (`anon key`).
5.  **Desplegar**: Haz clic en **"Deploy"** y espera a que finalice la compilación y optimización. Al terminar, obtendrás una URL pública (ej: `https://tu-proyecto.vercel.app`).

---

## 🔒 Reglas de Seguridad Críticas

> [!IMPORTANT]
> **Advertencia de Exposición en Frontend**:
> Todas las variables de entorno inyectadas con el prefijo `VITE_` son procesadas por Vite en tiempo de compilación y quedan **completamente expuestas en texto plano** dentro del código de producción descargado por el navegador. Cualquier usuario que inspeccione la aplicación web podrá visualizarlas.

1.  **Exclusividad del uso de `VITE_SUPABASE_ANON_KEY`**:
    *   La clave anónima (`anon key` o publishable key) es segura de exponer en el frontend **únicamente** cuando se utiliza para demostraciones públicas controladas, o accesos donde no haya información confidencial.
    *   Para poder procesar **datos reales institucionales o información confidencial de socios**, se requiere de forma previa e indispensable implementar autenticación robusta (Auth), activar RLS en todas las tablas y definir políticas de acceso seguras a nivel de fila.
2.  **Prohibición Absoluta de Llaves Administrativas (`service_role`)**:
    *   **Nunca** declares ni expongas la clave `service_role`, secret keys, claves administrativas de Supabase o contraseñas del pool de base de datos en las variables de entorno del frontend ni como variable pública en Vercel.
    *   Esta clave posee permisos de administrador total que hacen bypass de RLS. Exponerla en el frontend daría control total de la base de datos a cualquier usuario del navegador.
3.  **Verificar el archivo de exclusión**: Asegúrate de que el archivo `.env.local` **NO** se suba al repositorio Git público o privado. Confirma que esté correctamente listado en tu archivo `.gitignore`.

---

## 🔌 Revisión Opcional de CORS en Supabase (Solo Solución de Problemas)

> [!NOTE]
> **Configuración No Obligatoria**:
> La configuración de dominios permitidos (CORS) en Supabase es un paso **completamente opcional** y no es obligatorio para el funcionamiento de la demo.
> Únicamente deberás revisar y realizar esta configuración si, tras haber desplegado el proyecto en Vercel, al acceder a la aplicación el navegador muestra un error de políticas CORS en la consola web al intentar comunicarse con Supabase.

Si (y solo si) experimentas problemas de CORS en producción:
1.  Ingresa a tu consola en **Supabase** > **Project Settings** > **API**.
2.  Desplázate hasta la sección **CORS / Allowed Origins**.
3.  Agrega la URL generada de tu aplicación en Vercel (ej: `https://tu-proyecto.vercel.app`).
4.  Guarda los cambios. Esto autorizará formalmente las peticiones HTTP del navegador desde tu dominio de Vercel.
