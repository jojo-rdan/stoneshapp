# Stoneshapp

Stoneshapp es una companion app en espanol para **Stoneshard**. El MVP actual esta enfocado en una base frontend limpia, modular y preparada para evolucionar a desktop app con Tauri sin mezclar UI, dominio y capacidades nativas antes de tiempo.

## Stack

- React 18
- TypeScript estricto
- Vite
- React Router
- CSS plano con variables y componentes reutilizables
- Base preparada para Tauri

## Como ejecutar el proyecto

Instalar dependencias:

```bash
npm install
```

Levantar entorno de desarrollo:

```bash
npm run dev
```

Generar build de produccion:

```bash
npm run build
```

Previsualizar la build:

```bash
npm run preview
```

Ejecutar el shell desktop con Tauri:

```bash
npm run tauri dev
```

Nota para Windows + PowerShell:
si la politica de ejecucion bloquea `npm`, usa `npm.cmd run dev`, `npm.cmd run build`, etc.

Nota tras instalar Rust:
si acabas de instalar `rustup`, reinicia la terminal o el IDE para que `cargo` entre al `PATH` de nuevas sesiones.

## Estructura de carpetas

```text
stoneshapp/
|-- docs/
|   `-- desktop-evolution.md
|-- src/
|   |-- app/
|   |-- components/
|   |-- data/
|   |-- domains/
|   |-- features/
|   |-- hooks/
|   |-- integrations/
|   |   `-- desktop/
|   |-- layouts/
|   |-- pages/
|   |-- services/
|   |-- styles/
|   `-- types/
|-- src-tauri/
|   |-- capabilities/
|   `-- src/
|-- index.html
|-- package.json
|-- tsconfig.app.json
|-- tsconfig.json
|-- tsconfig.node.json
`-- vite.config.ts
```

## Guia rapida de arquitectura

- `src/domains`: tipos, unions, enums, mocks y modelos del negocio.
- `src/services`: acceso a datos mock y logica ligera desacoplada de la UI.
- `src/features`: piezas funcionales por modulo del producto.
- `src/pages`: pantallas conectadas al router.
- `src/components`: base visual reutilizable.
- `src/integrations/desktop`: contratos y adapters para capacidades desktop.
- `src-tauri`: shell nativo, ventanas, permisos y comandos Rust.

## Preparacion para Tauri

El proyecto ya incluye una base minima para desktop:

- `vite.config.ts` preparado para convivir con `tauri dev`
- `src-tauri/` con configuracion inicial y ventana principal
- `src/integrations/desktop/` como frontera para futuras APIs nativas

Prerrequisitos del entorno para que `npm run tauri dev` funcione:

- Rust y Cargo disponibles en el `PATH`
- toolchain `stable-msvc`
- Microsoft C++ Build Tools
- WebView2

Guia detallada:

- [docs/desktop-evolution.md](docs/desktop-evolution.md)

## Estado actual del MVP visual

- Dashboard con resumen rapido, tips y accesos principales
- Preparar salida con formulario, validacion basica y checklist mock
- Contratos con lista, filtros, detalle guiado y acciones mock
- Perfil con perfiles guardados y detalle del seleccionado
- Historial con runs previas, faltantes, sobrantes y observaciones
- Overlay settings con controles mock y preview simple
- Configuracion con preferencias base del MVP

## Proximos pasos

- Instalar el CLI de Tauri y validar el shell desktop end-to-end
- Reemplazar bridges desktop mock por implementaciones reales
- Mover el overlay experimental a un modulo nativo desacoplado
- Anadir persistencia local para perfiles, notas, contratos y settings
- Cubrir servicios de dominio y reglas de recomendacion con tests
