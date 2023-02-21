<script setup lang="ts">
import * as t from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'

/**
 * gui
 */
// const gui = new dat.GUI({ closed: true, width: 400 }) // 设置关闭与宽度

const scene = new t.Scene()

const overlayGeometry = new t.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new t.ShaderMaterial(
  {
    transparent: true,
    uniforms: {
      uAlpha: {
        value: 1,
      },
    },
    vertexShader: `
      void main(){
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
    uniform float uAlpha;
      void main(){
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
      }
    `,
  },
)
const overlay = new t.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)
/**
 * texture loader
 */
// const textureLoader = new t.TextureLoader()
// const displacementTexture = textureLoader.load(
//   new URL('../assets/textures/displacementMap.png', import.meta.url).href)
const loadingBar = ref<HTMLDivElement | null>(null)
let sceneReady = false
const loadingManager = new t.LoadingManager(
  () => {
    gsap.delayedCall(0.5, () => {
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
      loadingBar.value!.classList.add('ended')
      loadingBar.value!.style.transform = ''
    })
    window.setTimeout(() => {
      sceneReady = true
    }, 2000)
  },
  (itemUrl, itemsLoaded, itemsTotal) => {
    const progressRatio = itemsLoaded / itemsTotal
    loadingBar.value!.style.transform = `scaleX(${progressRatio})`
  },
)
const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new t.CubeTextureLoader(loadingManager)

/**
 * Base
 */
// Debug
const debugObject = {
  envMapIntensity: 2.5,
}

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof t.Mesh && child.material instanceof t.MeshStandardMaterial) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

/**
 * Points of internet
 * */
const raycaster = new t.Raycaster()
const point_0 = ref<HTMLDivElement | null>(null)

const points = [{
  position: new t.Vector3(1.55, 0.3, -0.6),
  element: point_0,
}]

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  new URL('/textures/environmentMaps/5/px.jpg', import.meta.url).href,
  new URL('/textures/environmentMaps/5/nx.jpg', import.meta.url).href,
  new URL('/textures/environmentMaps/5/py.jpg', import.meta.url).href,
  new URL('/textures/environmentMaps/5/ny.jpg', import.meta.url).href,
  new URL('/textures/environmentMaps/5/pz.jpg', import.meta.url).href,
  new URL('/textures/environmentMaps/5/nz.jpg', import.meta.url).href,
])

environmentMap.encoding = t.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
  new URL('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', import.meta.url).href,
  (gltf) => {
    gltf.scene.scale.set(2.5, 2.5, 2.5)
    gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene)

    updateAllMaterials()
  },
)

/**
 * Lights
 */
const directionalLight = new t.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, -2.25)
scene.add(directionalLight)

const SIZE = {
  width: window.innerWidth,
  height: window.innerHeight - 130,
}
const PROPOTION = SIZE.width / SIZE.height

const camera = new t.PerspectiveCamera(75, PROPOTION, 0.1, 100)
camera.position.set(4, 1, -4)

const renderer = new t.WebGLRenderer({ antialias: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = t.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = t.sRGBEncoding
renderer.toneMapping = t.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(SIZE.width, SIZE.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor(0x262837)
// 设置自动检测大小
WinResize(SIZE, camera, renderer, { yoffset: 130 })

// 帧率显示器
const stats = statsPanel('three', 0, { top: 53 })
onMounted(() => {
  document.getElementById('three')!.appendChild(renderer.domElement)
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
  // console.log(points)
  // TODO
  if (sceneReady) {
    for (const point of points) {
    // console.log(points)
      const screenPosition = point.position.clone()
      screenPosition.project(camera)

      raycaster.setFromCamera(screenPosition, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      if (intersects.length === 0) {
        point.element.value!.classList.add('visible')
      }
      else {
        const intersectionDistance = intersects[0].distance
        const pointDistance = point.position.distanceTo(camera.position)
        if (intersectionDistance < pointDistance)
          point.element.value!.classList.remove('visible')
        else
          point.element.value!.classList.add('visible')
      }

      const translateX = screenPosition.x * SIZE.width * 0.5
      const translateY = screenPosition.y * SIZE.width * 0.5
      point.element.value!.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
    }
  }
  renderer.render(scene, camera) // 重新渲染渲染器也就是让渲染器拍照记录物体新的位置
  stats.end()// 帧率显示器
  requestAnimationFrame(animate)// 调用动画渲染60帧/s的显示屏
}
animate() // 调用动画函数

const router = useRouter()
const go = () => {
  router.push('/point')
}
</script>

<template>
  <div id="three">
    <div absolute bottom-20 right-5>
      <div btn h-10 @click="go">
        <div i-jam-helmet text-xl />
        <span font-bold pl-2>
          point
        </span>
      </div>
    </div>
  </div>
  <div
    ref="loadingBar" class="loading-bar"
  />
  <div ref="point_0" class="point">
    <div ref="label" class="label">
      1
    </div>
    <div ref="text" class="text">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit
    </div>
  </div>
</template>

<style scoped>
.loading-bar {
  position: absolute;
  top: 50%;
  width: 100%;
  height: 2px;
  background: #ffffff;
  transform: scaleX(0.3);
  transform-origin: top left;
  transition: transform 1.5s ease-in-out;
}
.ended {
    transform: scaleX(0);
    transform-origin: 100% 0;
    transition: transform 1.5s ease-in-out;
}
.point {
  position: absolute;
  top: 50%;
  left: 50%;
}

.point .label {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #00000077;
  border: 1px solid #ffffff77;
  color: #ffffff;
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
  line-height: 40px;
  font-weight: 100;
  font-size: 14px;
  cursor: help;
  transform: scale(0, 0);
  transition: transform 0.3s;
}

.point .text {
  position: absolute;
  top: 30px;
  left: -120px;
  width: 200px;
  padding: 20px;
  border-radius: 4px;
  background: #00000077;
  border: 1px solid #ffffff77;
  color: #ffffff;
  line-height: 1.3em;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 100;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.point:hover .text {
  opacity: 1;
}

.point.visible .label {
  transform: scale(1, 1);
}
</style>
