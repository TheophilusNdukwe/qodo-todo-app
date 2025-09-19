// Qodo Todo App - Vanilla JS, no dependencies
// Features: add, toggle, edit, delete, filter, clear completed, persist via localStorage

const STORAGE_KEY = 'qodo_todos_v1';
const uuid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8));

/** @typedef {{ id: string, title: string, completed: boolean, createdAt: number }} Todo */

const qs = (sel, el = document) => el.querySelector(sel);
const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));
const on = (el, ev, fn, opts) => el.addEventListener(ev, fn, opts);
const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(name, { detail }));

const state = {
  /** @type {Todo[]} */
  todos: [],
  filter: 'all', // 'all' | 'active' | 'completed'
};

function load() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        state.todos = parsed.filter(x => x && typeof x.title === 'string').map(x => ({
          id: String(x.id || uuid()),
          title: String(x.title).trim(),
          completed: Boolean(x.completed),
          createdAt: Number(x.createdAt || Date.now()),
        }));
      }
    }
  } catch (e) {
    console.warn('Failed to load todos from storage', e);
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
  } catch (e) {
    console.warn('Failed to save todos to storage', e);
  }
}

function addTodo(title) {
  const t = title.trim();
  if (!t) return null;
  const todo = { id: uuid(), title: t, completed: false, createdAt: Date.now() };
  state.todos.unshift(todo);
  save();
  return todo;
}

function removeTodo(id) {
  const idx = state.todos.findIndex(t => t.id === id);
  if (idx !== -1) {
    state.todos.splice(idx, 1);
    save();
    return true;
  }
  return false;
}

function toggleTodo(id, value) {
  const t = state.todos.find(t => t.id === id);
  if (!t) return false;
  t.completed = typeof value === 'boolean' ? value : !t.completed;
  save();
  return true;
}

function updateTitle(id, title) {
  const t = state.todos.find(t => t.id === id);
  if (!t) return false;
  const val = title.trim();
  if (!val) {
    removeTodo(id);
    return true;
  }
  t.title = val;
  save();
  return true;
}

function clearCompleted() {
  const before = state.todos.length;
  state.todos = state.todos.filter(t => !t.completed);
  const changed = state.todos.length !== before;
  if (changed) save();
  return changed;
}

function filteredTodos() {
  switch (state.filter) {
    case 'active': return state.todos.filter(t => !t.completed);
    case 'completed': return state.todos.filter(t => t.completed);
    default: return state.todos.slice();
  }
}

function itemsLeft() {
  return state.todos.filter(t => !t.completed).length;
}

// DOM rendering
const listEl = qs('#todo-list');
const itemsLeftEl = qs('#items-left');
const template = qs('#todo-item-template');

function render() {
  // filters
  qsa('.filter').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.filter === state.filter);
    btn.setAttribute('aria-selected', String(btn.dataset.filter === state.filter));
  });

  // list
  listEl.innerHTML = '';
  const todos = filteredTodos();
  const frag = document.createDocumentFragment();
  for (const t of todos) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.id = t.id;
    node.classList.toggle('completed', t.completed);

    const checkbox = qs('input.toggle', node);
    checkbox.checked = t.completed;

    const title = qs('.todo-item__title', node);
    title.textContent = t.title;
    title.title = t.title;

    const edit = qs('.todo-item__edit', node);
    edit.value = t.title;

    frag.appendChild(node);
  }
  listEl.appendChild(frag);

  // status
  itemsLeftEl.textContent = String(itemsLeft());
}

// Event binding
function bindEvents() {
  const form = qs('#new-todo-form');
  const input = qs('#new-todo-input');

  on(form, 'submit', e => {
    e.preventDefault();
    const todo = addTodo(input.value);
    if (todo) {
      input.value = '';
      render();
    }
  });

  on(listEl, 'click', e => {
    const btn = e.target.closest('.todo-item__delete');
    if (!btn) return;
    const li = btn.closest('.todo-item');
    if (!li) return;
    removeTodo(li.dataset.id);
    render();
  });

  on(listEl, 'change', e => {
    const cb = e.target.closest('input.toggle');
    if (!cb) return;
    const li = cb.closest('.todo-item');
    if (!li) return;
    toggleTodo(li.dataset.id, cb.checked);
    render();
  });

  on(listEl, 'dblclick', e => {
    const title = e.target.closest('.todo-item__title');
    if (!title) return;
    const li = title.closest('.todo-item');
    if (!li) return;
    li.classList.add('editing');
    const edit = qs('.todo-item__edit', li);
    edit.value = title.textContent || '';
    edit.focus();
    edit.setSelectionRange(edit.value.length, edit.value.length);
  });

  on(listEl, 'keydown', e => {
    const edit = e.target.closest('.todo-item__edit');
    if (!edit) return;
    const li = edit.closest('.todo-item');
    if (!li) return;

    if (e.key === 'Enter') {
      updateTitle(li.dataset.id, edit.value);
      li.classList.remove('editing');
      render();
    } else if (e.key === 'Escape') {
      li.classList.remove('editing');
      render();
    }
  });

  on(listEl, 'focusout', e => {
    const edit = e.target.closest('.todo-item__edit');
    if (!edit) return;
    const li = edit.closest('.todo-item');
    if (!li) return;
    if (li.classList.contains('editing')) {
      // Save on blur as well
      updateTitle(li.dataset.id, edit.value);
      li.classList.remove('editing');
      render();
    }
  });

  on(qs('.filters'), 'click', e => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    state.filter = btn.dataset.filter;
    render();
  });

  on(qs('#clear-completed-btn'), 'click', () => {
    if (clearCompleted()) {
      render();
    }
  });
}

// Initialize
load();
render();
bindEvents();

// Expose for manual testing in console
window.qodoTodo = { state, addTodo, removeTodo, toggleTodo, updateTitle, clearCompleted, filteredTodos };
