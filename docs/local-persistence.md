# Persistencia local

Stoneshapp usa una primera capa de persistencia local basada en `localStorage`.
La UI no accede directamente al navegador: consume servicios tipados por dominio.

## Capas

```text
src/shared/storage/
|-- adapter localStorage
|-- envelope versionado
|-- repositorios genericos
`-- claves de storage

src/features/<domain>/
|-- types/
|-- repositories/
`-- services/

src/services/
`-- fachadas compatibles con imports actuales
```

## Responsabilidades

- `src/shared/storage`
  - Define `StorageAdapter`, envelopes versionados y helpers genericos.
  - No conoce conceptos del producto.
- `src/features/*/repositories`
  - Conoce claves, seeds y forma persistida de cada dominio.
  - Puede cambiar de `localStorage` a SQLite/Tauri sin cambiar la UI.
- `src/features/*/services`
  - Expone funciones de negocio limpias para consultar y mutar datos.
- `src/services`
  - Mantiene compatibilidad con las pantallas actuales.

## Datos persistidos

- `profiles`: perfiles y perfil activo.
- `preparation-presets`: presets de preparacion.
- `contracts-progress`: estado y notas personales por contrato.
- `run-history`: historial de salidas.
- `overlay-settings`: configuracion del overlay.
- `app-settings`: configuracion general.

## Seeds

Si una clave no existe en storage, se inicializa desde los mocks del dominio.
El seed queda guardado inmediatamente para que los siguientes cambios persistan entre sesiones.

## Versionado

Cada recurso se guarda dentro de un envelope:

```ts
type StoredEnvelope<TData> = {
  schemaVersion: number;
  data: TData;
  seededAt: string;
  updatedAt: string;
};
```

Si cambia la version y no hay migracion registrada, el recurso vuelve al seed.
Cuando necesitemos migraciones reales, se agregaran funciones `migrate` por recurso.

## Regla de uso

No usar `localStorage` desde `pages`, `components`, `domains` o `services` de UI.
Toda persistencia debe pasar por repositorios de feature o por `src/shared/storage`.

## Futuro Tauri / SQLite

Para migrar a SQLite o storage nativo:

1. Implementar un nuevo `StorageAdapter` o repositorios especificos en `src/integrations/desktop`.
2. Mantener los contratos de `features/*/services`.
3. Reemplazar la implementacion interna de repositorios sin tocar pages/components.
