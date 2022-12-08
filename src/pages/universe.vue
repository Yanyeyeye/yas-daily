<script setup lang="ts">
import * as t from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import GalaxyVertexShader from '../glsl/vertex_galaxy.glsl?raw'
import GalaxyFragmentShader from '../glsl/fragment_galaxy.glsl?raw'

/**
 * gui
 */
const gui = new dat.GUI({ closed: true, width: 400 }) // 设置关闭与宽度

const scene = new t.Scene()
/**
 * texture loader
 */
// const textLoader = new t.TextureLoader()

/**
 * Galaxy
 */
const parameters = {
  count: 100000,
  size: 30,
  radius: 5,
  branch: 3,
  spin: 1,
  randomness: 0.5,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
}

let geometry: t.BufferGeometry | null
let material: t.ShaderMaterial | null
let points: t.Points<t.BufferGeometry, t.ShaderMaterial> | null

const generateGalaxy = () => {
  // initial old universe
  if (points) {
    geometry!.dispose()
    material!.dispose()
    scene.remove(points)
  }
  /**
   * Geometry
   */
  geometry = new t.BufferGeometry()

  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)
  const scales = new Float32Array(parameters.count * 1)
  const randomness = new Float32Array(parameters.count * 3)

  const colorInside = new t.Color(parameters.insideColor)
  const colorOutside = new t.Color(parameters.outsideColor)

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3

    const radius = Math.random() * parameters.radius
    // const spinAngle = radius * parameters.spin
    const branchAngle = (i % parameters.branch) / parameters.branch * Math.PI * 2

    positions[i3] = Math.cos(branchAngle) * radius // x
    // positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX // x
    positions[i3 + 1] = 0// y
    positions[i3 + 2] = Math.sin(branchAngle) * radius// z
    // positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ// z

    const randomX = Math.random() ** parameters.randomnessPower * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
    const randomY = Math.random() ** parameters.randomnessPower * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
    const randomZ = Math.random() ** parameters.randomnessPower * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius

    randomness[i3] = randomX
    randomness[i3 + 1] = randomY
    randomness[i3 + 2] = randomZ

    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)
    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b

    scales[i] = Math.random()
  }

  geometry.setAttribute('position', new t.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new t.BufferAttribute(colors, 3))
  geometry.setAttribute('aScale', new t.BufferAttribute(scales, 1))
  geometry.setAttribute('aRandomness', new t.BufferAttribute(randomness, 3))

  /**
   * Material
   */
  material = new t.ShaderMaterial({
    vertexShader: GalaxyVertexShader,
    fragmentShader: GalaxyFragmentShader,
    depthWrite: false,
    blending: t.AdditiveBlending,
    vertexColors: true,
    uniforms: {
      uTime: {
        value: 0,
      },
      uSize: {
        value: parameters.size * renderer.getPixelRatio(),
      },
    },
  })

  /**
   * Points
   */
  points = new t.Points(geometry, material)
  scene.add(points)
}

/**
 * GUI
 */

gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.1).max(50).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branch').min(1).max(10).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

const SIZE = {
  width: window.innerWidth,
  height: window.innerHeight - 130,
}
const PROPOTION = SIZE.width / SIZE.height

const camera = new t.PerspectiveCamera(75, PROPOTION)
camera.position.z = 7
camera.position.y = 3
camera.position.x = 2

const renderer = new t.WebGLRenderer()
generateGalaxy()
renderer.setSize(SIZE.width, SIZE.height)
renderer.setClearColor(0x000, 1)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor(0x262837)
// 设置自动检测大小
WinResize(SIZE, camera, renderer, { yoffset: 130 })

// 帧率显示器
const stats = statsPanel('universe', 0, { top: 53 })
onMounted(() => {
  document.getElementById('universe')!.appendChild(renderer.domElement)
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
  // TODO
  material!.uniforms.uTime.value = elapsedTime
  renderer.render(scene, camera) // 重新渲染渲染器也就是让渲染器拍照记录物体新的位置
  stats.end()// 帧率显示器
  requestAnimationFrame(animate)// 调用动画渲染60帧/s的显示屏
}
animate() // 调用动画函数

const router = useRouter()
const go = () => {
  router.push('/innerMaterial')
}
</script>

<template>
  <div id="universe">
    <div absolute bottom-20 right-5>
      <div btn h-10 @click="go">
        <div i-jam-aperture text-xl />
        <span font-bold pl-2>
          innerMaterial
        </span>
      </div>
    </div>
  </div>
</template>
