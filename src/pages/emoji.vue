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
const ctx = $computed(() => el!.getContext('2d')!)
const WIDTH = 540
const HEIGHT = 540

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
  randRomEmoji()
}

// 生成图片标签
function generateImages(path: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    if (path === '')
      resolve(null)
    const img = new Image(400, 400)
    img.src = path
    img.onload = () => {
      resolve(img)
    }
  })
}

// 随机取数
function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min // 含最大值，含最小值
}

// 随机生成emoji
function randRomEmoji() {
  const headLength = emoji.heads.length - 1
  const eyebrowLength = emoji.eyebrows.length - 1
  const eyeLength = emoji.eyes.length - 1
  const mouthLength = emoji.mouths.length - 1
  const detailLength = emoji.details.length - 1
  SelectEmoji.heads = emoji.heads[randomNumber(0, headLength)]
  SelectEmoji.eyebrows = emoji.eyebrows[randomNumber(1, eyebrowLength)]
  SelectEmoji.eyes = emoji.eyes[randomNumber(1, eyeLength)]
  SelectEmoji.mouths = emoji.mouths[randomNumber(1, mouthLength)]
  SelectEmoji.details = emoji.details[randomNumber(0, detailLength)]
}

// 监听
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
    // 清除画布
    ctx.clearRect(0, 0, el!.width, el!.height)
    // 遍历得到的图片集
    images.forEach((img) => {
      // 画emoji的身体各个部分
      img && ctx.drawImage(img, 0, 0, WIDTH, HEIGHT)
    })
    el!.classList.add('animation')
    setTimeout(() => {
      el!.classList.remove('animation')
    }, 500)
  })
})

// 导出PNG图片
function exportPNG() {
  el!.toBlob((blob: Blob | null) => {
    const PNG = document.createElement('a')
    const url = URL.createObjectURL(blob!)
    PNG.href = url
    PNG.download = `emoji_${Date.now()}`
    PNG.click()
  })
}

// 导出SVG格式图片
// async function exportSVG() {
//   TODO
//   const parser = new DOMParser()
//   // 将svg转成svg文档(text)
//   const documents = await Promise.all(Object.values(SelectEmoji).map(imageUrl => fetch(imageUrl).then(res => res.text())))
//   // 将每一项svg装换成dom标签
// }

onMounted(() => {
  getImages()
})
const router = useRouter()
const go = () => {
  router.push('/bus')
}
</script>

<template>
  <div font-800 mb-5 text="size-8 center">
    Create Emoji you Like
  </div>
  <div
    flex="~ wrap" lg="w-300" md="w-150" sm="w-100" w-80 flex-shrink-0 mx-auto justify-center bg="dark:neutral-600" p-10 border="~ rounded-5 width-2"
    shadow-lg bg-opacity-100 bg-white
  >
    <div mx-30>
      <div>
        <div relative w-200px h-200px m-auto>
          <canvas
            ref="el" w-200px h-200px width="540" height="540" border="~ rounded-5" bg-gray-100 dark:bg-gray-200
            shadow-lg
          />
          <div btn h-10 w-10 p2 absolute left-175px bottom--10px @click="randRomEmoji">
            <div i-mdi-refresh text-2xl />
          </div>
        </div>
        <div mt-5 text-center>
          <div btn h-10 @click="exportPNG">
            <div i-mdi-export text-xl />
            <span font-bold pl-2>
              Export PNG
            </span>
          </div>
          <!-- <div btn h-10 ml-5 @click="exportSVG">
                    <div i-mdi-export text-xl />
                    <span font-bold pl-2>
                      Export SVG
                    </span>
                  </div> -->
        </div>
      </div>
    </div>
    <div w-130>
      <div v-for="(value, key) in emoji" :key="key">
        <Partion :partions="value" :title="key" :select-partions="SelectEmoji[key]" @choose="n => SelectEmoji[key] = n" />
      </div>
    </div>
  </div>
  <div lg="text-right" text-center mt-3 mr-3>
    <div btn h-10 @click="go">
      <div i-carbon-bus text-xl />
      <span font-bold pl-2>
        Bus
      </span>
    </div>
  </div>
</template>
