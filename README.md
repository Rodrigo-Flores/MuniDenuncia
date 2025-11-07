# MuniDenuncia

Sistema web para la gestión de denuncias municipales que permite a los ciudadanos reportar problemas urbanos de manera sencilla y dar seguimiento a sus reportes.

## Descripción del Proyecto

**MuniDenuncia** es una aplicación web diseñada para facilitar la comunicación entre ciudadanos y municipalidades. Los usuarios pueden:

- **Reportar problemas municipales**: Iluminación, pavimento, basura, áreas verdes, infraestructura, tránsito, etc.
- **Ubicación precisa**: Selección de ubicación mediante mapa interactivo con geocodificación inversa
- **Adjuntar evidencia**: Subir hasta 5 fotografías del problema
- **Seguimiento en tiempo real**: Ver el estado de las denuncias (Pendiente, En Revisión, Resuelto)
- **Gestión de cuenta**: Registro, inicio de sesión y panel personal de denuncias
- **Diseño responsive**: Optimizado para dispositivos móviles y escritorio

## Tecnologías

- **Framework**: Next.js 15.5.4 (App Router)
- **UI**: React 19.1.1 con TypeScript
- **Estilos**: Tailwind CSS con shadcn/ui components
- **Mapas**: Leaflet + React-Leaflet
- **Geocodificación**: Nominatim API (OpenStreetMap)
- **Gestión de estado**: React Hooks (useState, useContext)
- **Almacenamiento**: LocalStorage (datos de demostración)

## Requisitos Previos

- Node.js 18+ 
- Yarn (gestor de paquetes)

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone git@github.com:Rodrigo-Flores/MuniDenuncia.git
cd MuniDenuncia
```

### 2. Instalar dependencias

```bash
yarn install
```

### 3. Ejecutar en modo desarrollo

```bash
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### 4. Compilar para producción

```bash
yarn build
```

### 5. Ejecutar versión de producción

```bash
yarn start
```

## Estructura del Proyecto

```
MuniDenuncia/
├── app/                          # Páginas de Next.js (App Router)
│   ├── page.tsx                  # Página principal
│   ├── crear-denuncia/          # Formulario de nueva denuncia
│   ├── mis-denuncias/           # Panel de denuncias del usuario
│   ├── ingresar/                # Inicio de sesión
│   └── registrarse/             # Registro de usuario
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes base de shadcn/ui
│   ├── complaint-form-wizard.tsx # Formulario multi-paso
│   ├── location-map.tsx         # Mapa interactivo
│   ├── complaints-table.tsx     # Tabla de denuncias
│   └── dashboard-layout.tsx     # Layout del dashboard
├── hooks/                       # Custom React Hooks
│   ├── use-auth.tsx            # Autenticación
│   ├── use-complaints.ts       # Gestión de denuncias
│   └── use-local-storage.ts    # Persistencia local
└── lib/                        # Utilidades y configuración
    └── utils.ts                # Funciones auxiliares
```

## Funcionalidades Principales

### Para Ciudadanos

1. **Crear Denuncia**
   - Formulario de 3 pasos (Tipo de problema, Ubicación, Detalles)
   - Selección de ubicación en mapa con autocompletado de dirección
   - Campos estructurados: Región, Comuna, Calle, Número
   - Carga de fotografías (máx. 5 imágenes, 5MB c/u)

2. **Gestión de Denuncias**
   - Vista de todas las denuncias del usuario
   - Filtros por estado y búsqueda
   - Estadísticas (Total, Pendientes, En Revisión, Resueltas)
   - Detalle completo con historial de estados

3. **Sistema de Autenticación**
   - Registro con nombre, email y contraseña
   - Inicio de sesión persistente
   - Protección de rutas privadas

### Panel de Denuncias

- Tarjetas con métricas de denuncias
- Búsqueda y filtros avanzados
- Vista responsive (tabla en desktop, cards en móvil)
- Mapa de ubicación en detalle de denuncia
- Historial de cambios de estado
- Respuestas simuladas de la municipalidad

## Deployment

El proyecto está desplegado en Vercel:

**[https://v0-muni-denuncia-web-app.vercel.app/](https://v0-muni-denuncia-web-app.vercel.app/)**

## Usuarios de Prueba

Puedes usar estas credenciales para probar la aplicación:

- **Email**: `demo@munidenuncia.com`
- **Contraseña**: `demo123`

O crear una nueva cuenta en la página de registro.

## Notas de Desarrollo

- Los datos se almacenan en **localStorage** (solo demostración)
- Las denuncias incluyen datos de ejemplo pre-cargados
- El sistema de autenticación es simulado (sin backend real)
- La geocodificación usa la API pública de Nominatim

## Contribución

Este proyecto fue desarrollado para facilitar la comunicación ciudadana con las municipalidades.

## Licencia

Este proyecto es de código abierto y está disponible para uso educativo y de demostración.