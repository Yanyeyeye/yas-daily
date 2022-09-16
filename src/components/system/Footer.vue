<script setup lang="ts">
</script>

<template>
  <nav text-xl mt-5 gap-2 text-center>
    <button icon-btn @click="toggleDark()">
      <div dark:i-carbon-moon i-carbon-sun />
    </button>
  </nav>
</template>
