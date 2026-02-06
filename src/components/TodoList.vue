<script setup>
import { useTodoStore } from '../stores/todoStore'
import TodoItem from './TodoItem.vue'

const { filteredTodos, toggleTodo, removeTodo, editTodo } = useTodoStore()
</script>

<template>
  <ul class="todo-list" v-if="filteredTodos.length">
    <TodoItem
      v-for="todo in filteredTodos"
      :key="todo.id"
      :todo="todo"
      @toggle="toggleTodo"
      @remove="removeTodo"
      @edit="editTodo"
    />
  </ul>
  <p class="empty-state" v-else>No tasks to show.</p>
</template>

<style scoped>
.todo-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  color: var(--color-text-muted);
  padding: 2rem 0;
}
</style>
