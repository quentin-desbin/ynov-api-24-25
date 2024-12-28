<template>
  <nav v-if="authStore.isAuthenticated">
    <router-link to="/">Home</router-link> |
    <router-link to="/items">Items</router-link> |
    <router-link to="/my-orders">My Orders</router-link> |
    <span v-if="authStore.isAdmin">
      <router-link to="/admin/users">Users</router-link> |
      <router-link to="/admin/orders">Orders</router-link> |
      <router-link to="/admin/items">Manage Items</router-link> |
    </span>
    <a href="#" @click.prevent="logout">Logout</a>
  </nav>
  <router-view></router-view>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style>
nav {
  padding: 1rem;
  background: #f4f4f4;
}

nav a {
  margin: 0 0.5rem;
  text-decoration: none;
  color: #2c3e50;
}

nav a.router-link-active {
  color: #42b983;
}
</style> 