import { defineStore } from 'pinia'
import axios from 'axios'

export const useItemsStore = defineStore('items', {
  state: () => ({
    items: [],
    cart: []
  }),

  getters: {
    cartTotal: (state) => {
      return state.cart.reduce((total, item) => {
        const itemData = state.items.find(i => i.id === item.itemId)
        return total + (itemData?.price || 0) * item.amount
      }, 0)
    }
  },

  actions: {
    async fetchItems() {
      try {
        const response = await axios.get('/items')
        this.items = response.data.data
      } catch (error) {
        console.error('Failed to fetch items:', error)
        throw error
      }
    },

    addToCart(itemId, amount = 1) {
      const existingItem = this.cart.find(item => item.itemId === itemId)
      if (existingItem) {
        existingItem.amount += amount
      } else {
        this.cart.push({ itemId, amount })
      }
    },

    removeFromCart(itemId) {
      const index = this.cart.findIndex(item => item.itemId === itemId)
      if (index !== -1) {
        this.cart.splice(index, 1)
      }
    },

    updateCartItemAmount(itemId, amount) {
      const item = this.cart.find(item => item.itemId === itemId)
      if (item) {
        item.amount = amount
      }
    },

    clearCart() {
      this.cart = []
    }
  }
})
