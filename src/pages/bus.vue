<script lang="ts" setup>
const router = useRouter()
const go = () => {
  router.push('/crown')
}
</script>

<template>
  <h3>bus:</h3>
  <div lg="text-right" text-center mt-3 mr-3>
    <div btn h-10 @click="go">
      <div i-jam-crown text-xl />
      <span font-bold pl-2>
        crown
      </span>
    </div>
  </div>
</template>
