<script setup>
import { ref, computed, nextTick } from 'vue'

const PRIORITY_CYCLE = [null, 'high', 'medium', 'low']

const props = defineProps({
  todo: { type: Object, required: true },
  categories: { type: Array, default: () => [] }
})

const emit = defineEmits(['toggle', 'remove', 'edit', 'set-priority', 'set-category'])

const editing = ref(false)
const editText = ref('')
const editInput = ref(null)
const showCatDropdown = ref(false)

const category = computed(() =>
  props.categories.find(c => c.id === props.todo.categoryId)
)

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

function selectCategory(categoryId) {
  emit('set-category', props.todo.id, categoryId)
  showCatDropdown.value = false
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
      <div class="category-wrapper" v-if="categories.length">
        <button
          class="category-label"
          @click="showCatDropdown = !showCatDropdown"
          title="Click to change category"
        >
          <span
            class="cat-dot"
            :style="{ background: category ? category.color : 'transparent', border: category ? 'none' : '1px dashed var(--color-border)' }"
          ></span>
          <span class="cat-text">{{ category ? category.name : '—' }}</span>
        </button>
        <div v-if="showCatDropdown" class="cat-dropdown">
          <button class="cat-option" @click="selectCategory(null)">
            None
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="cat-option"
            @click="selectCategory(cat.id)"
          >
            <span class="cat-dot" :style="{ background: cat.color }"></span>
            {{ cat.name }}
          </button>
        </div>
      </div>
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

.category-wrapper {
  position: relative;
  flex-shrink: 0;
}

.category-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: none;
  color: var(--color-text-muted);
  font-size: 0.7rem;
  padding: 0.15em 0.4em;
  border: 1px solid var(--color-border);
  cursor: pointer;
}

.category-label:hover {
  border-color: var(--color-text-muted);
}

.cat-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
}

.cat-text {
  max-width: 5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cat-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.25rem 0;
  min-width: 8rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.cat-option {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  background: none;
  color: var(--color-text);
  font-size: 0.8rem;
  padding: 0.4em 0.75em;
  border-radius: 0;
  text-align: left;
}

.cat-option:hover {
  background: var(--color-surface);
  opacity: 1;
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
