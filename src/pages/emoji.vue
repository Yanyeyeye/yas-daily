<script lang="ts" setup>
interface Emoji<T> {
  heads: T
  eyebrows: T
  eyes: T
  mouths: T
  details: T
}

// 定义emoji
const emoji: Emoji<Array<string>> = reactive({
  heads: [],
  eyebrows: [],
  eyes: [],
  mouths: [],
  details: [],
})

// 定义选择的emoji
const SelectEmoji: Emoji<string> = reactive({
  heads: '',
  eyebrows: '',
  eyes: '',
  mouths: '',
  details: '',
})

type SvgImageModule = typeof import('*.svg') // 导入svg模块的类型
type ImportModuleFunction = () => Promise<SvgImageModule> // 返回Promise resolve状态时的值

const el = $ref<HTMLCanvasElement>()
const ctx = $computed(() => el.getContext('2d')!)
const WIDTH = 1080
const HEIGHT = 1080

// 得到图片的路径
async function loadImageArray(params: Record<string, ImportModuleFunction>) {
  const items = Object.values(params).map(item => item())
  const modules = await Promise.all(items)
  return modules.map(module => module.default)
}

// 根据路径获得图片
async function getImages() {
  // head
  const modulesHeads = import.meta.glob<SvgImageModule>('../assets/emoji/heads/*.svg') // 得到svg类型的文件
  const Heads = await loadImageArray(modulesHeads) // 根据文件得到路径
  emoji.heads = Heads // 将路径放到数组中
  // eyebrows
  const modulesEyebrows = import.meta.glob<SvgImageModule>('../assets/emoji/eyebrows/*.svg')
  const Eyebrows = await loadImageArray(modulesEyebrows)
  emoji.eyebrows = ['', ...Eyebrows]
  // eyes
  const modulesEyes = import.meta.glob<SvgImageModule>('../assets/emoji/eyes/*.svg')
  const Eyes = await loadImageArray(modulesEyes)
  emoji.eyes = ['', ...Eyes]
  // mouths
  const modulesMouths = import.meta.glob<SvgImageModule>('../assets/emoji/mouths/*.svg')
  const Mouths = await loadImageArray(modulesMouths)
  emoji.mouths = ['', ...Mouths]
  // details
  const modulesDetails = import.meta.glob<SvgImageModule>('../assets/emoji/details/*.svg')
  const Details = await loadImageArray(modulesDetails)
  emoji.details = ['', ...Details]
}

// 生成图片标签
function generateImages(path: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    if (path === '')
      resolve(null)
    const img = new Image(400, 400)
    img.src = path
    img.onload = (e) => {
      resolve(img)
    }
  })
}

watch(SelectEmoji, () => {
  const headPath = SelectEmoji.heads
  const eyesPath = SelectEmoji.eyes
  const eyebrowsPath = SelectEmoji.eyebrows
  const mouthPath = SelectEmoji.mouths
  const detailPath = SelectEmoji.details
  Promise.all([
    generateImages(headPath),
    generateImages(eyesPath),
    generateImages(eyebrowsPath),
    generateImages(mouthPath),
    generateImages(detailPath),
  ]).then((images) => {
    ctx.clearRect(0, 0, el.width, el.height)
    images.forEach((img) => {
      img && ctx.drawImage(img, 0, 0, WIDTH, HEIGHT)
    })
    el.classList.add('animation')
    setTimeout(() => {
      el.classList.remove('animation')
    }, 500)
  })
},

)

onMounted(() => {
  getImages()
})
</script>

<template>
  <div font-800 mb-2 p-5 text-size-8>
    Create Emoji you Like
  </div>
  <canvas
    ref="el"
    w-150px
    h-150px
    width="1080"
    height="1080"
    m-auto
    border="~ rounded-5"
    bg-gray-100
    dark:bg-neutral-600
    class="animation"
  />
  <div m-auto>
    <h2 text-sm font-bold mt-3>
      Head
    </h2>
    <div flex flex-wrap justify-center>
      <div v-for="(item, index) in emoji.heads" :key="index">
        <Section @click="SelectEmoji.heads = item">
          <img :src="item">
        </Section>
      </div>
    </div>
    <h2 text-sm font-bold mt-3>
      Eyebrows
    </h2>
    <div flex flex-wrap justify-center>
      <div v-for="(item, index) in emoji.eyebrows" :key="index">
        <Section @click="SelectEmoji.eyebrows = item">
          <img :src="item">
        </Section>
      </div>
    </div>
    <h2 text-sm font-bold mt-3>
      Eyes
    </h2>
    <div flex flex-wrap justify-center>
      <div v-for="(item, index) in emoji.eyes" :key="index">
        <Section @click="SelectEmoji.eyes = item">
          <img :src="item">
        </Section>
      </div>
    </div>
    <h2 text-sm font-bold mt-3>
      Mouths
    </h2>
    <div flex flex-wrap justify-center>
      <div v-for="(item, index) in emoji.mouths" :key="index">
        <Section @click="SelectEmoji.mouths = item">
          <img :src="item">
        </Section>
      </div>
    </div>
    <h2 text-sm font-bold mt-3>
      Details
    </h2>
    <div flex flex-wrap justify-center>
      <div v-for="(item, index) in emoji.details" :key="index">
        <Section @click="SelectEmoji.details = item">
          <img :src="item">
        </Section>
      </div>
    </div>
  </div>
</template>
