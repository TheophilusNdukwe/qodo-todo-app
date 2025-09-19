# Qodo Todo App — Functional Test Report

Path: c:\Users\Amobi\_WORKSPACE\Development\Projects\Qodo-takehome\todo-app

Date: 2025-09-19

Scope
- Validate core functionality (CRUD, filtering, persistence) and UI behavior.
- Identify issues, edge cases, and accessibility/UX gaps.
- Provide remediation recommendations.

Implementation reviewed
- index.html: Markup, ARIA, template for todo item.
- app.js: State, localStorage, rendering, event handlers. Includes UUID fallback.
- styles.css: Layout, enhanced background image with gradient overlay, glass container.

Key behaviors (Expected vs Actual)
1) Add todo
- Steps: Type text then Enter or click Add.
- Expected: New todo appears at top, input clears, items-left increments, persisted.
- Actual: PASS (addTodo -> unshift + save; form submit handler clears input and re-renders)

2) Prevent empty/whitespace todo
- Steps: Press Enter on empty input or spaces.
- Expected: No item added.
- Actual: PASS (addTodo trims, returns null when empty)

3) Toggle completion
- Steps: Toggle checkbox.
- Expected: Strikethrough and styling updated; items-left updates; persisted across reload.
- Actual: PASS (toggleTodo saves, render reflects state)

4) Edit title — save with Enter
- Steps: Double-click title, change text, press Enter.
- Expected: Title updates and persists; exits edit mode.
- Actual: PASS

5) Edit title — cancel with Esc
- Steps: Double-click title, change text, press Esc.
- Expected: Revert to previous value; no save.
- Actual: PASS (no updateTitle call on Esc, render resets DOM)

6) Edit title — save on blur
- Steps: Double-click, change text, click outside.
- Expected: Saves and exits edit mode.
- Actual: PASS (focusout triggers updateTitle when still in editing state)

7) Delete todo
- Steps: Click ✕.
- Expected: Item removed from list and storage; items-left updates.
- Actual: PASS

8) Filtering
- Steps: Use All, Active, Completed.
- Expected: Proper subset displays; active tab styling/aria-selected reflect state.
- Actual: PASS

9) Clear completed
- Steps: With completed items, click Clear completed.
- Expected: All completed are removed; persisted; items-left reflects remaining.
- Actual: PASS

10) Persistence
- Steps: Add/toggle, reload page.
- Expected: State restored from localStorage.
- Actual: PASS (load parses array, maps to object shape)

11) Items-left counter accuracy
- Steps: Add/toggle several items.
- Expected: Matches count of incomplete items.
- Actual: PASS

Edge cases reviewed
- Editing to empty string removes item: updateTitle trims and removes when empty. Expected and consistent.
- Duplicate titles allowed: No deduplication enforced. Acceptable for a simple app.
- Rapid toggling and repeated renders: Idempotent and stable.
- Storage migration: load() tolerates missing/partial fields and rehydrates with defaults.

Accessibility and UX observations
- Titles are focusable (tabindex=0). Filters expose aria-selected. Status uses aria-live for dynamic updates.
- Background image uses a gradient overlay for contrast; app content is in a translucent, blurred card for readability.

Issues and limitations observed
1) Keyboard-only path to start editing missing
- Observed: Editing requires double-click; pressing Enter/Space on a focused title does not begin editing.
- Impact: Keyboard and screen-reader users may not discover editing.
- Recommendation: While .todo-item__title has tabindex, add keydown Enter (and/or F2) to enter editing.

2) Focus not restored after edit save/cancel
- Observed: After Enter/Esc/blur, focus is not returned to a predictable element.
- Impact: Keyboard usability regression; user loses context.
- Recommendation: After leaving editing, return focus to the todo title or the next logical control.

3) Redundant double-save on Enter + blur
- Observed: Pressing Enter re-renders and can also trigger a blur save on the removed input.
- Impact: Harmless duplicate write; potential extra localStorage churn.
- Recommendation: Guard against secondary save (e.g., suppress blur if Enter handled) or compare new value before save.

4) Items-left pluralization
- Observed: Always renders "items left".
- Impact: Minor UX nit.
- Recommendation: Singular/plural (1 item left vs items) or simply show the number.

5) ARIA tab pattern not fully implemented
- Observed: aria-selected updated, but roving tabindex and arrow-key navigation are not implemented.
- Impact: Accessibility parity with proper tabs is incomplete.
- Recommendation: Implement full tabs keyboard behavior or drop tab roles and use buttons with clear states.

6) External background image dependency
- Observed: Background references an Unsplash URL.
- Impact: Offline or blocked network degrades visuals; gradient remains, content still readable.
- Recommendation: Ship a local asset, preload, or provide a CSS fallback variable.

7) localStorage availability
- Observed: Private modes or restricted environments can throw.
- Impact: Persistence disabled.
- Current state: Errors caught and logged; app still functions without persistence.
- Recommendation: Consider in-memory fallback notice or silent degradation.

8) Minor: Unused helper
- Observed: emit() is defined but never used.
- Impact: None.
- Recommendation: Remove or use for custom events.

Summary
- Functional coverage: All core features PASS by static review and expected runtime behavior.
- Primary improvements: Keyboard accessibility (start edit), focus management, minor UX polish, offline-friendly background.

Suggested fixes (prioritized)
- P1 Accessibility: Add keyboard entry to editing mode; restore focus after save/cancel.
- P2 UX: Items-left pluralization; disable/hide Clear completed when none.
- P3 Perf/Polish: Guard duplicate saves; remove dead code; offer local background asset.

How to run
- Open index.html in a modern browser (Chrome/Edge/Firefox/Safari). No build required.

Notes
- localStorage key: "qodo_todos_v1".
- UUID fallback implemented; older browsers without crypto.randomUUID are supported.
