<script lang="ts" setup>
const el = $ref<HTMLCanvasElement>()
const ctx = $computed(() => el!.getContext('2d')!)

const WIDTH = 300
const HEIGHT = 300

interface Point {
  x: number
  y: number
}

interface Branch {
  start: Point
  length: number
  theta: number
}

function init() {
  ctx.strokeStyle = 'rgba(147,149,152,0.5)'

  step({
    start: { x: WIDTH / 2, y: HEIGHT },
    length: 20,
    theta: -Math.PI / 2,
  })
}

// 执行一个闭包函数
const pendingTask: Function[] = []

// depth为深度即多少深度之前一定会长出来
function step(b: Branch, depth = 0) {
  const end = getEndPoint(b)
  drawBranch(b)
  if (depth < 4 || Math.random() < 0.5) {
    pendingTask.push(() => {
      step({
        start: end,
        length: b.length + (Math.random() * 10 - 3),
        theta: b.theta - 0.2 * Math.random(),
      }, depth + 1)
    })
  }
  if (depth < 4 || Math.random() < 0.5) {
    pendingTask.push(() => {
      step({
        start: end,
        length: b.length + (Math.random() * 10 - 3),
        theta: b.theta + 0.2 * Math.random(),
      }, depth + 1)
    })
  }
}

function frame() {
  const tasks = [...pendingTask] // 浅拷贝防止原来的数组被篡改
  pendingTask.length = 0
  tasks.forEach(fn => fn())
}

let framesCount = 0
function startFrame() {
  requestAnimationFrame(() => {
    framesCount++
    if (framesCount % 3 === 0) // 5帧画一次
      frame()
    startFrame()
  })
}

startFrame()

function lineTo(p1: Point, p2: Point) {
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

function getEndPoint(b: Branch): Point {
  return {
    x: b.start.x + b.length * Math.cos(b.theta),
    y: b.start.y + b.length * Math.sin(b.theta),
  }
}

function drawBranch(l: Branch) {
  lineTo(l.start, getEndPoint(l))
}

onMounted(() => {
  init()
})
const router = useRouter()
const go = () => {
  router.push('/emoji')
}
</script>

<template>
  <div h-660px>
    <div font-800 mb-2 p-5 text-size-8 text-center>
      Plum
    </div>
    <canvas ref="el" width="300" height="300" m-auto border="~ rounded-2" />
    <div text-center mt-3>
      <div btn h-10 @click="go">
        <div i-carbon-face-cool text-xl />
        <span font-bold pl-2>
          Emoji
        </span>
      </div>
    </div>
  </div>
</template>
