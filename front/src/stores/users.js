import { defineStore } from 'pinia'
import axios from 'axios'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: []
  }),

  actions: {
    async fetchUsers() {
      try {
        const response = await axios.get('/users')
        this.users = response.data.data
      } catch (error) {
        console.error('Failed to fetch users:', error)
        throw error
      }
    },

    async updateUser(id, userData) {
      try {
        const response = await axios.put(`/users/${id}`, userData)
        await this.fetchUsers()
        return response.data
      } catch (error) {
        console.error('Failed to update user:', error)
        throw error
      }
    },

    async deleteUser(id) {
      try {
        await axios.delete(`/users/${id}`)
        await this.fetchUsers()
      } catch (error) {
        console.error('Failed to delete user:', error)
        throw error
      }
    }
  }
})
