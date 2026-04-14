# Stoneshapp

Base frontend inicial para una companion desktop app de **Stoneshard**, preparada para crecer hacia Tauri en iteraciones posteriores.

## Stack

- React 18
- TypeScript estricto
- Vite
- React Router

## Estructura propuesta

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
   ├─ components/
   ├─ data/
   ├─ features/
   ├─ hooks/
   ├─ layouts/
   ├─ pages/
   ├─ services/
   ├─ styles/
   ├─ types/
   ├─ main.tsx
   └─ vite-env.d.ts
```

## Correr el proyecto

```bash
npm install
npm run dev
```

## Siguientes pasos sugeridos

- Integrar Tauri con `src-tauri/` cuando el shell desktop esté listo.
- Sustituir mocks por servicios reales o almacenamiento local.
- Añadir estado compartido por módulo cuando aparezca lógica compleja.

