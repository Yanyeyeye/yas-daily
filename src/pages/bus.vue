<script lang="ts" setup>
const { BusData } = use8486BusData()
</script>

<template>
  <h3>bus:</h3>
  <p>{{ BusData }}</p>
  <h3>总共：{{ BusData.length }}条线路</h3>
</template>
