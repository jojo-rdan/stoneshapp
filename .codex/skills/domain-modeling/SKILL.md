---
name: domain-modeling
description: Model or evolve Stoneshapp business entities, mocks, enums, and service contracts in TypeScript. Use when introducing or refining product concepts such as profiles, contracts, preparation presets, history records, settings, recommendation outputs, or any new domain object that should stay independent from React components and desktop integrations.
---

# Domain Modeling

Shape business data so the UI and future integrations can evolve without rewrites.

## Follow this workflow

1. Start from the product concept and identify the stable nouns, statuses, and relationships.
2. Place types inside the correct `src/domains/<domain>/` folder.
3. Use unions or enums when they make invalid states harder to represent.
4. Add or update realistic mocks in the same domain folder.
5. Expose consumption through `src/services` when pages or features need access.
6. Update consumers so UI reads the new model through typed services or mocks instead of ad hoc local shapes.
7. Prefer additive evolution over broad rename churn unless the rename removes real ambiguity.

## Project-specific guardrails

- Keep domain files free of React, routing, window, or Tauri concerns.
- Preserve Spanish-facing content in mocks so UI remains representative.
- Model future desktop or persistence needs as interfaces or service boundaries, not direct implementations inside the domain.
- When a concept spans multiple modules, favor a shared type in the most natural domain instead of duplicating near-identical shapes.

## Limits

- Do not hide business logic in CSS, page files, or component props.
- Do not introduce global stores just to hold mock domain data.
- Do not collapse different product concepts into one generic catch-all type.
- Do not couple domain types to transport-specific shapes unless the user asks for an API contract explicitly.

## Tone

Work like a careful systems designer: explicit naming, minimal ambiguity, and strong type safety without overengineering.

## Output checklist

- Types are placed by domain and named clearly.
- Mocks are realistic enough to render the UI convincingly.
- Services or consumers use the new contracts consistently.
- Invalid states are reduced with unions, enums, or constrained fields where it helps.
- UI remains decoupled from business modeling details.
