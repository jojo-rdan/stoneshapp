# Evolucion a Desktop con Tauri

## Estado actual de la estructura

La base actual ya va en una direccion correcta para desktop:

- `src/app`, `src/layouts` y `src/pages` contienen el shell y la navegacion.
- `src/components` y `src/features` concentran la UI reutilizable y los modulos.
- `src/domains` guarda los tipos y mocks del negocio.
- `src/services` funciona como una capa de acceso a datos y reglas mock.

Eso permite sumar capacidades desktop sin mezclar Tauri directamente con la capa visual.

## Ajustes minimos aplicados

- `vite.config.ts` ahora usa una configuracion amigable para Tauri:
  - `clearScreen: false`
  - puerto fijo `5173`
  - `strictPort: true`
  - soporte para `TAURI_DEV_HOST`
- Se agrego `src-tauri/` con un scaffold base:
  - `Cargo.toml`
  - `build.rs`
  - `src/main.rs`
  - `src/lib.rs`
  - `tauri.conf.json`
  - `capabilities/default.json`
- Se agrego `src/integrations/desktop/` para centralizar futuros bridges web/desktop.

## Que debe permanecer desacoplado del entorno desktop

Estas capas deben seguir funcionando igual en navegador o en Tauri:

- `src/domains`
  - Tipos de negocio, enums, mocks y modelos puros.
- `src/services`
  - Reglas de dominio y acceso a datos mock o persistencia local.
  - No deberian importar APIs de Tauri.
- `src/features`
  - Componentes y estado local del producto.
  - Pueden consumir un bridge abstracto, pero no `@tauri-apps/api` de forma directa.
- `src/pages`
  - Deben seguir siendo pantallas de composicion y navegacion.

## Donde debe vivir lo desktop

Separar desktop en dos lados:

### Frontend

Usar `src/integrations/desktop/` para exponer contratos estables:

- `desktop.types.ts`: interfaces compartidas para capacidades desktop.
- `desktopBridge.ts`: implementacion web segura por defecto.

Cuando llegue Tauri real, la idea es sumar alli una implementacion especifica para desktop y mantener la UI consumiendo solo esa interfaz.

### Rust / Tauri

Usar `src-tauri/` para lo nativo:

- ventanas nativas
- comandos Rust
- acceso a archivos, sistema, tray, hotkeys y procesos
- permisos y capacidades

## Organizacion sugerida para el overlay experimental

Mantenerlo dividido por responsabilidad:

- `src/domains/overlay`
  - tipos de configuracion, estado y preferencias del overlay
- `src/features/overlay`
  - formulario de settings, preview web-safe y componentes visuales
- `src/integrations/desktop`
  - bridge para abrir, cerrar o actualizar una ventana overlay
- `src-tauri/src/overlay`
  - modulo nativo futuro para manejar ventana flotante, posicion, transparencia y reloj

## Regla practica

Si una pieza necesita saber de ventanas nativas, permisos del sistema, tray icon o APIs de Tauri, no debe vivir en `pages`, `features`, `services` o `domains`. Debe pasar por `src/integrations/desktop` y terminar ejecutandose en `src-tauri`.

## Proximo paso recomendado

Cuando decidamos integrar Tauri de verdad:

1. Instalar `@tauri-apps/cli` y correr `tauri dev`.
2. Crear una implementacion real del `desktopBridge`.
3. Mover el futuro overlay a un flujo basado en comandos/ventanas de Tauri.
4. Definir persistencia local desktop sin mezclarla con la UI.
