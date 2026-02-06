# CLAUDE.md - Project Instructions

## Project Overview
A task/todo web application built with Vue 3 and Vite. Frontend-only with localStorage persistence.

## Tech Stack
- **Framework:** Vue 3 (Composition API with `<script setup>` syntax)
- **Build tool:** Vite
- **Styling:** Plain CSS (no UI library)
- **Storage:** localStorage
- **Testing:** Vitest (when added)

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npm test` — Run tests (when configured)

## Project Structure
```
src/
  components/    # Vue components
  stores/        # Reactive state management
  App.vue        # Root component
  main.js        # Entry point
  style.css      # Global styles
docs/
  DESIGN.md      # Architecture and data model
  FEATURES.md    # Feature specifications
```

## Coding Conventions
- Use Vue 3 Composition API with `<script setup>` — no Options API
- Single-file components (.vue) with `<script setup>`, `<template>`, `<style scoped>`
- Use `ref` and `reactive` for state; no Vuex/Pinia (keep it simple)
- CSS is scoped per component; global styles only in `src/style.css`
- No semicolons in JavaScript
- Single quotes for strings
- 2-space indentation
- Descriptive variable names; no abbreviations

## Design Documents
- See `docs/DESIGN.md` for architecture, component tree, and data model
- See `docs/FEATURES.md` for detailed feature specifications
