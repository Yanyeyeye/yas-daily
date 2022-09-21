<script setup lang="ts">
import { useAxios } from '@vueuse/integrations/useAxios'

async function getBusData() {
  const instance = axios.create({
    baseURL: 'https://api.8684.cn/',
  })

  const { data } = useAxios('bus_station_map_station.php?code=24f5dad9&ecity=shaoxing&kind=1', { method: 'POST' }, instance)
  console.log(data)
}
getBusData()
</script>

<template>
  <h3>bus</h3>
</template>
