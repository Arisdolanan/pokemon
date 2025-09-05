<template>
  <div class="loading-container d-flex justify-content-center align-items-center" :style="{ minHeight: height }">
    <div class="text-center">
      <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted mb-0">{{ message }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LoadingSpinner',
    props: {
      message: {
        type: String,
        default: 'Loading Pokémon...',
      },
      height: {
        type: String,
        default: '200px',
      },
    },
  }
</script>

<style scoped>
  .loading-container {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
  }
</style>
