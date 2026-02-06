<script setup>
import AddTodo from './components/AddTodo.vue'
import TodoList from './components/TodoList.vue'
import FilterBar from './components/FilterBar.vue'
</script>

<template>
  <div class="app">
    <h1 class="app-title">Todo App</h1>
    <AddTodo />
    <FilterBar />
    <TodoList />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}
</style>
