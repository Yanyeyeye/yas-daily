<script lang="ts" setup>
const router = useRouter()
const go = () => {
  router.push('/galaxy')
}
</script>

<template>
  <h3>bus:</h3>
  <div lg="text-right" text-center mt-3 mr-3>
    <div btn h-10 @click="go">
      <div i-jam-star text-xl />
      <span font-bold pl-2>
        galaxy
      </span>
    </div>
  </div>
</template>
