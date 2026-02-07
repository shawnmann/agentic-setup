<script setup>
import { ref } from 'vue'
import AddTodo from './components/AddTodo.vue'
import TodoList from './components/TodoList.vue'
import FilterBar from './components/FilterBar.vue'
import CategoryManager from './components/CategoryManager.vue'

const showCategories = ref(false)
</script>

<template>
  <div class="app">
    <div class="app-header">
      <h1 class="app-title">Todo App</h1>
      <button
        class="btn-manage-cats"
        @click="showCategories = !showCategories"
      >
        {{ showCategories ? 'Hide' : 'Categories' }}
      </button>
    </div>
    <CategoryManager v-if="showCategories" />
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

.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.app-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: var(--color-accent);
}

.btn-manage-cats {
  background: var(--color-primary);
  color: var(--color-text);
  font-size: 0.8rem;
  padding: 0.4em 0.8em;
}
</style>
