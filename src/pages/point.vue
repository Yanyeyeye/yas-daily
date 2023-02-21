<script setup lang="ts">
import * as t from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import TWEEN from '@tweenjs/tween.js'
/**
 * gui
 */
// const gui = new dat.GUI({ closed: true, width: 400 }) // 设置关闭与宽度

/**
 * all particle
 */
const arrays: any[] = [] // 模型粒子的数组

const scene = new t.Scene()

/**
 * loadingManager
 */
const manager = new t.LoadingManager()

/**
 * texture loader
 */
const textLoader = new t.TextureLoader()
const particleTexture = textLoader.load(
  new URL('/textures/particles/1.png', import.meta.url).href,
)
/**
  * gltf loader
  */
const gltfLoader = new GLTFLoader(manager)

/**
 * Models
 */
gltfLoader.load(
  new URL('/models/LeePerrySmith/LeePerrySmith.glb', import.meta.url).href,
  (gltf) => {
    gltf.scene.traverse((child) => {
      if (child instanceof t.Mesh) {
        const { array } = child.geometry.attributes.position
        arrays.push(array)
      }
    })
  },
)

gltfLoader.load(
  new URL('/models/monkey/monkey.glb', import.meta.url).href,
  (gltf) => {
    gltf.scene.traverse((child) => {
      if (child instanceof t.Mesh) {
        const { array } = child.geometry.attributes.position
        arrays.push(array)
      }
    })
  },
)

const particleGeometry: t.BufferGeometry = new t.BufferGeometry()
particleGeometry.tween = []
const vertices = []
const count = 27837
for (let i = 0; i < count; i++) {
  // 给每个顶点创建一个三维坐标
  const position = t.MathUtils.randFloat(-4, 4)
  // 为每个粒子增加相同的动画函数
  particleGeometry.tween.push(new TWEEN.Tween({ position }).easing(TWEEN.Easing.Exponential.Out))
  vertices.push(position)
}
particleGeometry.setAttribute('position', new t.BufferAttribute(new Float32Array(vertices), 3))

const particleMaterial: t.PointsMaterial | null = new t.PointsMaterial({
  map: particleTexture,
  size: 0.02,
  transparent: true,
  depthWrite: false,
  blending: t.AdditiveBlending,
})

const particles: t.Points<t.BufferGeometry, t.PointsMaterial> | null = new t.Points(particleGeometry, particleMaterial)
scene.add(particles)

const current = 1
function transition() {
  // i为原有生成的粒子模型的索引，j为导入模型的索引
  for (let i = 0, j = 0; i < count; i++, j++) {
    const item = particleGeometry!.tween[i] // 拿到初始每个粒子坐标上的动画
    if (j >= arrays[current].length)
      j = 0
    item.to({ position: arrays[current][j] }, t.MathUtils.randFloat(1000, 4000))
      .onUpdate(({ position }: { position: number }) => {
        particleGeometry.attributes.position.array[i] = position
        particleGeometry.attributes.position.needsUpdate = true
      }).start()

    // setTimeout(() => { transition() }, 5000)
    // current = (current + 1) % 2
  }
}

/**
 * initial setting ↓
 */

/**
 * Lights
 */
const directionalLight = new t.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(1, 5, 2.25)
scene.add(directionalLight)

const SIZE = {
  width: window.innerWidth,
  height: window.innerHeight - 130,
}
const PROPOTION = SIZE.width / SIZE.height

const camera = new t.PerspectiveCamera(75, PROPOTION)
camera.position.z = 7
// camera.position.y = 3
// camera.position.x = 10

const renderer = new t.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true // 是否使用物理上正确的光照
renderer.outputEncoding = t.sRGBEncoding // 让渲染真实一些
renderer.toneMapping = t.ACESFilmicToneMapping // 色调
renderer.toneMappingExposure = 1 // 曝光
renderer.setSize(SIZE.width, SIZE.height)
renderer.setClearColor(0x000, 1)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor(0x262837)
// 设置自动检测大小
WinResize(SIZE, camera, renderer, { yoffset: 130 })

// 帧率显示器
const stats = statsPanel('point', 0, { top: 53 })
onMounted(() => {
  document.getElementById('point')!.appendChild(renderer.domElement)
  manager.onLoad = () => {
    transition()
  }
})

// 鼠标操作
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const clock = new t.Clock() // 从初始化时就开始运行
// animate()
const animate = () => {
  stats.begin() // 帧率显示器
  controls.update() // 鼠标控制
  const elapsedTime = clock.getElapsedTime() // 得到过去的时间，返回的是秒
  // const deltaTime = elapsedTime - previousTime
  // previousTime = elapsedTime
  // TODO
  TWEEN.update()
  particles.rotation.y = elapsedTime * 0.03
  renderer.render(scene, camera) // 重新渲染渲染器也就是让渲染器拍照记录物体新的位置
  stats.end()// 帧率显示器
  requestAnimationFrame(animate)// 调用动画渲染60帧/s的显示屏
}
animate() // 调用动画函数
</script>

<template>
  <div id="point" />
</template>

<style lang="scss" scoped>

</style>
