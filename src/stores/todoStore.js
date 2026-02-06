import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'vue-todo-app'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

function prioritySortValue(priority) {
  return priority in PRIORITY_ORDER ? PRIORITY_ORDER[priority] : 3
}

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
const priorityFilter = ref('all')

watch(todos, (value) => saveTodos(value), { deep: true })

const filteredTodos = computed(() => {
  let result = todos.value

  if (filter.value === 'active') result = result.filter(t => !t.completed)
  else if (filter.value === 'completed') result = result.filter(t => t.completed)

  if (priorityFilter.value === 'none') result = result.filter(t => !t.priority)
  else if (priorityFilter.value !== 'all') result = result.filter(t => t.priority === priorityFilter.value)

  return [...result].sort((a, b) => {
    const pa = prioritySortValue(a.priority)
    const pb = prioritySortValue(b.priority)
    if (pa !== pb) return pa - pb
    return a.createdAt - b.createdAt
  })
})

const activeCount = computed(() => todos.value.filter(t => !t.completed).length)

const hasCompleted = computed(() => todos.value.some(t => t.completed))

function addTodo(text, priority = null) {
  const trimmed = text.trim()
  if (!trimmed) return
  todos.value.push({
    id: crypto.randomUUID(),
    text: trimmed,
    completed: false,
    priority,
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

function setPriority(id, priority) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.priority = priority
}

function clearCompleted() {
  todos.value = todos.value.filter(t => !t.completed)
}

function setFilter(value) {
  filter.value = value
}

function setPriorityFilter(value) {
  priorityFilter.value = value
}

function _reset() {
  todos.value = []
  filter.value = 'all'
  priorityFilter.value = 'all'
  localStorage.removeItem(STORAGE_KEY)
}

export function useTodoStore() {
  return {
    todos,
    filter,
    priorityFilter,
    filteredTodos,
    activeCount,
    hasCompleted,
    addTodo,
    removeTodo,
    toggleTodo,
    editTodo,
    setPriority,
    clearCompleted,
    setFilter,
    setPriorityFilter,
    _reset
  }
}
