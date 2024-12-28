<template>
  <div class="items-page">
    <LoadingSpinner v-if="loading" overlay />

    <ErrorMessage
      v-if="error"
      :message="error"
      :retry-action="loadItems"
    />

    <template v-else>
      <div class="items-list">
        <h2>Available Items</h2>
        <div class="items-grid">
          <div v-for="item in itemsStore.items" :key="item.id" class="item-card">
            <h3>{{ item.name }}</h3>
            <p class="price">${{ item.price.toFixed(2) }}</p>
            <div class="item-actions">
              <input
                type="number"
                v-model.number="itemAmounts[item.id]"
                min="1"
                :max="99"
              >
              <button @click="addToCart(item.id)">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>

      <div class="cart">
        <h2>Shopping Cart</h2>
        <div v-if="itemsStore.cart.length === 0" class="empty-cart">
          Your cart is empty
        </div>
        <div v-else>
          <div v-for="cartItem in itemsStore.cart" :key="cartItem.itemId" class="cart-item">
            <div class="cart-item-details">
              <span>{{ getItemName(cartItem.itemId) }}</span>
              <span>${{ getItemPrice(cartItem.itemId) }} x {{ cartItem.amount }}</span>
            </div>
            <div class="cart-item-actions">
              <button @click="itemsStore.removeFromCart(cartItem.itemId)">Remove</button>
            </div>
          </div>
          <div class="cart-total">
            <strong>Total: ${{ itemsStore.cartTotal.toFixed(2) }}</strong>
          </div>
          <button
            class="checkout-button"
            @click="checkout"
            :disabled="itemsStore.cart.length === 0"
          >
            Checkout
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useItemsStore } from '../stores/items'
import { useRouter } from 'vue-router'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

const router = useRouter()
const itemsStore = useItemsStore()
const itemAmounts = reactive({})
const loading = ref(false)
const error = ref(null)

const loadItems = async () => {
  loading.value = true
  error.value = null

  try {
    await itemsStore.fetchItems()
    itemsStore.items.forEach(item => {
      itemAmounts[item.id] = 1
    })
  } catch (err) {
    error.value = 'Failed to load items. Please try again.'
    console.error('Failed to load items:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadItems()
})

const addToCart = (itemId) => {
  const amount = itemAmounts[itemId] || 1
  itemsStore.addToCart(itemId, amount)
  itemAmounts[itemId] = 1 // Reset amount after adding to cart
}

const getItemName = (itemId) => {
  return itemsStore.items.find(item => item.id === itemId)?.name || 'Unknown Item'
}

const getItemPrice = (itemId) => {
  return itemsStore.items.find(item => item.id === itemId)?.price.toFixed(2) || '0.00'
}

const checkout = async () => {
  try {
    await axios.post('/orders', {
      items: itemsStore.cart
    })
    itemsStore.clearCart()
    router.push('/my-orders')
  } catch (error) {
    alert('Checkout failed: ' + error.response?.data?.message || error.message)
  }
}
</script>

<style scoped>
.items-page {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  padding: 2rem;
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

.price {
  color: #42b983;
  font-weight: bold;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.item-actions input {
  width: 60px;
}

.cart {
  border-left: 1px solid #ddd;
  padding-left: 2rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.cart-total {
  margin: 1rem 0;
}

.checkout-button {
  width: 100%;
  padding: 0.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.checkout-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #3aa876;
}
</style>
