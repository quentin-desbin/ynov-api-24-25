import { defineStore } from 'pinia'
import axios from 'axios'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    myOrders: []
  }),

  actions: {
    async fetchMyOrders() {
      try {
        const response = await axios.get('/orders/my')
        this.myOrders = response.data.data
      } catch (error) {
        console.error('Failed to fetch my orders:', error)
        throw error
      }
    },

    async fetchAllOrders() {
      try {
        const response = await axios.get('/orders')
        this.orders = response.data.data
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        throw error
      }
    },

    async updateOrderState(orderId, state) {
      try {
        await axios.patch(`/orders/${orderId}/state`, { state })
        await this.fetchAllOrders()
      } catch (error) {
        console.error('Failed to update order:', error)
        throw error
      }
    }
  }
})
