/**
 * function: verify when window has been changed
 * @param size include: width, height
 * @param offset selectable: xoffset, yoffset
 * @param target #id
 */
interface SIZE {
  width: number
  height: number
}
interface OFFSET {
  xoffset?: number | undefined
  yoffset?: number | undefined
}
export function WinResize(size: SIZE, camera: any, renderer: any, offset?: OFFSET): void {
  useEventListener(window, 'resize', () => {
    // 更新窗口大小
    size.width = window.innerWidth - (offset?.xoffset ?? 0)
    size.height = window.innerHeight - (offset?.yoffset ?? 0)

    // 更新照相机
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()

    // 重新渲染画布大小
    renderer.setSize(size.width, size.height)

    // 适应所有的屏幕像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}

/**
 * FullScreen
 */
export const setFullScreen = (canvas: HTMLElement) => {
  // @ts-expect-error
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
  if (fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
    else {
      // @ts-expect-error
      document.webkitExitFullscreen()
    }
  }
  else {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    }
    else {
      // @ts-expect-error
      canvas.webkitRequestFullscreen()
    }
  }
}

/**
 * double click to fullscreen
 */
export const dbClkfullScreen = (canvas: HTMLElement) => {
  window.addEventListener('dblclick', () => {
    setFullScreen(canvas)
  })
}
