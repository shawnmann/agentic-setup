# Architecture & Design

## Overview
Single-page todo application. All state lives in a reactive JavaScript store and is synchronized to localStorage on every mutation.

## Component Tree
```
App.vue
├── AddTodo.vue        # Text input + priority selector + submit button
├── FilterBar.vue      # Status filters, priority filters, clear completed, task count
└── TodoList.vue
    └── TodoItem.vue   # Individual task: checkbox, priority badge, label, edit, delete
```

## Data Model

### Todo Item
```js
{
  id: crypto.randomUUID(),  // unique string ID
  text: 'Buy groceries',    // task description
  completed: false,          // boolean status
  priority: null,            // null | 'high' | 'medium' | 'low'
  createdAt: Date.now()      // timestamp for ordering
}
```

### Store State
```js
{
  todos: [],              // Array<Todo> — the full list
  filter: 'all',          // 'all' | 'active' | 'completed'
  priorityFilter: 'all'   // 'all' | 'high' | 'medium' | 'low' | 'none'
}
```

## State Management
- A single composable (`src/stores/todoStore.js`) exports reactive state and action functions
- Uses Vue `ref`/`computed` — no external state library
- Every mutation calls a `persist()` helper that writes `todos` to `localStorage`
- On app load, `todos` is initialized from `localStorage` (falling back to empty array)

## localStorage Schema
- **Key:** `vue-todo-app`
- **Value:** JSON-serialized array of Todo items

## Styling Approach
- Global reset and base styles in `src/style.css`
- Component styles use `<style scoped>`
- CSS custom properties for colors/spacing (defined in `style.css`)
- Mobile-first responsive layout; single-column, max-width container
