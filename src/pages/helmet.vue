<script setup lang="ts">
import * as t from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
/**
 * gui
 */
// const gui = new dat.GUI({ closed: true, width: 400 }) // 设置关闭与宽度

const scene = new t.Scene()
/**
 * texture loader
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new t.CubeTextureLoader()
const textureLoader = new t.TextureLoader()
/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof t.Mesh && child.material instanceof t.MeshStandardMaterial) {
      child.material.envMapIntensity = 2.5
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

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
  new URL('../assets/models/DamagedHelmet/glTF/DamagedHelmet.gltf', import.meta.url).href,
  (gltf) => {
    // Model
    gltf.scene.scale.set(2, 2, 2)
    gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene)

    // Update materials
    updateAllMaterials()
  },
)

/**
 * Lights
 */
const directionalLight = new t.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, -2.25)
scene.add(directionalLight)

const SIZE = {
  width: window.innerWidth,
  height: window.innerHeight - 130,
}
const PROPOTION = SIZE.width / SIZE.height

const camera = new t.PerspectiveCamera(75, PROPOTION)
camera.position.z = 5
camera.position.y = 0
camera.position.x = 7

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

/**
 * Post processing
 */
// Render target
const renderTarget = new t.WebGLRenderTarget(
  800,
  600,
  {
    minFilter: t.LinearFilter,
    magFilter: t.LinearFilter,
    format: t.RGBAFormat,
    encoding: t.sRGBEncoding,
  },
)

const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(SIZE.width, SIZE.height)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

const glitchPass = new GlitchPass()
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
effectComposer.addPass(rgbShiftPass)

const unrealBloomPass = new UnrealBloomPass(new t.Vector2(SIZE.width, SIZE.height), 1.5, 0.4, 0.85)
unrealBloomPass.enabled = false
effectComposer.addPass(unrealBloomPass)

const TintShader = {
  uniforms: {
    tDiffuse: { value: null },
    uNormalMap: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;
    void main()
    {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        vUv = uv;
    }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D uNormalMap;

    varying vec2 vUv;

    void main()
    {
      vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
      vec2 newUv = vUv + normalColor.xy * 0.1;
      vec4 color = texture2D(tDiffuse, newUv);

      vec3 lightDirection = normalize(vec3(- 1.0, 1.0, 0.0));
      float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
      color.rgb += lightness * 2.0;

      gl_FragColor = color;
    }`,
}

const tintPass = new ShaderPass(TintShader)
tintPass.material.uniforms.uNormalMap.value = textureLoader.load(new URL('../assets/textures/interfaceNormalMap.png', import.meta.url).href)
effectComposer.addPass(tintPass)

const smaaPass = new SMAAPass(SIZE.width, SIZE.height)
effectComposer.addPass(smaaPass)

// 帧率显示器
const stats = statsPanel('helmet', 0, { top: 53 })
onMounted(() => {
  document.getElementById('helmet')!.appendChild(renderer.domElement)
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
  // TODO
  renderer.render(scene, camera) // 重新渲染渲染器也就是让渲染器拍照记录物体新的位置
  effectComposer.render()
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
  <div id="helmet">
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
