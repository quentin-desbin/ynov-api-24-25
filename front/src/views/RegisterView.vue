<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Username:</label>
        <input type="text" v-model="form.username" required>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="form.password" required>
      </div>
      <div class="form-group">
        <label>First Name:</label>
        <input type="text" v-model="form.firstName">
      </div>
      <div class="form-group">
        <label>Last Name:</label>
        <input type="text" v-model="form.lastName">
      </div>
      <button type="submit">Register</button>
      <p>
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const form = reactive({
  username: '',
  password: '',
  firstName: '',
  lastName: ''
})

const handleSubmit = async () => {
  try {
    await axios.post('/users/register', form)
    router.push('/login')
  } catch (error) {
    alert('Registration failed: ' + error.response?.data?.message || error.message)
  }
}
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
}

button {
  width: 100%;
  padding: 0.5rem;
  background: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background: #3aa876;
}
</style>
