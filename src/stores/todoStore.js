import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'vue-todo-app'

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

const todos = ref(loadTodos())
const filter = ref('all')

watch(todos, (value) => saveTodos(value), { deep: true })

const filteredTodos = computed(() => {
  if (filter.value === 'active') return todos.value.filter(t => !t.completed)
  if (filter.value === 'completed') return todos.value.filter(t => t.completed)
  return todos.value
})

const activeCount = computed(() => todos.value.filter(t => !t.completed).length)

const hasCompleted = computed(() => todos.value.some(t => t.completed))

function addTodo(text) {
  const trimmed = text.trim()
  if (!trimmed) return
  todos.value.push({
    id: crypto.randomUUID(),
    text: trimmed,
    completed: false,
    createdAt: Date.now()
  })
}

function removeTodo(id) {
  const index = todos.value.findIndex(t => t.id === id)
  if (index !== -1) todos.value.splice(index, 1)
}

function toggleTodo(id) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.completed = !todo.completed
}

function editTodo(id, newText) {
  const trimmed = newText.trim()
  if (!trimmed) {
    removeTodo(id)
    return
  }
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.text = trimmed
}

function clearCompleted() {
  todos.value = todos.value.filter(t => !t.completed)
}

function setFilter(value) {
  filter.value = value
}

export function useTodoStore() {
  return {
    todos,
    filter,
    filteredTodos,
    activeCount,
    hasCompleted,
    addTodo,
    removeTodo,
    toggleTodo,
    editTodo,
    clearCompleted,
    setFilter
  }
}
