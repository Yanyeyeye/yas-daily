/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />
/// <reference types="vue/macros-global" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

import { BufferGeometry } from 'three'
declare module 'three' {
  export interface BufferGeometry {
    tween?: any
  }
}
