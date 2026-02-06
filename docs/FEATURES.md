# Feature Specifications

## F1: Add a Task
- Text input field with placeholder "What needs to be done?"
- Submit on Enter key or click an Add button
- Empty/whitespace-only input is ignored (no empty tasks)
- Input is cleared after successful add
- New tasks are added to the end of the list with `completed: false`

## F2: Display Task List
- Render all tasks matching the current filter
- Each task shows: checkbox, task text, edit button, delete button
- Tasks are displayed in creation order (oldest first)
- When no tasks match the filter, show a simple empty state message

## F3: Toggle Task Completion
- Clicking the checkbox toggles `completed` between true/false
- Completed tasks display with strikethrough text and muted styling

## F4: Edit a Task
- Clicking the edit button (or double-clicking the task text) enters edit mode
- Edit mode replaces the label with a text input pre-filled with the current text
- Pressing Enter or blurring the input saves the change
- Pressing Escape cancels the edit
- Saving empty text deletes the task

## F5: Delete a Task
- Clicking the delete button removes the task immediately
- No confirmation dialog (keep it simple)

## F6: Filter Tasks
- Three filter buttons: All, Active, Completed
- Active filter is visually highlighted
- "All" shows every task
- "Active" shows only tasks where `completed === false`
- "Completed" shows only tasks where `completed === true`
- Default filter on page load is "All"

## F7: Clear Completed
- Button labeled "Clear completed"
- Removes all tasks where `completed === true`
- Only visible when there is at least one completed task

## F8: Task Count
- Display "{n} items left" showing the count of active (incomplete) tasks
- Updates reactively as tasks are added, completed, or deleted

## F9: Persistence
- All tasks are saved to localStorage on every change
- On page load, tasks are restored from localStorage
- App works correctly even if localStorage is empty (first visit)

## F10: Responsive Layout
- Centered single-column layout with max-width
- Comfortable padding and spacing on mobile and desktop
- No horizontal scrolling on any screen size

## F11: Unit Tests (Vitest)

### Setup
- Use Vitest as the test runner
- Test file location: `src/stores/__tests__/todoStore.test.js`
- Add `npm test` script to `package.json`
- Mock `localStorage` in the test environment (jsdom)

### Store Action Tests
- **addTodo:** adds a task with correct shape (id, text, completed: false, createdAt)
- **addTodo:** ignores empty string and whitespace-only input
- **removeTodo:** removes a task by id
- **removeTodo:** does nothing if id doesn't exist
- **toggleTodo:** flips completed from false to true and back
- **editTodo:** updates the text of an existing task
- **editTodo:** trims whitespace from the new text
- **editTodo:** deletes the task if new text is empty
- **clearCompleted:** removes all completed tasks, keeps active ones

### Computed Property Tests
- **filteredTodos:** returns all tasks when filter is 'all'
- **filteredTodos:** returns only incomplete tasks when filter is 'active'
- **filteredTodos:** returns only completed tasks when filter is 'completed'
- **activeCount:** returns the number of incomplete tasks
- **hasCompleted:** returns true when at least one task is completed, false otherwise

### Filter Action Test
- **setFilter:** changes the filter value between 'all', 'active', 'completed'
