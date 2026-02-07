<script setup>
import { useTodoStore } from '../stores/todoStore'

const {
  filter, priorityFilter, categoryFilter, categories,
  activeCount, hasCompleted,
  setFilter, setPriorityFilter, setCategoryFilter, clearCompleted
} = useTodoStore()

const statusFilters = ['all', 'active', 'completed']
const priorityFilters = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'none', label: 'None' }
]
</script>

<template>
  <div class="filter-bar">
    <div class="filter-row">
      <span class="task-count">{{ activeCount }} item{{ activeCount === 1 ? '' : 's' }} left</span>
      <div class="filter-buttons">
        <button
          v-for="f in statusFilters"
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
    <div class="filter-row">
      <span class="filter-label">Priority:</span>
      <div class="filter-buttons">
        <button
          v-for="p in priorityFilters"
          :key="p.value"
          :class="[
            { active: priorityFilter === p.value },
            p.value !== 'all' && p.value !== 'none' ? `priority-filter-${p.value}` : ''
          ]"
          @click="setPriorityFilter(p.value)"
        >
          {{ p.label }}
        </button>
      </div>
    </div>
    <div class="filter-row" v-if="categories.length">
      <span class="filter-label">Category:</span>
      <div class="filter-buttons">
        <button
          :class="{ active: categoryFilter === 'all' }"
          @click="setCategoryFilter('all')"
        >
          All
        </button>
        <button
          :class="{ active: categoryFilter === 'uncategorized' }"
          @click="setCategoryFilter('uncategorized')"
        >
          None
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="{ active: categoryFilter === cat.id }"
          :style="categoryFilter === cat.id ? { borderColor: cat.color, color: cat.color } : {}"
          @click="setCategoryFilter(cat.id)"
        >
          <span class="cat-filter-dot" :style="{ background: cat.color }"></span>
          {{ cat.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 0;
  font-size: 0.875rem;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.task-count {
  color: var(--color-text-muted);
}

.filter-label {
  color: var(--color-text-muted);
}

.filter-buttons {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.filter-buttons button {
  background: transparent;
  color: var(--color-text-muted);
  padding: 0.3em 0.75em;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.filter-buttons button.active {
  border-color: var(--color-accent);
  color: var(--color-text);
}

.filter-buttons button.active.priority-filter-high {
  border-color: var(--color-priority-high);
  color: var(--color-priority-high);
}

.filter-buttons button.active.priority-filter-medium {
  border-color: var(--color-priority-medium);
  color: var(--color-priority-medium);
}

.filter-buttons button.active.priority-filter-low {
  border-color: var(--color-priority-low);
  color: var(--color-priority-low);
}

.filter-buttons button:hover {
  color: var(--color-text);
}

.cat-filter-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
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
