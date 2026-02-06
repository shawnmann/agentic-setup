<script setup>
import { ref, nextTick } from 'vue'

const PRIORITY_CYCLE = [null, 'high', 'medium', 'low']

const props = defineProps({
  todo: { type: Object, required: true }
})

const emit = defineEmits(['toggle', 'remove', 'edit', 'set-priority'])

const editing = ref(false)
const editText = ref('')
const editInput = ref(null)

function startEdit() {
  editing.value = true
  editText.value = props.todo.text
  nextTick(() => editInput.value?.focus())
}

function saveEdit() {
  editing.value = false
  emit('edit', props.todo.id, editText.value)
}

function cancelEdit() {
  editing.value = false
}

function cyclePriority() {
  const currentIndex = PRIORITY_CYCLE.indexOf(props.todo.priority ?? null)
  const nextIndex = (currentIndex + 1) % PRIORITY_CYCLE.length
  emit('set-priority', props.todo.id, PRIORITY_CYCLE[nextIndex])
}

function priorityLabel(priority) {
  if (!priority) return null
  return priority.charAt(0).toUpperCase()
}
</script>

<template>
  <li class="todo-item" :class="{ completed: todo.completed }">
    <template v-if="!editing">
      <input
        type="checkbox"
        class="todo-checkbox"
        :checked="todo.completed"
        @change="emit('toggle', todo.id)"
      />
      <button
        class="priority-badge"
        :class="todo.priority ? `priority-${todo.priority}` : 'priority-none'"
        @click="cyclePriority"
        title="Click to change priority"
      >
        {{ priorityLabel(todo.priority) || '–' }}
      </button>
      <span class="todo-text" @dblclick="startEdit">{{ todo.text }}</span>
      <button class="btn-edit" @click="startEdit" title="Edit">&#9998;</button>
      <button class="btn-delete" @click="emit('remove', todo.id)" title="Delete">&times;</button>
    </template>
    <template v-else>
      <input
        ref="editInput"
        v-model="editText"
        type="text"
        class="edit-input"
        @keyup.enter="saveEdit"
        @keyup.escape="cancelEdit"
        @blur="saveEdit"
      />
    </template>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  border-radius: var(--radius);
  transition: opacity 0.2s;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.todo-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--color-accent);
  cursor: pointer;
  flex-shrink: 0;
}

.priority-badge {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
  border: 2px solid transparent;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
}

.priority-badge.priority-high {
  border-color: var(--color-priority-high);
  color: var(--color-priority-high);
}

.priority-badge.priority-medium {
  border-color: var(--color-priority-medium);
  color: var(--color-priority-medium);
}

.priority-badge.priority-low {
  border-color: var(--color-priority-low);
  color: var(--color-priority-low);
}

.priority-badge.priority-none {
  border-color: var(--color-border);
  color: var(--color-text-muted);
}

.todo-text {
  flex: 1;
  cursor: default;
  word-break: break-word;
}

.btn-edit,
.btn-delete {
  background: none;
  color: var(--color-text-muted);
  font-size: 1.1rem;
  padding: 0.25em 0.4em;
  line-height: 1;
}

.btn-edit:hover {
  color: var(--color-text);
}

.btn-delete:hover {
  color: var(--color-accent);
}

.edit-input {
  flex: 1;
}
</style>
