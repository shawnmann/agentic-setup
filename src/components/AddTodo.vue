<script setup>
import { ref } from 'vue'
import { useTodoStore } from '../stores/todoStore'

const { addTodo } = useTodoStore()
const newText = ref('')
const newPriority = ref(null)

const priorities = [
  { value: null, label: 'None' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
]

function handleSubmit() {
  addTodo(newText.value, newPriority.value)
  newText.value = ''
  newPriority.value = null
}
</script>

<template>
  <form class="add-todo" @submit.prevent="handleSubmit">
    <input
      v-model="newText"
      type="text"
      placeholder="What needs to be done?"
      autofocus
    />
    <div class="priority-select">
      <button
        v-for="p in priorities"
        :key="p.label"
        type="button"
        class="priority-option"
        :class="[
          p.value ? `priority-${p.value}` : 'priority-none',
          { selected: newPriority === p.value }
        ]"
        @click="newPriority = p.value"
      >
        {{ p.label }}
      </button>
    </div>
    <button type="submit" class="btn-add">Add</button>
  </form>
</template>

<style scoped>
.add-todo {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.add-todo input {
  flex: 1;
  min-width: 0;
}

.priority-select {
  display: flex;
  gap: 0.25rem;
}

.priority-option {
  background: transparent;
  color: var(--color-text-muted);
  padding: 0.3em 0.6em;
  font-size: 0.75rem;
  border: 1px solid var(--color-border);
}

.priority-option.selected {
  color: var(--color-text);
}

.priority-option.priority-high.selected {
  border-color: var(--color-priority-high);
  color: var(--color-priority-high);
}

.priority-option.priority-medium.selected {
  border-color: var(--color-priority-medium);
  color: var(--color-priority-medium);
}

.priority-option.priority-low.selected {
  border-color: var(--color-priority-low);
  color: var(--color-priority-low);
}

.priority-option.priority-none.selected {
  border-color: var(--color-text-muted);
}

.btn-add {
  background: var(--color-accent);
  color: #fff;
  font-weight: 600;
  padding: 0.6em 1.4em;
  flex-shrink: 0;
}
</style>
