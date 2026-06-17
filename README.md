# Gestor de Solicitudes (Request Manager)

Un panel de administración moderno y de alto rendimiento diseñado para la gestión y seguimiento de solicitudes dentro de una organización. Desarrollado con el ecosistema de **Next.js (App Router)**, **TypeScript**, y **Tailwind CSS**.

---

## 🚀 Características Principales

- **Tablero Kanban Interactivo (DnD):** Mueve solicitudes de forma interactiva entre columnas de estado (_Pendiente, En Revisión, Aprobada, Rechazada, Cerrada_) con transiciones suaves mediante `@hello-pangea/dnd`.
- **Panel de Estadísticas y Analíticas:** Visualización en tiempo real mediante gráficos interactivos de solicitudes por categoría, prioridad, estado y tendencia temporal utilizando `Recharts`.
- **Búsqueda y Filtrado Avanzado:** Búsqueda textual inteligente combinada con filtros multi-criterio por prioridad, categoría y estado.
- **Bilingüe (i18n):** Soporte de internacionalización en caliente para cambiar entre Español e Inglés de manera inmediata y fluida.
- **Preferencia de Tema (Modo Claro/Oscuro):** Detección automática del tema del sistema operativo con opción de cambio manual persistido en el navegador.
- **Exportación de Reportes:** Permite exportar la lista de solicitudes a un archivo CSV basado en los filtros activos.
- **API Backend de Alto Rendimiento:** Rutas de API `/api/v1/solicitudes` y `/api/v1/solicitudes/[id]` preparadas para interactuar con la base de datos.
- **Seguridad Avanzada:**
  - Middleware para inyección de encabezados de seguridad HTTP robustos (**CSP - Content Security Policy**, HSTS, X-Frame-Options, XSS Protection).
  - **Rate Limiting** incorporado en la API para evitar abusos (máximo 60 peticiones/minuto por dirección IP).
  - Control de acceso y redirección inteligente basado en cookies de sesión JWT.

---

## 🛠️ Stack Tecnológico

### Frontend

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) con React 19.
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) para una estilización ágil e interactiva.
- **Iconografía:** [Lucide React](https://lucide.dev/) para iconos fluidos y modernos.
- **Validación de Formularios:** [React Hook Form](https://react-hook-form.com/) integrado con [Zod](https://zod.dev/) para validaciones del lado del cliente y servidor.
- **Gestión de Datos:** [React Query (@tanstack/react-query)](https://tanstack.com/query/latest) para caché y sincronización del estado remoto del servidor.

### Backend & Almacenamiento

- **Base de Datos:** [Supabase PostgreSQL](https://supabase.com/).
- **Acceso a Datos:** Conector nativo de PostgreSQL `pg` para scripts y consultas estructuradas de base de datos.

### Calidad de Código y Pruebas

- **Linter de alto rendimiento:** [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) para identificar problemas estáticos en tiempo récord.
- **Formateador de código:** [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) para mantener la consistencia de estilos compatible con Prettier.
- **Pruebas Unitarias y de Integración:** [Jest](https://jestjs.io/) y [React Testing Library](https://testing-library.com/).
- **Pruebas de Extremo a Extremo (E2E):** [Cypress](https://www.cypress.io/) para automatización de flujos críticos de usuario (Login, Dashboard, CRUD, Navegación).

### DevOps

- **Contenerización:** [Docker](https://www.docker.com/) con compilación multi-etapa (_multi-stage build_) optimizada mediante el output `standalone` de Next.js.
- **CI/CD:** Pipelines de GitHub Actions para el despliegue automático hacia [Vercel](https://vercel.com/).

---

## 📁 Estructura del Proyecto

```text
├── .github/workflows/       # Workflows de CI/CD (GitHub Actions)
├── cypress/                 # Pruebas integradas de E2E (Cypress)
├── scripts/                 # Scripts auxiliares (poblar base de datos)
├── src/
│   ├── __tests__/           # Suite de pruebas unitarias y de integración
│   ├── app/                 # Rutas de Next.js (App Router) y APIs
│   │   ├── (dashboard)/     # Páginas del panel de administración (con layout)
│   │   ├── api/             # Rutas API v1 REST
│   │   ├── login/           # Pantalla de inicio de sesión
│   │   ├── layout.tsx       # Layout global raíz
│   │   └── middleware.ts    # Configuración de CSP, Rate Limiting y Auth Cookies
│   ├── components/          # Componentes modulares reutilizables
│   │   ├── dashboard/       # Componentes de Kanban y analíticas
│   │   ├── layout/          # Encabezado, menú lateral, notificaciones
│   │   ├── providers/       # Proveedores de contexto (i18n, React Query)
│   │   ├── requests/        # Formularios, tablas y filtros de solicitudes
│   │   ├── settings/        # Opciones de perfil y preferencias
│   │   └── ui/              # Componentes de UI comunes (Input, Button, Toast)
│   ├── hooks/               # Custom React Hooks (CSV, Notificaciones, etc.)
│   ├── lib/                 # Utilidades comunes, tipos y validaciones Zod
│   └── locales/             # Diccionarios de idiomas (Español / Inglés)
├── Dockerfile               # Configuración del contenedor de producción
├── package.json             # Dependencias del proyecto
└── tsconfig.json            # Configuración de TypeScript
```

---

## ⚙️ Configuración del Entorno

Para ejecutar la aplicación localmente o en producción, crea un archivo `.env` o `.env.local` en la raíz del proyecto con las siguientes variables de configuración de base de datos Supabase:

```env
# URL de conexión de Postgres (usar puerto 5432)
POSTGRES_URL="postgresql://postgres:[password]@[db-host].supabase.co:5432/postgres"

# Conexión directa (no-pooling, para scripts locales en caso de usar PgBouncer)
POSTGRES_URL_NON_POOLING="postgresql://postgres:[password]@[db-host].supabase.co:5432/postgres"

# Credenciales del Cliente Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[db-host].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key-de-supabase"
SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key-de-supabase"
```

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para levantar el entorno de desarrollo localmente:

### 1. Instalar dependencias

Asegúrate de tener instalado [pnpm](https://pnpm.io/):

```bash
pnpm install
```

### 2. Inicializar la Base de Datos

Ejecuta el script para crear la tabla de solicitudes y poblarla con registros iniciales de prueba en tu base de datos Supabase configurada:

```bash
pnpm ts-node scripts/setup-db.ts
```

### 3. Iniciar el Servidor de Desarrollo

Levanta el servidor de desarrollo en local:

```bash
pnpm run dev
```

Abre tu navegador en [http://localhost:3000](http://localhost:3000) para ver la aplicación activa.

### 4. Credenciales de Acceso (Mock)

Para ingresar al panel de administración utiliza las siguientes credenciales configuradas en el entorno local:

- **Usuario:** `admin@scotiabank.com`
- **Contraseña:** `admin123`

---

## 🧪 Pruebas

El proyecto incluye dos niveles de pruebas automatizadas:

### Pruebas Unitarias y de Integración (Jest)

Valida el funcionamiento interno de componentes, helpers y hooks:

```bash
# Ejecutar todas las pruebas
pnpm run test

# Ejecutar y ver cobertura de código
pnpm run test:coverage

# Ejecutar en modo watch para desarrollo activo
pnpm run test:watch
```

### Pruebas de Extremo a Extremo (Cypress E2E)

Verifica flujos completos desde la perspectiva del usuario:

```bash
# Abrir el entorno visual de pruebas de Cypress
pnpm run cypress:open

# Ejecutar las pruebas Cypress en consola (headless)
pnpm run cypress:run
```

### Linter y Formateador (Oxlint / Oxfmt)

Herramientas ultra rápidas basadas en Rust para validación y formateo:

```bash
# Analizar el código con oxlint
pnpm run oxlint

# Corregir automáticamente errores solucionables con oxlint
pnpm run oxlint:fix

# Formatear todos los archivos con oxfmt
pnpm run oxfmt

# Verificar si los archivos están formateados correctamente
pnpm run oxfmt:check
```

---

## 🐳 Despliegue con Docker

El proyecto está dockerizado para entornos de producción utilizando compilación multi-etapa y compresión de Next.js standalone.

### Construir Imagen Docker

```bash
docker build -t gestor-solicitudes:latest .
```

### Ejecutar Contenedor

Asegúrate de pasar las variables de entorno necesarias al iniciar el contenedor:

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL="https://[db-host].supabase.co" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key" \
  -e SUPABASE_SERVICE_ROLE_KEY="tu-service-role" \
  gestor-solicitudes:latest
```

---

## 🤖 CI/CD en GitHub Actions

El flujo en `.github/workflows/deploy-vercel.yml` se ejecuta automáticamente con cada `push` o `pull_request` a la rama `main`, compilando y desplegando la aplicación directamente a **Vercel** usando las credenciales almacenadas en los GitHub Secrets del repositorio:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
