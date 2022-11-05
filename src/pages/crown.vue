<script setup lang="ts">
import * as t from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
// import * as dat from 'dat.gui'

const scene = new t.Scene()
/**
 * texture
 */
const textureLoader = new t.TextureLoader()
const textureMatcap = textureLoader.load(new URL('../assets/textures/matcaps/8.png', import.meta.url).href)

/**
 * fonts
 */
const loader = new FontLoader()
loader.load(
  new URL('../assets/fonts/helvetiker_bold.typeface.json', import.meta.url).href,
  (font) => {
    const geometry = new TextGeometry(
      'Yanyeyeyes', // 要实现的字体
      {
        font, // 所加载使用的字体
        size: 0.5, // 字体大小
        height: 0.2, // 文本厚度
        curveSegments: 3, // 文本曲线上点的数量
        bevelEnabled: true, // 是否开启斜角，默认为false
        bevelThickness: 0.03, // 文本上斜角的深度
        bevelSize: 0.02,
        bevelSegments: 3, // 斜角的分段数
      },
    )
    geometry.computeBoundingBox()
    geometry.center()
    const material = new t.MeshMatcapMaterial({ matcap: textureMatcap })
    const mesh = new t.Mesh(geometry, material)
    scene.add(mesh)
  },
)

/**
 * geometry
 */
const geometry = new t.BoxGeometry(1, 1, 1)
const material = new t.MeshMatcapMaterial({ matcap: textureMatcap })
for (let i = 0; i < 300; i++) {
  const box = new t.Mesh(geometry, material)
  // 改变box的位置
  box.position.x = (Math.random() - 0.5) * 10
  box.position.y = (Math.random() - 0.5) * 10
  box.position.z = (Math.random() - 0.5) * 10

  // 改变box的朝向
  box.rotation.x = Math.random() * Math.PI
  box.rotation.y = Math.random() * Math.PI

  // 改变box大小
  const scale = Math.random()
  // box.scale.x = scale
  // box.scale.y = scale
  // box.scale.z = scale
  box.scale.set(scale, scale, scale)

  scene.add(box)
}

const SIZE = {
  width: window.innerWidth,
  height: window.innerHeight - 130,
}
const PROPOTION = SIZE.width / SIZE.height

const camera = new t.PerspectiveCamera(75, PROPOTION)
camera.position.z = 2

const renderer = new t.WebGLRenderer()
renderer.setSize(SIZE.width, SIZE.height)
renderer.setClearColor(0x000, 0.9)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// 设置自动检测大小
WinResize(SIZE, { yoffset: 130 }, camera, renderer)

// 帧率显示器
const stats = statsPanel('crown', 0, { top: 53 })
onMounted(() => {
  document.getElementById('crown')!.appendChild(renderer.domElement)
})

// 鼠标操作
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// const clock = new t.Clock() // 从初始化时就开始运行
// animate()
const animate = () => {
  stats.begin() // 帧率显示器
  controls.update() // 鼠标控制
  // const elapsedTime = clock.getElapsedTime() // 得到过去的时间，返回的是秒
  // sphere.rotation.y = elapsedTime
  // plane.rotation.y = elapsedTime
  // torus.rotation.y = elapsedTime
  renderer.render(scene, camera) // 重新渲染渲染器也就是让渲染器拍照记录物体新的位置
  stats.end()// 帧率显示器
  requestAnimationFrame(animate)// 调用动画渲染60帧/s的显示屏
}
animate() // 调用动画函数
</script>

<template>
  <div id="crown" />
</template>
