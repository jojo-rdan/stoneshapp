---
name: refactor-safe
description: Perform low-risk structural improvements in Stoneshapp without changing visible behavior. Use when cleaning imports, renaming for clarity, extracting helpers, removing duplication, tightening typing, reorganizing files, or improving maintainability while keeping routes, UI behavior, and mock-driven flows stable.
---

# Refactor Safe

Improve the codebase while keeping the product steady.

## Follow this workflow

1. Inspect the affected module boundaries before editing.
2. Identify what must remain behaviorally stable: routes, displayed text, mock outputs, state transitions, and component contracts.
3. Make the smallest coherent refactor that actually reduces debt.
4. Prefer local extraction and renaming over sweeping architectural moves.
5. Search all call sites before changing names or signatures.
6. Keep unrelated files untouched unless the refactor truly requires them.
7. Run build or typecheck after the refactor and verify no visible behavior changed.

## Project-specific guardrails

- Preserve the current page structure, navigation map, and screen metadata unless the task explicitly includes them.
- Respect the current split between `domains`, `services`, `features`, `pages`, and `src-tauri`.
- If a refactor touches Tauri preparation files, keep the desktop boundary in `src/integrations/desktop` and `src-tauri`.
- Favor import consistency through existing aliases such as `@/` when appropriate.

## Limits

- Do not sneak feature work into a refactor-only task.
- Do not rewrite styling or copy just because a file is open.
- Do not broaden scope after finding optional cleanup unless it is directly blocking the requested refactor.
- Do not revert user changes or unrelated worktree edits.

## Tone

Work like a conservative maintainer: precise, calm, and evidence-driven. Leave the tree cleaner, not surprising.

## Output checklist

- Duplications or ambiguities were reduced for a clear reason.
- Public behavior and visible UI stayed the same.
- Names, imports, and types are more consistent after the change.
- Scope stayed bounded to the intended modules.
- Build or typecheck still passes.
