# Architecture & Design

## Overview
Single-page todo application. All state lives in a reactive JavaScript store and is synchronized to localStorage on every mutation.

## Component Tree
```
App.vue
├── CategoryManager.vue  # Create/delete categories (toggle visibility)
├── AddTodo.vue          # Text input + priority selector + category dropdown + submit
├── FilterBar.vue        # Status filters, priority filters, category filters, clear completed, task count
└── TodoList.vue
    └── TodoItem.vue     # Individual task: checkbox, priority badge, category label, text, edit, delete
```

## Data Model

### Todo Item
```js
{
  id: crypto.randomUUID(),  // unique string ID
  text: 'Buy groceries',    // task description
  completed: false,          // boolean status
  priority: null,            // null | 'high' | 'medium' | 'low'
  categoryId: null,          // null | category ID string
  createdAt: Date.now()      // timestamp for ordering
}
```

### Category
```js
{
  id: crypto.randomUUID(),  // unique string ID
  name: 'Work',             // display name
  color: '#a855f7'          // random hex color from curated palette
}
```

### Store State
```js
{
  todos: [],              // Array<Todo> — the full list
  categories: [],         // Array<Category> — user-defined categories
  filter: 'all',          // 'all' | 'active' | 'completed'
  priorityFilter: 'all',  // 'all' | 'high' | 'medium' | 'low' | 'none'
  categoryFilter: 'all'   // 'all' | 'uncategorized' | <categoryId>
}
```

## State Management
- A single composable (`src/stores/todoStore.js`) exports reactive state and action functions
- Uses Vue `ref`/`computed` — no external state library
- Every mutation calls a `persist()` helper that writes `todos` to `localStorage`
- On app load, `todos` is initialized from `localStorage` (falling back to empty array)

## localStorage Schema
- **Key:** `vue-todo-app` — JSON-serialized array of Todo items
- **Key:** `vue-todo-app-categories` — JSON-serialized array of Category items

## Styling Approach
- Global reset and base styles in `src/style.css`
- Component styles use `<style scoped>`
- CSS custom properties for colors/spacing (defined in `style.css`)
- Mobile-first responsive layout; single-column, max-width container
