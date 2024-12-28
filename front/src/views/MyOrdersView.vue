<template>
  <div class="my-orders">
    <h2>My Orders</h2>
    <div v-if="ordersStore.myOrders.length === 0" class="no-orders">
      You haven't placed any orders yet.
    </div>
    <div v-else class="orders-list">
      <div v-for="order in ordersStore.myOrders" :key="order.id" class="order-card">
        <div class="order-header">
          <h3>Order #{{ order.id }}</h3>
          <span class="order-status" :class="order.state.toLowerCase()">
            {{ order.state }}
          </span>
        </div>
        <div class="order-details">
          <p>Date: {{ new Date(order.createdAt).toLocaleDateString() }}</p>
          <p>Total: ${{ order.amountPayed.toFixed(2) }}</p>
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
import { onMounted } from 'vue'
import { useOrdersStore } from '../stores/orders'

const ordersStore = useOrdersStore()

onMounted(async () => {
  try {
    await ordersStore.fetchMyOrders()
  } catch (error) {
    console.error('Failed to load orders:', error)
  }
})
</script>

<style scoped>
.my-orders {
  padding: 2rem;
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

.order-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9em;
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

.order-items ul {
  list-style: none;
  padding: 0;
}

.order-items li {
  padding: 0.25rem 0;
  border-bottom: 1px solid #eee;
}
</style> 