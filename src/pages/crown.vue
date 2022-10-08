<script setup lang="ts">
import * as t from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new t.Scene()

const geometry = new t.BoxGeometry(100, 100, 100) // 创建一个立方体几何对象Geometry
// 点渲染模式
const material = new t.MeshLambertMaterial({
  color: 0x906EFE,
  transparent: true,
  opacity: 0.8,
}) // 材质对象
const faces = new t.Mesh(geometry, material)
scene.add(faces)

// 设置产生投影的网格模型
faces.castShadow = true

// 创建一个平面几何体作为投影面
const planeGeometry = new t.PlaneGeometry(600, 700)
const planeMaterial = new t.MeshLambertMaterial({
  color: 0x808080,
})
// 平面网格模型作为投影面
const planeMesh = new t.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh) // 网格模型添加到场景中
planeMesh.rotateX(-Math.PI / 2) // 旋转网格模型
planeMesh.position.y = -50 // 设置网格模型y坐标
// 设置接收阴影的投影面
planeMesh.receiveShadow = true

// 坐标轴
// const axesHelper = new t.AxesHelper(300)
// scene.add(axesHelper)

// 灯光
// const lightPoint = new t.PointLight(0xFFFFFF)
// lightPoint.position.set(100, 200, 300)
// scene.add(lightPoint)

// const sphereSize = 10
// const pointLightHelper = new t.PointLightHelper(lightPoint, sphereSize)
// scene.add(pointLightHelper)

// 聚光顶
const spotLight = new t.SpotLight(0xFFFFFF)
// 设置光源位置
spotLight.position.set(100, 200, 200)
spotLight.penumbra = 1
spotLight.angle = Math.PI / 10
scene.add(spotLight)
// 光源投影
spotLight.castShadow = true
// 设置计算阴影的区域，注意包裹对象的周围
spotLight.shadow.camera.near = 10
spotLight.shadow.camera.far = 20
spotLight.shadow.focus = 1

// 聚光灯辅助对象
const lightHelper = new t.SpotLightHelper(spotLight)
scene.add(lightHelper)

// 自然光
const envLight = new t.AmbientLight(0x888888)
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
renderer.setClearColor(0x000, 0.9)
renderer.render(scene, camera)
renderer.shadowMap.enabled = true

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
  faces.rotateY(0.0003 * t)
}
animate()
</script>

<template>
  <div id="crown" />
</template>
