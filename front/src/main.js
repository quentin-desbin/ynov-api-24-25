import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Configure axios defaults
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL

// If there's a token in localStorage, set it in axios defaults
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app') 