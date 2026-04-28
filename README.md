# Stoneshapp

Stoneshapp es una companion app en español para **Stoneshard**. El proyecto está centrado en ayudar al jugador a preparar salidas, entender contratos, registrar aprendizaje manual después de cada run y dejar una base limpia para evolucionar a desktop app con Tauri.

Sprint 2 deja resueltas cuatro bases importantes:

- recommendation engine v1 por reglas, sin IA
- persistencia local desacoplada de la UI
- contratos separados entre catálogo curado y progreso del jugador
- historial de runs como loop de aprendizaje manual

## Stack

- React 18
- TypeScript estricto
- Vite
- React Router
- CSS plano con variables y componentes reutilizables
- Vitest para tests unitarios
- Base preparada para Tauri

## Cómo ejecutar

Instalar dependencias:

```bash
npm install
```

Desarrollo:

```bash
npm run dev
```

Tests:

```bash
npm run test
```

Modo watch para tests:

```bash
npm run test:watch
```

Typecheck:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

Preview de la build:

```bash
npm run preview
```

Shell desktop con Tauri:

```bash
npm run tauri dev
```

Nota para Windows + PowerShell:
si la política de ejecución bloquea `npm`, usa `npm.cmd run dev`, `npm.cmd run test`, etc.

## Estructura principal

```text
stoneshapp/
|-- docs/
|   |-- codex-skills.md
|   |-- desktop-evolution.md
|   |-- local-persistence.md
|   `-- recommendation-engine.md
|-- src/
|   |-- app/                  # bootstrap, rutas, metadata de pantallas
|   |-- components/           # UI reusable y campos de formulario
|   |-- content/              # contenido curado estable del juego
|   |-- domains/              # tipos, enums, mocks y contratos de negocio
|   |-- features/             # módulos por dominio/producto
|   |-- hooks/
|   |-- integrations/desktop/ # frontera web-safe hacia capacidades desktop
|   |-- layouts/
|   |-- pages/                # pantallas conectadas al router
|   |-- services/             # fachadas para consumo desde pages/features
|   |-- shared/storage/       # base persistente desacoplada
|   |-- styles/
|   `-- test/                 # helpers de test compartidos
|-- src-tauri/
|-- package.json
`-- vite.config.ts
```

## Arquitectura de storage

La persistencia local usa una capa común en `src/shared/storage`.

- `persistentResource.ts`: lectura/escritura genérica con envelope versionado
- `collectionRepository.ts`: CRUD para colecciones
- `singletonRepository.ts`: CRUD para estados singleton
- `localStorageAdapter.ts`: adapter inicial sobre `localStorage` con fallback en memoria
- `storageKeys.ts`: claves centralizadas por dominio

Sobre esa base, cada dominio define su propio repositorio:

- perfiles
- presets de preparación
- progreso de contratos
- historial de runs
- overlay settings
- app settings

La UI nunca accede a `localStorage` directamente. `pages/` y `features/` consumen servicios tipados desde `src/services`.

## Arquitectura del recommendation engine

El engine vive en `src/features/dungeon-prep/recommendation-engine` y está separado de React.

- `types.ts`: input/output y contratos del motor
- `helpers.ts`: acumulación, deduplicación y summary final
- `rules/`: reglas modulares por preocupación
- `index.ts`: API pública con `generatePreparationRecommendation`
- `adapters.ts`: puente entre formularios de preparación y resultado UI

Las reglas actuales están separadas por:

- seguridad base
- build/arma
- ruta y distancia
- tipo de dungeon
- inventario
- estilo de juego
- tipo de salida

El objetivo es que futuras versiones del engine puedan cambiar reglas o pesos sin reescribir la pantalla `Preparar salida`.

## Estado de Sprint 2

- Dashboard conectado a datos persistidos y módulos reales del MVP
- Preparar salida conectado al recommendation engine v1 y presets persistidos
- Contratos con catálogo curado separado del progreso del jugador
- Historial de runs con registro de feedback post-run y resúmenes básicos
- Perfil, overlay y configuración conectados a persistencia local
- Base desktop preparada para seguir creciendo con Tauri

## Tests incluidos

La suite actual cubre zonas críticas de Sprint 2:

- recommendation engine v1
- reglas principales del engine
- helpers y adapters del engine
- storage genérico con migración
- servicios de persistencia de presets, contratos e historial
- filtros básicos del módulo de contratos

## Documentación relacionada

- [docs/local-persistence.md](docs/local-persistence.md)
- [docs/recommendation-engine.md](docs/recommendation-engine.md)
- [docs/desktop-evolution.md](docs/desktop-evolution.md)
- [docs/codex-skills.md](docs/codex-skills.md)

## Próximos pasos naturales

- usar el historial para influir en recomendaciones futuras de forma explicable
- seguir reduciendo contenido mock residual en dashboard y módulos secundarios
- preparar tests adicionales para páginas con más lógica local
- conectar persistencia desktop real cuando la capa Tauri/SQLite entre en juego
