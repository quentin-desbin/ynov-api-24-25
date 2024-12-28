<template>
  <div class="admin-orders">
    <h2>Manage Orders</h2>
    
    <div class="filters">
      <select v-model="statusFilter">
        <option value="">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="PAID">Paid</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="DELIVERED">Delivered</option>
      </select>
    </div>

    <div class="orders-list">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-header">
          <h3>Order #{{ order.id }}</h3>
          <div class="status-control">
            <select 
              v-model="order.state"
              @change="updateOrderStatus(order.id, order.state)"
            >
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>
        </div>

        <div class="order-details">
          <p>
            <strong>Customer:</strong> 
            {{ order.user.firstName }} {{ order.user.lastName }} 
            ({{ order.user.username }})
          </p>
          <p><strong>Date:</strong> {{ new Date(order.createdAt).toLocaleString() }}</p>
          <p><strong>Total:</strong> ${{ order.amountPayed.toFixed(2) }}</p>
        </div>

        <div class="order-items">
          <h4>Items:</h4>
          <ul>
            <li v-for="orderItem in order.items" :key="orderItem.itemId">
              {{ orderItem.item.name }} x {{ orderItem.amount }}
              (${{ (orderItem.item.price * orderItem.amount).toFixed(2) }})
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from '../../stores/orders'

const ordersStore = useOrdersStore()
const statusFilter = ref('')

const filteredOrders = computed(() => {
  if (!statusFilter.value) return ordersStore.orders
  return ordersStore.orders.filter(order => order.state === statusFilter.value)
})

onMounted(async () => {
  try {
    await ordersStore.fetchAllOrders()
  } catch (error) {
    console.error('Failed to load orders:', error)
  }
})

const updateOrderStatus = async (orderId, newState) => {
  try {
    await ordersStore.updateOrderState(orderId, newState)
  } catch (error) {
    alert('Failed to update order status: ' + error.message)
  }
}
</script>

<style scoped>
.admin-orders {
  padding: 2rem;
}

.filters {
  margin-bottom: 2rem;
}

.filters select {
  padding: 0.5rem;
  min-width: 200px;
}

.orders-list {
  display: grid;
  gap: 1rem;
}

.order-card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-control select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.order-details {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
}

.order-items ul {
  list-style: none;
  padding: 0;
}

.order-items li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
}

select[value="PENDING"] {
  color: #ffd700;
}

select[value="PAID"] {
  color: #90ee90;
}

select[value="CANCELLED"] {
  color: #ff6b6b;
}

select[value="DELIVERED"] {
  color: #42b983;
}
</style> 