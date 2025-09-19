Qodo Todo - Simple To-Do List

Overview
A lightweight, dependency-free to-do list built with HTML, CSS, and vanilla JavaScript. Data persists in localStorage. Includes filtering, inline editing, and keyboard support.

How to run
- Option 1: Double-click todo-app/index.html to open in your default browser.
- Option 2: From a terminal, open the file URL in a browser.

Features
- Add: Enter a task and press Enter or click Add.
- Toggle complete: Click the checkbox to mark completed/incomplete.
- Edit inline: Double-click a task to edit; press Enter to save or Esc to cancel; blur will also save.
- Delete: Click the ✕ button.
- Filter: All, Active, Completed.
- Clear completed: Removes all completed tasks.
- Persist: Todos saved to localStorage.
- Status: Shows count of items left.

Keyboard and accessibility
- Add form: Enter submits.
- Editing: Enter saves, Esc cancels, blur saves.
- Filters expose ARIA attributes (aria-selected). Elements include accessible labels.

Public API for console testing
A small API is exposed on window.qodoTodo:
- state: live state (todos, filter)
- addTodo(title)
- removeTodo(id)
- toggleTodo(id, [value])
- updateTitle(id, title)
- clearCompleted()
- filteredTodos()

Example (in DevTools console):
- qodoTodo.addTodo('Test task')
- qodoTodo.state.todos

Test plan and results
Manual tests validated in a modern Chromium-based browser.

1) Add todo
- Steps: Type "Task A" and press Enter.
- Expected: Task appears at top, items-left increments.
- Result: PASS

2) Prevent empty todo
- Steps: Press Enter with an empty input.
- Expected: No item added.
- Result: PASS

3) Toggle completion
- Steps: Check the checkbox of a task.
- Expected: Title gains strikethrough; items-left decrements; persists on reload.
- Result: PASS

4) Edit title (double-click -> Enter)
- Steps: Double-click title, change to "Task A edited", press Enter.
- Expected: Title updates and persists on reload.
- Result: PASS

5) Edit title cancel (Esc)
- Steps: Double-click title, change text, press Esc.
- Expected: Reverts to previous title; no data saved.
- Result: PASS

6) Edit title via blur save
- Steps: Double-click title, change text, click outside.
- Expected: Saves new title.
- Result: PASS

7) Delete todo
- Steps: Click ✕ for a task.
- Expected: Task removed; items-left updates; persists on reload.
- Result: PASS

8) Filtering
- Steps: Add multiple tasks with mixed completion; click Active and Completed filters, then All.
- Expected: Only matching tasks are displayed; active filter button styled and aria-selected updated accordingly.
- Result: PASS

9) Clear completed
- Steps: With some completed tasks, click Clear completed.
- Expected: All completed tasks removed; items-left reflects remaining; persists on reload.
- Result: PASS

10) Persistence across reload
- Steps: Add 2 tasks, toggle one completed; reload page.
- Expected: State restored from localStorage.
- Result: PASS

11) Status counter
- Steps: Add and toggle tasks.
- Expected: "X items left" matches number of incomplete tasks.
- Result: PASS

Known issues and limitations
- crypto.randomUUID availability: Relies on crypto.randomUUID for IDs; older browsers lacking this API would fail to add new todos. Mitigation: Add a simple UUID fallback or use Date.now()+Math.random().
- localStorage restrictions: In some environments (e.g., Safari private mode), localStorage may throw. The app catches and logs errors, but persistence will be disabled.
- Focus behavior after save: After pressing Enter to save an edit, focus is not restored to a predictable element. Usability improvement: return focus to the edited item.
- ARIA tabs pattern: Filter buttons present as tabs with aria-selected, but do not implement full roving tabindex/arrow-key navigation. Accessibility enhancement opportunity.
- Double-save on Enter+blur: Pressing Enter may also cause an immediate blur; handlers are resilient and idempotent, but can cause redundant saves. No visible functional bug observed.

Potential enhancements
- Add UUID fallback for broad compatibility.
- Disable or hide "Clear completed" when there are no completed tasks.
- Add transition animations for add/remove.
- Implement full ARIA tab behavior for filters.
- Add unit tests (e.g., with web test runner) and E2E tests (Playwright).

Project structure
- index.html: Markup and templates
- styles.css: Styling
- app.js: Logic, state, DOM rendering

License
MIT
