<template>
  <div class="admin-items">
    <h2>Manage Items</h2>

    <!-- Add New Item Form -->
    <div class="add-item-form">
      <h3>Add New Item</h3>
      <form @submit.prevent="handleAddItem">
        <div class="form-group">
          <label>Name:</label>
          <input type="text" v-model="newItem.name" required>
        </div>
        <div class="form-group">
          <label>Price:</label>
          <input type="number" v-model.number="newItem.price" step="0.01" min="0" required>
        </div>
        <button type="submit">Add Item</button>
      </form>
    </div>

    <!-- Items List -->
    <div class="items-list">
      <h3>Current Items</h3>
      <div class="items-grid">
        <div v-for="item in itemsStore.items" :key="item.id" class="item-card">
          <div v-if="editingItem?.id === item.id">
            <form @submit.prevent="handleUpdateItem(item.id)">
              <input type="text" v-model="editingItem.name" required>
              <input type="number" v-model.number="editingItem.price" step="0.01" min="0" required>
              <div class="edit-actions">
                <button type="submit">Save</button>
                <button type="button" @click="cancelEdit">Cancel</button>
              </div>
            </form>
          </div>
          <div v-else>
            <h3>{{ item.name }}</h3>
            <p class="price">${{ item.price.toFixed(2) }}</p>
            <div class="item-actions">
              <button @click="startEdit(item)">Edit</button>
              <button @click="deleteItem(item.id)" class="delete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useItemsStore } from '../../stores/items'
import axios from 'axios'

const itemsStore = useItemsStore()
const editingItem = ref(null)

const newItem = reactive({
  name: '',
  price: 0
})

onMounted(async () => {
  try {
    await itemsStore.fetchItems()
  } catch (error) {
    console.error('Failed to load items:', error)
  }
})

const handleAddItem = async () => {
  try {
    await axios.post('/items', newItem)
    await itemsStore.fetchItems()
    newItem.name = ''
    newItem.price = 0
  } catch (error) {
    alert('Failed to add item: ' + error.response?.data?.message || error.message)
  }
}

const startEdit = (item) => {
  editingItem.value = { ...item }
}

const cancelEdit = () => {
  editingItem.value = null
}

const handleUpdateItem = async (id) => {
  try {
    await axios.patch(`/items/${id}`, {
      name: editingItem.value.name,
      price: editingItem.value.price
    })
    await itemsStore.fetchItems()
    editingItem.value = null
  } catch (error) {
    alert('Failed to update item: ' + error.response?.data?.message || error.message)
  }
}

const deleteItem = async (id) => {
  if (!confirm('Are you sure you want to delete this item?')) return

  try {
    await axios.delete(`/items/${id}`)
    await itemsStore.fetchItems()
  } catch (error) {
    alert('Failed to delete item: ' + error.response?.data?.message || error.message)
  }
}
</script>

<style scoped>
.admin-items {
  padding: 2rem;
}

.add-item-form {
  max-width: 400px;
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.item-card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #42b983;
  color: white;
}

button.delete {
  background: #ff6b6b;
}

button:hover {
  opacity: 0.9;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
