<script setup>
import { useTodoStore } from '../stores/todoStore'

const { filter, activeCount, hasCompleted, setFilter, clearCompleted } = useTodoStore()

const filters = ['all', 'active', 'completed']
</script>

<template>
  <div class="filter-bar">
    <span class="task-count">{{ activeCount }} item{{ activeCount === 1 ? '' : 's' }} left</span>
    <div class="filter-buttons">
      <button
        v-for="f in filters"
        :key="f"
        :class="{ active: filter === f }"
        @click="setFilter(f)"
      >
        {{ f.charAt(0).toUpperCase() + f.slice(1) }}
      </button>
    </div>
    <button
      v-if="hasCompleted"
      class="btn-clear"
      @click="clearCompleted"
    >
      Clear completed
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem 0;
  font-size: 0.875rem;
}

.task-count {
  color: var(--color-text-muted);
}

.filter-buttons {
  display: flex;
  gap: 0.25rem;
}

.filter-buttons button {
  background: transparent;
  color: var(--color-text-muted);
  padding: 0.3em 0.75em;
  border: 1px solid transparent;
}

.filter-buttons button.active {
  border-color: var(--color-accent);
  color: var(--color-text);
}

.filter-buttons button:hover {
  color: var(--color-text);
}

.btn-clear {
  background: transparent;
  color: var(--color-text-muted);
  text-decoration: underline;
  padding: 0.3em 0.5em;
}

.btn-clear:hover {
  color: var(--color-accent);
}
</style>
