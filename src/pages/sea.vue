<script setup lang="ts">
import * as t from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui' // 调试
import testVertexShader from '../glsl/vertex.glsl'
import testFragmentShader from '../glsl/fragment.glsl'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// import * as c from 'cannon-es' //物理
// import gsap from 'gsap'

// const textureLoader = new t.TextureLoader()

const scene = new t.Scene()
const gui = new dat.GUI({ closed: true })
const debugObject = {
  depthColor: '#186691',
  surfaceColor: '#9bd8ff',
}

/**
 * material
 */
const material = new t.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  uniforms: {
    uBigWavesElevation: {
      value: 0.2,
    },
    uBigWavesFrequency: {
      value: new t.Vector2(4, 1.5),
    },
    uTime: {
      value: 0,
    },
    uBigWavesSpeed: {
      value: 1,
    },
    uDepthColor: {
      value: new t.Color(debugObject.depthColor),
    },
    uSurfaceColor: {
      value: new t.Color(debugObject.surfaceColor),
    },
    uColorOffset: {
      value: 0.08,
    },
    uColorMultiplier: {
      value: 5,
    },
    uSmallWavesElevation: {
      value: 0.15,
    },
    uSmallWavesFrequency: {
      value: 3,
    },
    uSmallWavesSpeed: {
      value: 0.2,
    },
    uSmallInterations: {
      value: 4.0,
    },
  },
  side: t.DoubleSide,
})

/**
 * Plane
 */
const planeGeometry = new t.PlaneGeometry(2, 2, 512, 512)

const plane = new t.Mesh(planeGeometry, material)
plane.rotation.x = -Math.PI * 0.5
scene.add(plane)

/**
 * GUI
 */
gui.add(material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWaveElevation')
gui.add(material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
gui.add(material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
gui.add(material.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.01).name('uBigWavesSpeed')
gui.addColor(debugObject, 'depthColor')
  .name('depthColor')
  .onChange(() => {
    material.uniforms.uDepthColor.value.set(debugObject.depthColor)
  })
gui.addColor(debugObject, 'surfaceColor')
  .name('surfaceColor')
  .onChange(() => {
    material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
  })
gui.add(material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(material.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')
gui.add(material.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(material.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(1).name('uSmallWavesFrequency')
gui.add(material.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
gui.add(material.uniforms.uSmallInterations, 'value').min(0).max(10).step(1).name('uSmallInterations')

/**
 * ambientLight and directLight
 */
// const ambientLight = new t.AmbientLight(0xFFFFFF, 0.5)// 环境光源
// const directLight = new t.DirectionalLight(0xFFFCCC, 0.5)
// directLight.castShadow = true // 平行光能产生阴影
// directLight.position.x = 2
// directLight.position.y = 3
// directLight.position.z = 2
// const directLightHelper = new t.DirectionalLightHelper(directLight, 0.5)

// scene.add(ambientLight, directLight)

const SIZE = {
  width: window.innerWidth,
  height: window.innerHeight - 130,
}
const PROPOTION = SIZE.width / SIZE.height

const camera = new t.PerspectiveCamera(75, PROPOTION, 0.1, 100)
camera.position.z = 2
// camera.position.x = 2
camera.position.y = 1

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
const clock = new t.Clock() // 从初始化时就开始运行
// animate()
const animate = () => {
  stats.begin() // 帧率显示器
  controls.update() // 鼠标控制
  const elapsedTime = clock.getElapsedTime() // 得到过去的时间，返回的是秒
  // const deltaTime = elapsedTime - previousTime
  // previousTime = elapsedTime
  // TODO
  // Update water
  material.uniforms.uTime.value = elapsedTime
  renderer.render(scene, camera) // 重新渲染渲染器也就是让渲染器拍照记录物体新的位置
  stats.end()// 帧率显示器
  requestAnimationFrame(animate)// 调用动画渲染60帧/s的显示屏
}
animate() // 调用动画函数
const router = useRouter()
const go = () => {
  router.push('/three')
}
</script>

<template>
  <div id="three">
    <div absolute bottom-20 right-5>
      <div btn h-10 @click="go">
        <div i-jam-aperture text-xl />
        <span font-bold pl-2>
          three
        </span>
      </div>
    </div>
  </div>
</template>
