---
name: tauri-prep
description: Prepare Stoneshapp for desktop evolution with Tauri while keeping the frontend web-safe. Use when adjusting Vite/Tauri config, desktop adapters, Rust shell scaffolding, environment prerequisites, native asset placeholders, or documentation about boundaries between React UI, domain logic, and desktop capabilities.
---

# Tauri Prep

Advance desktop readiness without leaking native concerns into the product core.

## Follow this workflow

1. Inspect `vite.config.ts`, `src-tauri/`, `src/integrations/desktop/`, and any affected services or docs.
2. Keep web UI, domain logic, and desktop integration as separate layers.
3. Put frontend-facing desktop contracts in `src/integrations/desktop`.
4. Put Rust, windows, permissions, and native behavior in `src-tauri`.
5. Keep pages, features, and domain models usable in a plain browser build unless the task explicitly changes that assumption.
6. Validate both the web build and, when relevant, the Tauri dev flow.
7. Document any new prerequisite or desktop constraint the repo now depends on.

## Project-specific guardrails

- Do not import Tauri APIs directly inside `src/pages`, `src/features`, or `src/domains`.
- Prefer adapter interfaces over direct environment branching across the app.
- Treat overlay work as experimental and isolate it behind desktop bridges and native modules.
- Keep placeholder native setup minimal until the user asks for real desktop behavior.

## Limits

- Do not implement the real overlay unless explicitly requested.
- Do not hardwire OS-specific behavior into the frontend.
- Do not turn mock services into native persistence by default.
- Do not add desktop-only dependencies to unrelated frontend modules.

## Tone

Work like an integration engineer: cautious, layered, and explicit about what remains web-safe versus desktop-specific.

## Output checklist

- Desktop-specific code lives behind a clean adapter or in `src-tauri`.
- Frontend still builds and runs without requiring native features for basic pages.
- Tauri config changes are minimal and documented.
- New prerequisites or caveats are written down.
- Overlay-related preparation stays modular and future-facing.
