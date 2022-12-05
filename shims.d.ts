import type { AttributifyAttributes } from '@unocss/preset-attributify'

declare module '@vue/runtime-dom' {
  interface HTMLAttributes extends AttributifyAttributes { }
}

declare module "*.glsl" {
  const value: string;
  export default value;
}
