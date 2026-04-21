---
name: ui-feature
description: Build or extend Stoneshapp frontend features in React + TypeScript. Use when adding a new page, section, form, card grid, dashboard block, navigation flow, or UI placeholder inside the existing app shell. Especially relevant for work that must reuse current components, routing, CSS theme, and feature/page boundaries without introducing heavy UI libraries.
---

# UI Feature

Build UI work in the same shape the repo already uses.

## Follow this workflow

1. Inspect the target route, page, feature folder, and reusable UI primitives before editing.
2. Reuse `src/components/ui`, `src/components/forms`, layouts, and existing section patterns before creating new primitives.
3. Keep composition in `pages/`, module-specific pieces in `features/`, and generic UI in `components/`.
4. Keep strings and labels in Spanish unless the surrounding code clearly uses another language.
5. Extend `src/styles/index.css` carefully and preserve the dark medieval, high-contrast visual language already established.
6. Prefer small presentational helpers over large page components.
7. Wire new UI to mocks or services already present in `src/services` or `src/domains`; do not sneak business rules into JSX.
8. Validate with typecheck/build after meaningful UI changes.

## Project-specific guardrails

- Keep the main app shell intact: sidebar, header, cards, spacing rhythm, and route titles should feel consistent.
- Prefer route-driven pages over modal-heavy flows unless the task explicitly asks for modals.
- Reuse cards, badges, section headers, empty states, and form fields before adding more variants.
- If a UI need is one-off and highly local, keep it inside the feature instead of promoting it to `components/ui`.
- Keep CSS simple: variables, layered utility classes, and feature-specific selectors are fine; avoid bringing a CSS-in-JS library.

## Limits

- Do not add a heavy UI framework unless the user explicitly asks.
- Do not move domain rules into components.
- Do not add global state for isolated page concerns.
- Do not redesign the whole product when the request is only one feature.
- Do not break the web-safe boundary needed for the future Tauri layer.

## Tone

Work like a product-minded frontend teammate: clear, restrained, visual, and practical. Favor legibility and maintainability over flashy novelty.

## Output checklist

- Route or page renders inside the existing layout.
- UI reuses current primitives where possible.
- New styles match the current theme and remain readable on desktop sizes.
- Business data comes from domain mocks or services, not inline ad hoc objects when avoidable.
- TypeScript stays strict and the build passes.
