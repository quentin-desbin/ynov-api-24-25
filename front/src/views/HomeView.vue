<template>
  <div class="home">
    <h1>Dashboard</h1>
    
    <div class="loading-error" v-if="error">
      <p class="error">{{ error }}</p>
      <button @click="loadData">Retry</button>
    </div>

    <div v-else>
      <div class="stats-grid">
        <div class="stat-card" v-if="isAdmin">
          <h3>Total Users</h3>
          <div class="stat-value" v-if="loading.users">Loading...</div>
          <div class="stat-value" v-else>{{ stats.totalUsers }}</div>
        </div>

        <div class="stat-card">
          <h3>My Orders</h3>
          <div class="stat-value" v-if="loading.orders">Loading...</div>
          <div class="stat-value" v-else>{{ stats.myOrders }}</div>
        </div>

        <div class="stat-card">
          <h3>Available Items</h3>
          <div class="stat-value" v-if="loading.items">Loading...</div>
          <div class="stat-value" v-else>{{ stats.totalItems }}</div>
        </div>

        <div class="stat-card" v-if="isAdmin">
          <h3>Pending Orders</h3>
          <div class="stat-value" v-if="loading.orders">Loading...</div>
          <div class="stat-value" v-else>{{ stats.pendingOrders }}</div>
        </div>
      </div>

      <div class="recent-section" v-if="!loading.orders">
        <h2>Recent Orders</h2>
        <div class="recent-orders">
          <div v-for="order in recentOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <h3>Order #{{ order.id }}</h3>
              <span class="order-status" :class="order.state.toLowerCase()">
                {{ order.state }}
              </span>
            </div>
            <p>Date: {{ new Date(order.createdAt).toLocaleDateString() }}</p>
            <p>Total: ${{ order.amountPayed.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'
import { useItemsStore } from '../stores/items'
import { useUsersStore } from '../stores/users'

const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const itemsStore = useItemsStore()
const usersStore = useUsersStore()

const isAdmin = computed(() => authStore.isAdmin)
const error = ref(null)
const loading = reactive({
  users: false,
  orders: false,
  items: false
})

const stats = reactive({
  totalUsers: 0,
  myOrders: 0,
  totalItems: 0,
  pendingOrders: 0
})

const recentOrders = computed(() => {
  return isAdmin.value 
    ? ordersStore.orders.slice(0, 5)
    : ordersStore.myOrders.slice(0, 5)
})

const loadData = async () => {
  error.value = null
  
  try {
    // Load items
    loading.items = true
    await itemsStore.fetchItems()
    stats.totalItems = itemsStore.items.length
    loading.items = false

    // Load orders
    loading.orders = true
    if (isAdmin.value) {
      await ordersStore.fetchAllOrders()
      stats.pendingOrders = ordersStore.orders.filter(o => o.state === 'PENDING').length
    } else {
      await ordersStore.fetchMyOrders()
    }
    stats.myOrders = ordersStore.myOrders.length
    loading.orders = false

    // Load users if admin
    if (isAdmin.value) {
      loading.users = true
      await usersStore.fetchUsers()
      stats.totalUsers = usersStore.users.length
      loading.users = false
    }
  } catch (err) {
    error.value = 'Failed to load dashboard data. Please try again.'
    console.error('Dashboard loading error:', err)
  } finally {
    loading.items = false
    loading.orders = false
    loading.users = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.home {
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 0.5rem;
}

.recent-section {
  margin-top: 2rem;
}

.recent-orders {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.order-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.order-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8em;
}

.order-status.pending {
  background: #ffd700;
}

.order-status.paid {
  background: #90ee90;
}

.order-status.cancelled {
  background: #ff6b6b;
  color: white;
}

.order-status.delivered {
  background: #42b983;
  color: white;
}

.loading-error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #ff6b6b;
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}
</style> 