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
    expect(todo.id).toBeDefined()
    expect(todo.createdAt).toBeDefined()
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
