<script setup lang="ts">
</script>

<template>
  <header text-xl gap-2 text-right p-3>
    <button icon-btn @click="toggleDark()">
      <div dark:i-carbon-moon i-carbon-sun />
    </button>
  </header>
</template>
