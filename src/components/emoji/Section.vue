<script lang="ts" setup>
interface Props {
  selected: boolean
}
const props = defineProps<Props>()
</script>

<template>
  <div
    flex
    h10
    w10
    p1
    m1
    rounded-md
    border="~ 1"
    cursor="pointer"
    hover="bg-gray-200 dark:bg-gray-500"
    :class="{ 'border-emerald-500 border-2 bg-emerald-100': props.selected }"
    dark:bg-neutral-400
  >
    <slot />
  </div>
</template>
