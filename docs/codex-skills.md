# Skills de Codex para Stoneshapp

Este repositorio incluye skills versionadas en [`.codex/skills`](</c:/Users/jorda/OneDrive/Documents/repos/stoneshapp/.codex/skills:1>) para que Codex pueda trabajar con patrones consistentes del proyecto.

## Estructura

```text
.codex/
`-- skills/
   |-- ui-feature/
   |   |-- SKILL.md
   |   `-- agents/openai.yaml
   |-- domain-modeling/
   |   |-- SKILL.md
   |   `-- agents/openai.yaml
   |-- refactor-safe/
   |   |-- SKILL.md
   |   `-- agents/openai.yaml
   `-- tauri-prep/
       |-- SKILL.md
       `-- agents/openai.yaml
```

## Como invocarlas

Usa la skill por nombre dentro del prompt:

- `Usa $ui-feature para construir la pantalla de inventario.`
- `Usa $domain-modeling para definir el dominio de loadouts y presets.`
- `Usa $refactor-safe para limpiar imports y duplicaciones en contratos.`
- `Usa $tauri-prep para preparar persistencia desktop sin acoplar la UI.`

Si el entorno de Codex no autodescubre skills locales del repo, menciona tambien la ruta:

- `Usa $ui-feature desde ./.codex/skills/ui-feature para extender Dashboard.`

## Cuando conviene cada skill en Stoneshapp

### `ui-feature`

Usarla para:

- nuevas pantallas o secciones del dashboard
- formularios del modulo de preparacion
- tarjetas, tablas guiadas o bloques visuales de contratos
- mejoras de layout y navegacion que deban respetar el tema actual

Evitarla para:

- modelado de tipos de negocio
- preparacion de Tauri o cambios nativos
- refactors puros sin cambios de UI

### `domain-modeling`

Usarla para:

- nuevos tipos en `src/domains`
- enums y unions para estados del juego o contratos
- mocks y contratos tipados para servicios
- preparar entidades que luego se persistan localmente

Evitarla para:

- cambios principalmente visuales
- ajustes de CSS o layout
- wiring nativo de Tauri

### `refactor-safe`

Usarla para:

- simplificar imports
- extraer helpers y componentes sin cambiar comportamiento
- mejorar nombres
- reducir duplicacion entre pages, features y services

Evitarla para:

- agregar features nuevas
- rehacer arquitectura completa
- rediseñar pantallas

### `tauri-prep`

Usarla para:

- ajustes de `vite.config.ts` y `src-tauri`
- bridges desktop en `src/integrations/desktop`
- documentar limites entre web y desktop
- preparar el overlay experimental sin implementarlo completo

Evitarla para:

- modelado puro de dominio
- UI normal no relacionada con desktop
- reglas del juego o recommendation engine

## Recomendacion practica

Para tareas mixtas, combina la skill dominante con otra de apoyo:

- nueva pantalla con mocks y tipos: `ui-feature` + `domain-modeling`
- limpieza tecnica sin cambiar UX: `refactor-safe`
- desktop adapter para una funcion futura: `tauri-prep` + `domain-modeling`
