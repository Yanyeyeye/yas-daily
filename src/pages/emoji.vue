<script lang="ts" setup>
let heads = $ref<any>()
let eyebrows = $ref<any>()
let eyes = $ref<any>()
let mouths = $ref<any>()
let details = $ref<any>()

const Head = ref()
const EYEBROW = ref()
const EYE = ref()
const MOUTH = ref()
const DETAIL = ref()

async function getImages() {
  // head
  const modulesHeads = import.meta.glob('../assets/emoji/heads/*.svg')
  const headkeys = Object.values(modulesHeads).map(item => item())
  heads = await Promise.all(headkeys)
  // eyebrows
  const modulesEyebrows = import.meta.glob('../assets/emoji/eyebrows/*.svg')
  const eyebrowskeys = Object.values(modulesEyebrows).map(item => item())
  eyebrows = await Promise.all(eyebrowskeys)
  // eyes
  const modulesEyes = import.meta.glob('../assets/emoji/eyes/*.svg')
  const eyekeys = Object.values(modulesEyes).map(item => item())
  eyes = await Promise.all(eyekeys)
  // mouths
  const modulesMouths = import.meta.glob('../assets/emoji/mouths/*.svg')
  const mouthkeys = Object.values(modulesMouths).map(item => item())
  mouths = await Promise.all(mouthkeys)
  // details
  const modulesDetails = import.meta.glob('../assets/emoji/details/*.svg')
  const detailkeys = Object.values(modulesDetails).map(item => item())
  details = await Promise.all(detailkeys)
}

onMounted(() => {
  getImages()
})
</script>

<template>
  <div font-800 mb-2 style="font-size: 30px;">
    Create Emoji you Like
  </div>
  <div
    m-auto
    mb-10
    h-50
    w-50
    border
    border-dark
    border-rounded-2
    bg-gray-100
  >
    <img h-50 w-50 absolute :src="Head">
    <img h-50 w-50 absolute :src="EYEBROW">
    <img h-50 w-50 absolute :src="EYE">
    <img h-50 w-50 absolute :src="MOUTH">
    <img h-50 w-50 absolute :src="DETAIL">
  </div>
  <h2 text-sm font-bold mt-3>Please choose head</h2>
  <div flex flex-wrap justify-center>
    <template v-for="item in heads" :key="item.default">
      <Section @click="Head = item.default">
        <img :src="item.default">
      </Section>
    </template>
  </div>
  <h2 text-sm font-bold mt-3>Please choose eyebrows</h2>
  <div flex flex-wrap justify-center>
    <template v-for="item in eyebrows" :key="item.default">
      <Section @click="EYEBROW = item.default">
        <img :src="item.default">
      </Section>
    </template>
  </div>
  <h2 text-sm font-bold mt-3>Please choose eyes</h2>
  <div flex flex-wrap justify-center>
    <template v-for="item in eyes" :key="item.default">
      <Section @click="EYE = item.default">
        <img :src="item.default">
      </Section>
    </template>
  </div>
  <h2 text-sm font-bold mt-3>Please choose mouths</h2>
  <div flex flex-wrap justify-center>
    <template v-for="item in mouths" :key="item.default">
      <Section @click="MOUTH = item.default">
        <img :src="item.default">
      </Section>
    </template>
  </div>
  <h2 text-sm font-bold mt-3>Please choose details</h2>
  <div flex flex-wrap justify-center>
    <template v-for="item in details" :key="item.default">
      <Section @click="DETAIL = item.default">
        <img :src="item.default">
      </Section>
    </template>
  </div>
</template>
