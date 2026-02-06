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

## F12: Task Priority

### Priority Values
- `null` — Unprioritized (default for new tasks)
- `'high'` — High priority
- `'medium'` — Medium priority
- `'low'` — Low priority

### Data Model Change
- Add `priority` field to todo items: `priority: null | 'high' | 'medium' | 'low'`
- Existing todos without a `priority` field are treated as unprioritized (`null`)

### Adding a Task with Priority
- The AddTodo form includes an optional priority selector (dropdown or button group)
- Default selection is "None" (unprioritized)
- User can pick High, Medium, or Low before adding
- Priority resets to "None" after each task is added

### Displaying Priority
- Each TodoItem shows a colored priority badge/indicator next to the task text
- High = red, Medium = yellow, Low = blue, Unprioritized = no badge
- Priority badge is compact and does not dominate the task row

### Editing Priority
- Clicking the priority badge on a TodoItem cycles through: None → High → Medium → Low → None
- Priority changes persist immediately (same as other mutations)

### Filtering by Priority
- Add a second row of filter buttons: All, High, Medium, Low, None
- This filter works independently of the status filter (All/Active/Completed)
- Both filters apply simultaneously (e.g., "Active" + "High" shows only incomplete high-priority tasks)
- Default priority filter on page load is "All"

### Sorting
- Within the current filter view, tasks are ordered by priority first (High → Medium → Low → None), then by creation date
- This is a display-time sort — it does not change the stored order

### Store Changes
- Add `priorityFilter` state: `'all' | 'high' | 'medium' | 'low' | 'none'`
- Add `setPriorityFilter(value)` action
- Add `setPriority(id, priority)` action
- Update `filteredTodos` computed to apply both status and priority filters, then sort

### Unit Tests (add to existing test file)
- **addTodo:** new tasks have `priority: null` by default
- **setPriority:** changes priority on an existing task
- **setPriority:** setting to `null` makes task unprioritized
- **filteredTodos:** priority filter returns only matching tasks
- **filteredTodos:** status and priority filters combine correctly
- **setPriorityFilter:** changes the priority filter value

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
