<script setup lang="ts">
import * as t from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
/**
 * gui
 */
// const gui = new dat.GUI({ closed: true, width: 400 }) // 设置关闭与宽度

const scene = new t.Scene()
/**
 * texture loader
 */
const textLoader = new t.TextureLoader()
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new t.CubeTextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof t.Mesh && child.material instanceof t.MeshStandardMaterial) {
      child.material.envMapIntensity = 1
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  new URL('../assets/textures/environmentMaps/5/px.jpg', import.meta.url).href,
  new URL('../assets/textures/environmentMaps/5/nx.jpg', import.meta.url).href,
  new URL('../assets/textures/environmentMaps/5/py.jpg', import.meta.url).href,
  new URL('../assets/textures/environmentMaps/5/ny.jpg', import.meta.url).href,
  new URL('../assets/textures/environmentMaps/5/pz.jpg', import.meta.url).href,
  new URL('../assets/textures/environmentMaps/5/nz.jpg', import.meta.url).href,
])
environmentMap.encoding = t.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Material
 */

// Textures
const mapTexture = textLoader.load(new URL('../assets/models/LeePerrySmith/color.jpg', import.meta.url).href)
mapTexture.encoding = t.sRGBEncoding

const normalTexture = textLoader.load(new URL('../assets/models/LeePerrySmith/normal.jpg', import.meta.url).href)

// Material
const material = new t.MeshStandardMaterial({
  map: mapTexture,
  normalMap: normalTexture,
})

const depthMaterial = new t.MeshDepthMaterial({
  depthPacking: t.RGBADepthPacking,
})

const customUniforms = {
  uTime: {
    value: 0,
  },
}
material.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
        #include <common>

        uniform float uTime;

        mat2 get2dRotateMatrix(float _angle)
        {
            return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
        }
        `,
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <beginnormal_vertex>',
    `
        #include <beginnormal_vertex>

        float angle = (position.y + uTime)* 0.2;

        mat2 rotateMatrix = get2dRotateMatrix(angle);

        objectNormal.xz = objectNormal.xz * rotateMatrix;
    `,
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
        #include <begin_vertex>

        transformed.xz = transformed.xz * rotateMatrix;
    `,
  )
}

depthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
        #include <common>

        uniform float uTime;

        mat2 get2dRotateMatrix(float _angle)
        {
            return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
        }
        `,
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
        #include <begin_vertex>

        float angle = (position.y + uTime)* 0.2;

        mat2 rotateMatrix = get2dRotateMatrix(angle);

        transformed.xz = transformed.xz * rotateMatrix;
    `,
  )
}

/**
 * Models
 */
gltfLoader.load(
  new URL('../assets/models/LeePerrySmith/LeePerrySmith.glb', import.meta.url).href,
  (gltf) => {
    // Model
    const mesh = gltf.scene.children[0] as t.Mesh
    mesh.rotation.y = Math.PI * 0.5
    mesh.material = material
    mesh.customDepthMaterial = depthMaterial
    scene.add(mesh)

    // Update materials
    updateAllMaterials()
  },
)

const plane = new t.Mesh(
  new t.PlaneGeometry(15, 15, 15),
  new t.MeshStandardMaterial(),
)
plane.rotation.y = Math.PI
plane.position.y = -5
plane.position.z = 5
scene.add(plane)
/**
 * Lights
 */
const directionalLight = new t.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, -2.25)
scene.add(directionalLight)

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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = t.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = t.sRGBEncoding
renderer.toneMapping = t.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(SIZE.width, SIZE.height)
renderer.setClearColor(0x000, 1)
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

const clock = new t.Clock() // 从初始化时就开始运行
// animate()
const animate = () => {
  stats.begin() // 帧率显示器
  controls.update() // 鼠标控制
  const elapsedTime = clock.getElapsedTime() // 得到过去的时间，返回的是秒
  // TODO
  customUniforms.uTime.value = elapsedTime
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
