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

## F13: Task Categories

### Category Data Model
- Categories are stored as a separate array in the store and localStorage
- Each category has: `{ id, name, color }`
- `color` is a random hex color assigned automatically when the category is created
- Categories are persisted under a separate localStorage key: `vue-todo-app-categories`

### Task Data Model Change
- Add `categoryId` field to todo items: `categoryId: null | string`
- `null` means the task is uncategorized
- A task belongs to at most one category

### Category Management UI
- New component: `CategoryManager.vue`, accessible via a "Manage Categories" button in the app
- Displays a list of all categories with their color swatch and name
- **Create:** text input + "Add" button to create a new category (auto-assigned random color)
- **Delete:** delete button on each category; deleting a category sets `categoryId: null` on all tasks that used it
- Empty/whitespace-only names are ignored
- Duplicate category names are not allowed

### Assigning a Category to a Task
- Each TodoItem shows a small colored dot/label for its category (or nothing if uncategorized)
- Clicking the category label opens a dropdown with all available categories + "None"
- Selecting a category updates the task immediately
- The AddTodo form includes an optional category dropdown (default: "None")
- Category selection resets to "None" after each task is added

### Color Assignment
- When a category is created, assign a random color from a curated palette of distinguishable colors
- Colors should be visually distinct from the priority colors (red, yellow, blue)
- The color is fixed once assigned (no manual color picking)

### Filtering by Category
- Add a third filter row in FilterBar: shows "All", "Uncategorized", plus a button for each category
- Category filter works independently of status and priority filters
- All three filters apply simultaneously (e.g., "Active" + "High" + "Work")
- Default category filter on page load is "All"
- Category filter buttons show the category color as a dot or border accent

### Store Changes
- Add `categories` ref: `Array<{ id, name, color }>`
- Add `categoryFilter` state: `'all' | 'uncategorized' | <categoryId>`
- Add `addCategory(name)` action — generates id + random color, rejects empty/duplicate names
- Add `removeCategory(id)` action — removes category and unsets it from all tasks
- Add `setTaskCategory(todoId, categoryId)` action
- Add `setCategoryFilter(value)` action
- Update `filteredTodos` computed to apply category filter alongside status and priority filters
- Persist categories to localStorage under `vue-todo-app-categories`

### Unit Tests (add to existing test file)
- **addCategory:** creates a category with id, name, and color
- **addCategory:** rejects empty names
- **addCategory:** rejects duplicate names
- **removeCategory:** removes a category and unsets it from tasks that used it
- **setTaskCategory:** assigns a category to a task
- **setTaskCategory:** setting to null makes task uncategorized
- **filteredTodos:** category filter returns only matching tasks
- **filteredTodos:** "uncategorized" filter returns only tasks with no category
- **filteredTodos:** all three filters (status, priority, category) combine correctly
- **setCategoryFilter:** changes the category filter value

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
