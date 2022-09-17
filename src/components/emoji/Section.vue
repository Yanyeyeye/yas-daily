<template>
  <div
    flex
    h10
    w10
    p1
    m1
    rounded-md
    border border-1
    bg-gray-100
    cursor="pointer"
    hover="bg-gray-200 dark:bg-gray-500"
    dark:bg-neutral-400
  >
    <slot />
  </div>
</template>
