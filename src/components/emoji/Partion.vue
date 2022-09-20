<script setup lang="ts">
interface Props {
  partions: Array<string>
  selectPartions: string
  title: string
}

const { partions, title, selectPartions } = defineProps<Props>()

defineEmits<{
  (e: 'choose', value: string): void
}>()

const captialTitle = computed(() => {
  return title[0].toUpperCase() + title.substring(1)
})
</script>

<template>
  <h2 text-lg font-bold pl-2>
    {{ captialTitle }}
  </h2>
  <div flex="~ wrap" justify-left>
    <div v-for="(item, index) in partions" :key="index">
      <Section :selected="item === selectPartions" @click="$emit('choose', item)">
        <img :src="item">
      </Section>
    </div>
  </div>
</template>
