# Qodo - Simple To-Do List

## Overview
A lightweight, dependency-free to-do list built with HTML, CSS, and vanilla JavaScript. Data persists in localStorage. Includes filtering, inline editing, and keyboard support.

#### Project structure
- index.html: Markup and templates
- styles.css: Styling
- app.js: Logic, state, DOM rendering

### How to run
- Option 1: Double-click todo-app/index.html to open in your default browser. (if Live preview VS code extension is downloaded)
- Option 2: From a terminal, open the file URL in a browser.

#### Features
- Add: Enter a task and press Enter or click Add.
- Toggle complete: Click the checkbox to mark completed/incomplete.
- Edit inline: Double-click a task to edit; press Enter to save or Esc to cancel; blur will also save.
- Delete: Click the ✕ button.
- Filter: All, Active, Completed.
- Clear completed: Removes all completed tasks.
- Persist: Todos saved to localStorage.
- Status: Shows count of items left.

#### Keyboard and accessibility
- Add form: Enter submits.
- Editing: Enter saves, Esc cancels, blur saves.
- Filters expose ARIA attributes (aria-selected). Elements include accessible labels.


**License:
MIT**
