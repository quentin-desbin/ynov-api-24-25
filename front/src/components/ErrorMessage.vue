<template>
  <div class="error-message" :class="type">
    <div class="content">
      <span class="message">{{ message }}</span>
      <button v-if="retryAction" @click="retryAction" class="retry">
        Retry
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info'].includes(value)
  },
  retryAction: {
    type: Function,
    default: null
  }
})
</script>

<style scoped>
.error-message {
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  color: #c62828;
}

.warning {
  background: #fff3e0;
  border: 1px solid #ffe0b2;
  color: #ef6c00;
}

.info {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  color: #1976d2;
}

.retry {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.9em;
}

.error .retry {
  color: #c62828;
}

.warning .retry {
  color: #ef6c00;
}

.info .retry {
  color: #1976d2;
}

.retry:hover {
  opacity: 0.9;
}
</style> 