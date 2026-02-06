<script setup>
import { ref } from 'vue'
import { useTodoStore } from '../stores/todoStore'

const { addTodo } = useTodoStore()
const newText = ref('')

function handleSubmit() {
  addTodo(newText.value)
  newText.value = ''
}
</script>

<template>
  <form class="add-todo" @submit.prevent="handleSubmit">
    <input
      v-model="newText"
      type="text"
      placeholder="What needs to be done?"
      autofocus
    />
    <button type="submit" class="btn-add">Add</button>
  </form>
</template>

<style scoped>
.add-todo {
  display: flex;
  gap: 0.5rem;
}

.add-todo input {
  flex: 1;
}

.btn-add {
  background: var(--color-accent);
  color: #fff;
  font-weight: 600;
  padding: 0.6em 1.4em;
  flex-shrink: 0;
}
</style>
