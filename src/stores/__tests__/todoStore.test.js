import { describe, it, expect, beforeEach } from 'vitest'
import { useTodoStore } from '../todoStore'

const store = useTodoStore()

beforeEach(() => {
  store._reset()
})

describe('addTodo', () => {
  it('adds a task with correct shape', () => {
    store.addTodo('Buy groceries')
    expect(store.todos.value).toHaveLength(1)

    const todo = store.todos.value[0]
    expect(todo.text).toBe('Buy groceries')
    expect(todo.completed).toBe(false)
    expect(todo.priority).toBe(null)
    expect(todo.categoryId).toBe(null)
    expect(todo.id).toBeDefined()
    expect(todo.createdAt).toBeDefined()
  })

  it('adds a task with priority when provided', () => {
    store.addTodo('Urgent task', 'high')
    expect(store.todos.value[0].priority).toBe('high')
  })

  it('adds a task with category when provided', () => {
    store.addCategory('Work')
    const catId = store.categories.value[0].id
    store.addTodo('Work task', null, catId)
    expect(store.todos.value[0].categoryId).toBe(catId)
  })

  it('ignores empty string input', () => {
    store.addTodo('')
    expect(store.todos.value).toHaveLength(0)
  })

  it('ignores whitespace-only input', () => {
    store.addTodo('   ')
    expect(store.todos.value).toHaveLength(0)
  })
})

describe('removeTodo', () => {
  it('removes a task by id', () => {
    store.addTodo('Task to remove')
    const id = store.todos.value[0].id
    store.removeTodo(id)
    expect(store.todos.value).toHaveLength(0)
  })

  it('does nothing if id does not exist', () => {
    store.addTodo('Keep this')
    store.removeTodo('nonexistent-id')
    expect(store.todos.value).toHaveLength(1)
  })
})

describe('toggleTodo', () => {
  it('flips completed from false to true', () => {
    store.addTodo('Toggle me')
    const id = store.todos.value[0].id
    store.toggleTodo(id)
    expect(store.todos.value[0].completed).toBe(true)
  })

  it('flips completed back to false', () => {
    store.addTodo('Toggle me twice')
    const id = store.todos.value[0].id
    store.toggleTodo(id)
    store.toggleTodo(id)
    expect(store.todos.value[0].completed).toBe(false)
  })
})

describe('editTodo', () => {
  it('updates the text of an existing task', () => {
    store.addTodo('Old text')
    const id = store.todos.value[0].id
    store.editTodo(id, 'New text')
    expect(store.todos.value[0].text).toBe('New text')
  })

  it('trims whitespace from the new text', () => {
    store.addTodo('Original')
    const id = store.todos.value[0].id
    store.editTodo(id, '  Trimmed  ')
    expect(store.todos.value[0].text).toBe('Trimmed')
  })

  it('deletes the task if new text is empty', () => {
    store.addTodo('Will be deleted')
    const id = store.todos.value[0].id
    store.editTodo(id, '')
    expect(store.todos.value).toHaveLength(0)
  })
})

describe('clearCompleted', () => {
  it('removes all completed tasks and keeps active ones', () => {
    store.addTodo('Active task')
    store.addTodo('Done task')
    store.toggleTodo(store.todos.value[1].id)

    store.clearCompleted()
    expect(store.todos.value).toHaveLength(1)
    expect(store.todos.value[0].text).toBe('Active task')
  })
})

describe('filteredTodos', () => {
  beforeEach(() => {
    store.addTodo('Active one')
    store.addTodo('Completed one')
    store.toggleTodo(store.todos.value[1].id)
  })

  it('returns all tasks when filter is "all"', () => {
    store.setFilter('all')
    expect(store.filteredTodos.value).toHaveLength(2)
  })

  it('returns only incomplete tasks when filter is "active"', () => {
    store.setFilter('active')
    expect(store.filteredTodos.value).toHaveLength(1)
    expect(store.filteredTodos.value[0].text).toBe('Active one')
  })

  it('returns only completed tasks when filter is "completed"', () => {
    store.setFilter('completed')
    expect(store.filteredTodos.value).toHaveLength(1)
    expect(store.filteredTodos.value[0].text).toBe('Completed one')
  })
})

describe('activeCount', () => {
  it('returns the number of incomplete tasks', () => {
    store.addTodo('One')
    store.addTodo('Two')
    store.addTodo('Three')
    store.toggleTodo(store.todos.value[0].id)

    expect(store.activeCount.value).toBe(2)
  })
})

describe('hasCompleted', () => {
  it('returns false when no tasks are completed', () => {
    store.addTodo('Not done')
    expect(store.hasCompleted.value).toBe(false)
  })

  it('returns true when at least one task is completed', () => {
    store.addTodo('Done')
    store.toggleTodo(store.todos.value[0].id)
    expect(store.hasCompleted.value).toBe(true)
  })
})

describe('setFilter', () => {
  it('changes the filter value', () => {
    store.setFilter('active')
    expect(store.filter.value).toBe('active')

    store.setFilter('completed')
    expect(store.filter.value).toBe('completed')

    store.setFilter('all')
    expect(store.filter.value).toBe('all')
  })
})

describe('setPriority', () => {
  it('changes priority on an existing task', () => {
    store.addTodo('Task')
    const id = store.todos.value[0].id
    store.setPriority(id, 'high')
    expect(store.todos.value[0].priority).toBe('high')
  })

  it('setting to null makes task unprioritized', () => {
    store.addTodo('Task', 'medium')
    const id = store.todos.value[0].id
    store.setPriority(id, null)
    expect(store.todos.value[0].priority).toBe(null)
  })
})

describe('setPriorityFilter', () => {
  it('changes the priority filter value', () => {
    store.setPriorityFilter('high')
    expect(store.priorityFilter.value).toBe('high')

    store.setPriorityFilter('none')
    expect(store.priorityFilter.value).toBe('none')

    store.setPriorityFilter('all')
    expect(store.priorityFilter.value).toBe('all')
  })
})

describe('filteredTodos with priority', () => {
  beforeEach(() => {
    store.addTodo('High task', 'high')
    store.addTodo('Medium task', 'medium')
    store.addTodo('Low task', 'low')
    store.addTodo('No priority task')
  })

  it('filters by high priority', () => {
    store.setPriorityFilter('high')
    expect(store.filteredTodos.value).toHaveLength(1)
    expect(store.filteredTodos.value[0].text).toBe('High task')
  })

  it('filters by none (unprioritized)', () => {
    store.setPriorityFilter('none')
    expect(store.filteredTodos.value).toHaveLength(1)
    expect(store.filteredTodos.value[0].text).toBe('No priority task')
  })

  it('combines status and priority filters', () => {
    store.toggleTodo(store.todos.value[0].id)
    store.setFilter('active')
    store.setPriorityFilter('medium')
    expect(store.filteredTodos.value).toHaveLength(1)
    expect(store.filteredTodos.value[0].text).toBe('Medium task')
  })

  it('sorts by priority then creation date', () => {
    store.setPriorityFilter('all')
    const texts = store.filteredTodos.value.map(t => t.text)
    expect(texts).toEqual(['High task', 'Medium task', 'Low task', 'No priority task'])
  })
})

describe('addCategory', () => {
  it('creates a category with id, name, and color', () => {
    store.addCategory('Work')
    expect(store.categories.value).toHaveLength(1)

    const cat = store.categories.value[0]
    expect(cat.name).toBe('Work')
    expect(cat.id).toBeDefined()
    expect(cat.color).toBeDefined()
  })

  it('rejects empty names', () => {
    const result = store.addCategory('   ')
    expect(result).toBe(false)
    expect(store.categories.value).toHaveLength(0)
  })

  it('rejects duplicate names (case-insensitive)', () => {
    store.addCategory('Work')
    const result = store.addCategory('work')
    expect(result).toBe(false)
    expect(store.categories.value).toHaveLength(1)
  })
})

describe('removeCategory', () => {
  it('removes a category and unsets it from tasks', () => {
    store.addCategory('Work')
    const catId = store.categories.value[0].id
    store.addTodo('Task', null, catId)

    store.removeCategory(catId)
    expect(store.categories.value).toHaveLength(0)
    expect(store.todos.value[0].categoryId).toBe(null)
  })
})

describe('setTaskCategory', () => {
  it('assigns a category to a task', () => {
    store.addCategory('Personal')
    const catId = store.categories.value[0].id
    store.addTodo('Task')
    const todoId = store.todos.value[0].id

    store.setTaskCategory(todoId, catId)
    expect(store.todos.value[0].categoryId).toBe(catId)
  })

  it('setting to null makes task uncategorized', () => {
    store.addCategory('Work')
    const catId = store.categories.value[0].id
    store.addTodo('Task', null, catId)
    const todoId = store.todos.value[0].id

    store.setTaskCategory(todoId, null)
    expect(store.todos.value[0].categoryId).toBe(null)
  })
})

describe('setCategoryFilter', () => {
  it('changes the category filter value', () => {
    store.setCategoryFilter('uncategorized')
    expect(store.categoryFilter.value).toBe('uncategorized')

    store.setCategoryFilter('all')
    expect(store.categoryFilter.value).toBe('all')
  })
})

describe('filteredTodos with categories', () => {
  let workId

  beforeEach(() => {
    store.addCategory('Work')
    store.addCategory('Personal')
    workId = store.categories.value[0].id
    const personalId = store.categories.value[1].id

    store.addTodo('Work task', null, workId)
    store.addTodo('Personal task', null, personalId)
    store.addTodo('No category task')
  })

  it('filters by a specific category', () => {
    store.setCategoryFilter(workId)
    expect(store.filteredTodos.value).toHaveLength(1)
    expect(store.filteredTodos.value[0].text).toBe('Work task')
  })

  it('filters by uncategorized', () => {
    store.setCategoryFilter('uncategorized')
    expect(store.filteredTodos.value).toHaveLength(1)
    expect(store.filteredTodos.value[0].text).toBe('No category task')
  })

  it('combines status, priority, and category filters', () => {
    store.addTodo('High work task', 'high', workId)
    store.toggleTodo(store.todos.value[0].id)

    store.setFilter('active')
    store.setPriorityFilter('high')
    store.setCategoryFilter(workId)

    expect(store.filteredTodos.value).toHaveLength(1)
    expect(store.filteredTodos.value[0].text).toBe('High work task')
  })
})
