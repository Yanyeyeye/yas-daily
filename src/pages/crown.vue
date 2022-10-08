<script setup lang="ts">
import * as t from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new t.Scene()
const geometry = new t.SphereGeometry(80, 50, 25)
const material = new t.PointsMaterial({
  color: 0xE5C07B,
  size: 3,
})
const point = new t.Points(geometry, material) // 网格对象
scene.add(point)

// 坐标轴
// const axesHelper = new t.AxesHelper(300)
// scene.add(axesHelper)

// 灯光
const lightPoint = new t.PointLight(0xFFFFFF)
lightPoint.position.set(400, 200, 300)
scene.add(lightPoint)

// 自然光
const envLight = new t.AmbientLight(0x404040)
scene.add(envLight)

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight - 130
const PROPOTION = WIDTH / HEIGHT
const RANGE = 200

const camera = new t.OrthographicCamera(-RANGE * PROPOTION, RANGE * PROPOTION, RANGE, -RANGE, 1, 1000)
camera.position.set(500, 100, 50)
camera.lookAt(scene.position)

const renderer = new t.WebGLRenderer()
renderer.setSize(WIDTH, HEIGHT)
renderer.setClearColor(0x000, 0.7)
renderer.render(scene, camera)

onMounted(() => {
  document.getElementById('crown')!.appendChild(renderer.domElement)
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', () => {
  renderer.render(scene, camera)
})

// 旋转
let T0 = new Date().getTime()
function animate() {
  const T1 = new Date().getTime()
  const t = T1 - T0
  T0 = T1
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  point.rotateY(0.0003 * t)
}
animate()
</script>

<template>
  <div id="crown" />
</template>
