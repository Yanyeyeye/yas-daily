<script setup lang="ts">
import * as t from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import * as c from 'cannon-es' //物理
// import * as dat from 'dat.gui' // 调试
// import gsap from 'gsap'

const scene = new t.Scene()
// const gui = new dat.GUI({ closed: true })

/**
 * ambientLight and directLight
 */
const ambientLight = new t.AmbientLight(0xFFFFFF, 0.5)// 环境光源
const directLight = new t.DirectionalLight(0xFFFCCC, 0.5)
directLight.castShadow = true // 平行光能产生阴影
directLight.position.x = 2
directLight.position.y = 3
directLight.position.z = 2
const directLightHelper = new t.DirectionalLightHelper(directLight, 0.5)

scene.add(ambientLight, directLight, directLightHelper)

const SIZE = {
  width: window.innerWidth,
  height: window.innerHeight - 130,
}
const PROPOTION = SIZE.width / SIZE.height

const camera = new t.PerspectiveCamera(75, PROPOTION)
camera.position.z = 10
camera.position.x = 0
camera.position.y = 10

const renderer = new t.WebGLRenderer()
renderer.setSize(SIZE.width, SIZE.height)
renderer.setClearColor(0x000, 1)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor(0x262837)
renderer.shadowMap.enabled = true // 渲染阴影
// 设置自动检测大小
WinResize(SIZE, camera, renderer, { yoffset: 130 })

// 帧率显示器
const stats = statsPanel('three', 0, { top: 53 })

onMounted(() => {
  const canvas = document.getElementById('three')!
  canvas.appendChild(renderer.domElement)
})
// 坐标辅助
// const axesHelper = new t.AxesHelper(300)
// scene.add(axesHelper)

// 鼠标操作
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
// controls.autoRotate = true // 摄像机自动绕屏幕转动

// 双击全屏化
dbClkfullScreen(document.body)

// let previousTime = 0
// const clock = new t.Clock() // 从初始化时就开始运行
// animate()
const animate = () => {
  stats.begin() // 帧率显示器
  controls.update() // 鼠标控制
  // const elapsedTime = clock.getElapsedTime() // 得到过去的时间，返回的是秒
  // const deltaTime = elapsedTime - previousTime
  // previousTime = elapsedTime
  // TODO

  renderer.render(scene, camera) // 重新渲染渲染器也就是让渲染器拍照记录物体新的位置
  stats.end()// 帧率显示器
  requestAnimationFrame(animate)// 调用动画渲染60帧/s的显示屏
}
animate() // 调用动画函数
</script>

<template>
  <div id="three" />
</template>
