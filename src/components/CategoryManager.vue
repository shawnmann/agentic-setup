<script setup>
import { ref } from 'vue'
import { useTodoStore } from '../stores/todoStore'

const { categories, addCategory, removeCategory } = useTodoStore()

const newName = ref('')
const error = ref('')

function handleAdd() {
  error.value = ''
  const success = addCategory(newName.value)
  if (success) {
    newName.value = ''
  } else {
    const trimmed = newName.value.trim()
    error.value = !trimmed ? 'Name cannot be empty' : 'Category already exists'
  }
}
</script>

<template>
  <div class="category-manager">
    <h3 class="manager-title">Manage Categories</h3>
    <form class="add-category" @submit.prevent="handleAdd">
      <input
        v-model="newName"
        type="text"
        placeholder="New category name"
      />
      <button type="submit" class="btn-add-cat">Add</button>
    </form>
    <p v-if="error" class="error-msg">{{ error }}</p>
    <ul class="category-list" v-if="categories.length">
      <li v-for="cat in categories" :key="cat.id" class="category-item">
        <span class="cat-swatch" :style="{ background: cat.color }"></span>
        <span class="cat-name">{{ cat.name }}</span>
        <button class="btn-remove-cat" @click="removeCategory(cat.id)" title="Delete category">&times;</button>
      </li>
    </ul>
    <p v-else class="empty-cats">No categories yet.</p>
  </div>
</template>

<style scoped>
.category-manager {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.manager-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

.add-category {
  display: flex;
  gap: 0.5rem;
}

.add-category input {
  flex: 1;
  font-size: 0.875rem;
}

.btn-add-cat {
  background: var(--color-primary);
  color: var(--color-text);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.4em 1em;
  flex-shrink: 0;
}

.error-msg {
  color: var(--color-accent);
  font-size: 0.8rem;
}

.category-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0;
}

.cat-swatch {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.cat-name {
  flex: 1;
  font-size: 0.875rem;
}

.btn-remove-cat {
  background: none;
  color: var(--color-text-muted);
  font-size: 1rem;
  padding: 0.15em 0.4em;
  line-height: 1;
}

.btn-remove-cat:hover {
  color: var(--color-accent);
}

.empty-cats {
  color: var(--color-text-muted);
  font-size: 0.8rem;
}
</style>
