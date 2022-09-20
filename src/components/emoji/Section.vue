<script lang="ts" setup>
interface Props {
  selected: boolean
}
const { selected } = defineProps<Props>()
</script>

<template>
  <div
    flex h-10 w-10 p-1 m-1
    border="~ 1 rounded-md"
    cursor="pointer"
    hover="bg-emerald-100 border-2 border-emerald-500 dark:bg-emerald-300 "
    :class="selected ? 'border-emerald-500 border-2 bg-emerald-100 dark:bg-emerald-300' : 'bg-gray-100 border-2 dark:border-gray-500 dark:bg-gray-400'"
  >
    <slot />
  </div>
</template>
