<template>
  <div class="admin-users">
    <h2>Manage Users</h2>

    <div class="users-list">
      <div v-for="user in usersStore.users" :key="user.id" class="user-card">
        <div v-if="editingUser?.id === user.id">
          <form @submit.prevent="handleUpdateUser(user.id)">
            <div class="form-group">
              <label>Username:</label>
              <input type="text" v-model="editingUser.username" required>
            </div>
            <div class="form-group">
              <label>First Name:</label>
              <input type="text" v-model="editingUser.firstName">
            </div>
            <div class="form-group">
              <label>Last Name:</label>
              <input type="text" v-model="editingUser.lastName">
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" v-model="editingUser.isAdmin">
                Admin User
              </label>
            </div>
            <div class="edit-actions">
              <button type="submit">Save</button>
              <button type="button" @click="cancelEdit">Cancel</button>
            </div>
          </form>
        </div>
        <div v-else>
          <div class="user-header">
            <h3>{{ user.username }}</h3>
            <span v-if="user.isAdmin" class="admin-badge">Admin</span>
          </div>
          <div class="user-details">
            <p>{{ user.firstName }} {{ user.lastName }}</p>
            <div class="user-actions">
              <button @click="startEdit(user)">Edit</button>
              <button 
                @click="deleteUser(user.id)" 
                class="delete"
                :disabled="user.id === currentUser?.id"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '../../stores/users'
import { useAuthStore } from '../../stores/auth'

const usersStore = useUsersStore()
const authStore = useAuthStore()
const editingUser = ref(null)

const currentUser = authStore.user

onMounted(async () => {
  try {
    await usersStore.fetchUsers()
  } catch (error) {
    console.error('Failed to load users:', error)
  }
})

const startEdit = (user) => {
  editingUser.value = { ...user }
}

const cancelEdit = () => {
  editingUser.value = null
}

const handleUpdateUser = async (id) => {
  try {
    await usersStore.updateUser(id, editingUser.value)
    editingUser.value = null
  } catch (error) {
    alert('Failed to update user: ' + error.response?.data?.message || error.message)
  }
}

const deleteUser = async (id) => {
  if (id === currentUser?.id) {
    alert('You cannot delete your own account')
    return
  }
  
  if (!confirm('Are you sure you want to delete this user?')) return
  
  try {
    await usersStore.deleteUser(id)
  } catch (error) {
    alert('Failed to delete user: ' + error.response?.data?.message || error.message)
  }
}
</script>

<style scoped>
.admin-users {
  padding: 2rem;
}

.users-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.user-card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.admin-badge {
  background: #42b983;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8em;
}

.user-details {
  margin-top: 1rem;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 0.5rem;
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

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  opacity: 0.9;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style> 