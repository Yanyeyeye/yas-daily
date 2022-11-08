<script setup lang="ts">
import * as t from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

/**
 * gui
 */
const gui = new dat.GUI({ closed: true, width: 400 }) // 设置关闭与宽度

const scene = new t.Scene()
/**
 * fog
 */
const fog = new t.Fog('#262837', 1, 10)
scene.fog = fog
/**
 * texture loader
 */
const textLoader = new t.TextureLoader()
const doorMaterial = textLoader.load(new URL('../assets/textures/door/color.jpg', import.meta.url).href)
const doorAlphaMaterial = textLoader.load(new URL('../assets/textures/door/alpha.jpg', import.meta.url).href)
const doorAmbientMaterial = textLoader.load(new URL('../assets/textures/door/ambientOcclusion.jpg', import.meta.url).href)
const doorHeightMaterial = textLoader.load(new URL('../assets/textures/door/height.jpg', import.meta.url).href)
const doorNormalMaterial = textLoader.load(new URL('../assets/textures/door/normal.jpg', import.meta.url).href)
const doorRoughnessMaterial = textLoader.load(new URL('../assets/textures/door/roughness', import.meta.url).href)

const bricksColorTexture = textLoader.load(new URL('../assets/textures/bricks/color.jpg', import.meta.url).href)
const bricksAmbientTexture = textLoader.load(new URL('../assets/textures/bricks/ambientOcclusion.jpg', import.meta.url).href)
const bricksNormalTexture = textLoader.load(new URL('../assets/textures/bricks/normal.jpg', import.meta.url).href)
const bricksRoughnessTexture = textLoader.load(new URL('../assets/textures/bricks/roughness.jpg', import.meta.url).href)

const grassColorTexture = textLoader.load(new URL('../assets/textures/grass/color.jpg', import.meta.url).href)
const grassAmbientTexture = textLoader.load(new URL('../assets/textures/grass/ambientOcclusion.jpg', import.meta.url).href)
const grassNormalTexture = textLoader.load(new URL('../assets/textures/grass/normal.jpg', import.meta.url).href)
const grassRoughnessTexture = textLoader.load(new URL('../assets/textures/grass/roughness.jpg', import.meta.url).href)

grassColorTexture.repeat.set(8, 8)
grassAmbientTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)
grassColorTexture.wrapS = t.RepeatWrapping
grassAmbientTexture.wrapS = t.RepeatWrapping
grassNormalTexture.wrapS = t.RepeatWrapping
grassRoughnessTexture.wrapS = t.RepeatWrapping
grassColorTexture.wrapT = t.RepeatWrapping
grassAmbientTexture.wrapT = t.RepeatWrapping
grassNormalTexture.wrapT = t.RepeatWrapping
grassRoughnessTexture.wrapT = t.RepeatWrapping
/**
 * House
 */
// group
const house = new t.Group()
scene.add(house)

// walls
const wall = new t.Mesh(
  new t.BoxGeometry(2, 1, 2),
  new t.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  }),
)
wall.geometry.setAttribute(
  'uv2',
  new t.Float32BufferAttribute(wall.geometry.attributes.uv.array, 2),
)
house.add(wall)

// roof
const roof = new t.Mesh(
  new t.ConeGeometry(2, 1, 4),
  new t.MeshStandardMaterial({ color: 0xB35F45 }),
)
roof.position.y = 1
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// door
const door = new t.Mesh(
  new t.PlaneGeometry(1, 1, 100, 100),
  new t.MeshStandardMaterial({
    map: doorMaterial,
    transparent: true,
    alphaMap: doorAlphaMaterial,
    aoMap: doorAmbientMaterial,
    displacementMap: doorHeightMaterial,
    displacementScale: 0.1,
    normalMap: doorNormalMaterial,
    metalnessMap: doorMaterial,
    roughnessMap: doorRoughnessMaterial,
  }),
)
door.geometry.setAttribute(
  'uv2',
  new t.Float32BufferAttribute(door.geometry.attributes.uv.array, 2),
)
door.position.y = -0.10
door.position.z = 1
house.add(door)

// bushes
const bushGeometry = new t.SphereGeometry(1, 6, 6)
const bushMaterial = new t.MeshStandardMaterial({ color: 0x89C854 })

const bush1 = new t.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.3, 0.3, 0.3)
bush1.position.set(1.8, -0.4, -2)
const bush2 = new t.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.5, -0.4, 2)
const bush3 = new t.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(1.4, -0.2, 1.5)
const bush4 = new t.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.5, 0.5, 0.5)
bush4.position.set(-1.8, -0.3, 2.2)
house.add(bush1, bush2, bush3, bush4)

// grave
const grave = new t.Group()
scene.add(grave)

const tombStoneGeometry = new t.BoxGeometry(0.4, 0.6, 0.15)
const tombStoneMaterial = new t.MeshStandardMaterial({ color: 0xB2B6B1 })
for (let i = 0; i <= 50; i++) {
  const angle = Math.random() * Math.PI * 2
  const radius = 4 + Math.random() * 4
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius
  const tombStone = new t.Mesh(tombStoneGeometry, tombStoneMaterial)
  tombStone.position.set(x, -0.3, z)
  tombStone.rotation.y = (Math.random() - 0.5) * 0.4
  tombStone.rotation.z = (Math.random() - 0.5) * 0.4
  tombStone.rotation.x = (Math.random() - 0.5) * 0.2
  tombStone.castShadow = true
  grave.add(tombStone)
}
/**
 * door Light
 */
const doorLight = new t.PointLight(0xFF7D46, 1, 7)
doorLight.position.set(0, 0.5, 1.5)
scene.add(doorLight)

/**
 * Light
 */
const ambientLight = new t.AmbientLight(0xB9D5FF, 0.12)
scene.add(ambientLight)
const directLight = new t.DirectionalLight(0xB9D5FF, 0.12)
directLight.position.set(1, 2, 0)
scene.add(directLight)
const directLightHelper = new t.DirectionalLightHelper(directLight)
directLightHelper.visible = false
scene.add(directLightHelper)

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.1).name('ambientLight intensity')
gui.add(directLight, 'intensity').min(0).max(1).step(0.1).name('directLight intensity')
gui.add(directLight.position, 'x').min(0).max(5).step(1).name('directLight x')
gui.add(directLight.position, 'y').min(0).max(5).step(1).name('directLight y')
gui.add(directLight.position, 'z').min(0).max(5).step(1).name('directLight z')
gui.add(directLightHelper, 'visible')
/**
 * Object
 */
const plan = new t.Mesh(
  new t.PlaneGeometry(20, 20),
  new t.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  }),
)
plan.geometry.setAttribute(
  'uv2',
  new t.Float32BufferAttribute(plan.geometry.attributes.uv.array, 2),
)
plan.rotation.x = -Math.PI * 0.5
plan.position.y = -0.501
scene.add(plan)

/**
 * ghosts
 */
const ghost1 = new t.PointLight(0xFF00FF, 0.5, 7)
const ghost2 = new t.PointLight(0x00FFFF, 0.3, 7)
const ghost3 = new t.PointLight(0xFFFFFF, 0.6, 7)
scene.add(ghost1, ghost2, ghost3)

const SIZE = {
  width: window.innerWidth,
  height: window.innerHeight - 130,
}
const PROPOTION = SIZE.width / SIZE.height

const camera = new t.PerspectiveCamera(75, PROPOTION)
camera.position.z = 4.3
camera.position.y = 1
camera.position.x = 2

const renderer = new t.WebGLRenderer()
renderer.setSize(SIZE.width, SIZE.height)
renderer.setClearColor(0x000, 1)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x262837)

renderer.shadowMap.enabled = true
renderer.shadowMap.type = t.PCFSoftShadowMap

doorLight.castShadow = true
directLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

wall.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

plan.receiveShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

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

const clock = new t.Clock() // 从初始化时就开始运行
// animate()
const animate = () => {
  stats.begin() // 帧率显示器
  controls.update() // 鼠标控制
  const elapsedTime = clock.getElapsedTime() // 得到过去的时间，返回的是秒

  const ghost1Angle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y = Math.sin(elapsedTime * 3)

  const ghost2Angle = -elapsedTime * 0.32
  ghost2.position.x = Math.cos(ghost2Angle) * 5
  ghost2.position.z = Math.sin(ghost2Angle) * 5
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

  const ghost3Angle = elapsedTime * 0.18
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
  ghost3.position.y = Math.sin(ghost3Angle * 5) + Math.sin(elapsedTime * 2)
  renderer.render(scene, camera) // 重新渲染渲染器也就是让渲染器拍照记录物体新的位置
  stats.end()// 帧率显示器
  requestAnimationFrame(animate)// 调用动画渲染60帧/s的显示屏
}
animate() // 调用动画函数
</script>

<template>
  <div id="crown" />
</template>
