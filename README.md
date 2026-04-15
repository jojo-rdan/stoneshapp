# Stoneshapp

Stoneshapp es una desktop companion app en español para **Stoneshard**.
El MVP actual se centra en una base frontend limpia y modular para preparar salidas, consultar contratos, revisar historial de runs y explorar un futuro módulo de overlay. Todavía trabaja con mocks y servicios locales, pero ya está organizado para conectar persistencia real y una capa desktop con Tauri más adelante.

## Stack

- React 18
- TypeScript estricto
- Vite
- React Router
- CSS plano con variables y componentes reutilizables

## Cómo ejecutar el proyecto

Instalar dependencias:

```bash
npm install
```

Levantar entorno de desarrollo:

```bash
npm run dev
```

Generar build de producción:

```bash
npm run build
```

Previsualizar la build:

```bash
npm run preview
```

Nota para Windows + PowerShell:
si la política de ejecución bloquea `npm`, usa `npm.cmd run dev`, `npm.cmd run build`, etc.

## Estructura de carpetas

```text
stoneshapp/
├─ index.html
├─ package.json
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ src/
   ├─ app/
   │  ├─ providers/
   │  ├─ App.tsx
   │  ├─ router.tsx
   │  ├─ routes.ts
   │  └─ screenMeta.ts
   ├─ components/
   │  ├─ forms/
   │  ├─ navigation/
   │  └─ ui/
   ├─ data/
   │  └─ navigation.ts
   ├─ domains/
   │  ├─ contracts/
   │  ├─ history/
   │  ├─ overlay/
   │  ├─ player/
   │  ├─ preparation/
   │  ├─ recommendations/
   │  └─ settings/
   ├─ features/
   │  ├─ contracts/
   │  ├─ dungeon-prep/
   │  └─ overlay/
   ├─ hooks/
   ├─ layouts/
   ├─ pages/
   ├─ services/
   ├─ styles/
   ├─ types/
   │  ├─ dashboard.ts
   │  └─ navigation.ts
   ├─ main.tsx
   └─ vite-env.d.ts
```

### Guía rápida de arquitectura

- `domains/`: modelos y mocks del negocio, separados por concepto del producto.
- `services/`: capa fina de acceso a datos/mock preparada para reemplazarse luego por persistencia.
- `features/`: componentes y lógica de cada módulo funcional.
- `pages/`: pantallas conectadas al router.
- `components/ui` y `components/forms`: base visual reutilizable.
- `layouts/`: shell principal con sidebar y header persistentes.

## Estado actual del MVP visual

- Dashboard con accesos rápidos y resumen del estado de la sesión.
- Preparar salida con formulario, validación básica y checklist mock.
- Contratos con buscador, filtros, detalle guiado y acciones mock.
- Perfil con listado de perfiles y detalle del seleccionado.
- Historial con runs previas, faltantes, sobrantes y observaciones.
- Overlay settings con controles mock y vista previa simple.
- Configuración con preferencias base del MVP.

## Próximos pasos

- Reemplazar generadores mock por un recommendation engine real.
- Añadir persistencia local para contratos, notas, perfiles y configuración.
- Integrar shell desktop con Tauri.
- Separar mejor estado de lectura y escritura cuando aparezcan flujos más complejos.
- Añadir tests para servicios de dominio y reglas del recomendador.
