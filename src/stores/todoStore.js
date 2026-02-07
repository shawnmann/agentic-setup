import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'vue-todo-app'
const CATEGORIES_KEY = 'vue-todo-app-categories'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

const CATEGORY_PALETTE = [
  '#a855f7', '#22c55e', '#f97316', '#06b6d4',
  '#ec4899', '#84cc16', '#8b5cf6', '#14b8a6',
  '#f43f5e', '#10b981', '#d946ef', '#0ea5e9'
]

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

function loadCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function saveCategories(categories) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}

function pickColor(existingCategories) {
  const usedColors = existingCategories.map(c => c.color)
  const available = CATEGORY_PALETTE.filter(c => !usedColors.includes(c))
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)]
  }
  return CATEGORY_PALETTE[Math.floor(Math.random() * CATEGORY_PALETTE.length)]
}

const todos = ref(loadTodos())
const categories = ref(loadCategories())
const filter = ref('all')
const priorityFilter = ref('all')
const categoryFilter = ref('all')

watch(todos, (value) => saveTodos(value), { deep: true })
watch(categories, (value) => saveCategories(value), { deep: true })

const filteredTodos = computed(() => {
  let result = todos.value

  if (filter.value === 'active') result = result.filter(t => !t.completed)
  else if (filter.value === 'completed') result = result.filter(t => t.completed)

  if (priorityFilter.value === 'none') result = result.filter(t => !t.priority)
  else if (priorityFilter.value !== 'all') result = result.filter(t => t.priority === priorityFilter.value)

  if (categoryFilter.value === 'uncategorized') result = result.filter(t => !t.categoryId)
  else if (categoryFilter.value !== 'all') result = result.filter(t => t.categoryId === categoryFilter.value)

  return [...result].sort((a, b) => {
    const pa = prioritySortValue(a.priority)
    const pb = prioritySortValue(b.priority)
    if (pa !== pb) return pa - pb
    return a.createdAt - b.createdAt
  })
})

const activeCount = computed(() => todos.value.filter(t => !t.completed).length)

const hasCompleted = computed(() => todos.value.some(t => t.completed))

function addTodo(text, priority = null, categoryId = null) {
  const trimmed = text.trim()
  if (!trimmed) return
  todos.value.push({
    id: crypto.randomUUID(),
    text: trimmed,
    completed: false,
    priority,
    categoryId,
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

function setTaskCategory(todoId, categoryId) {
  const todo = todos.value.find(t => t.id === todoId)
  if (todo) todo.categoryId = categoryId
}

function addCategory(name) {
  const trimmed = name.trim()
  if (!trimmed) return false
  const duplicate = categories.value.some(
    c => c.name.toLowerCase() === trimmed.toLowerCase()
  )
  if (duplicate) return false
  categories.value.push({
    id: crypto.randomUUID(),
    name: trimmed,
    color: pickColor(categories.value)
  })
  return true
}

function removeCategory(id) {
  const index = categories.value.findIndex(c => c.id === id)
  if (index === -1) return
  categories.value.splice(index, 1)
  todos.value.forEach(t => {
    if (t.categoryId === id) t.categoryId = null
  })
  if (categoryFilter.value === id) categoryFilter.value = 'all'
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

function setCategoryFilter(value) {
  categoryFilter.value = value
}

function _reset() {
  todos.value = []
  categories.value = []
  filter.value = 'all'
  priorityFilter.value = 'all'
  categoryFilter.value = 'all'
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(CATEGORIES_KEY)
}

export function useTodoStore() {
  return {
    todos,
    categories,
    filter,
    priorityFilter,
    categoryFilter,
    filteredTodos,
    activeCount,
    hasCompleted,
    addTodo,
    removeTodo,
    toggleTodo,
    editTodo,
    setPriority,
    setTaskCategory,
    addCategory,
    removeCategory,
    clearCompleted,
    setFilter,
    setPriorityFilter,
    setCategoryFilter,
    _reset
  }
}
