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
export function WinResize(size: SIZE, offset: OFFSET, camera: any, renderer: any): void {
  useEventListener(window, 'resize', () => {
    // 更新窗口大小
    size.width = window.innerWidth - (offset.xoffset ?? 0)
    size.height = window.innerHeight - (offset.yoffset ?? 0)

    // 更新照相机
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()

    // 重新渲染画布大小
    renderer.setSize(size.width, size.height)

    // 适应所有的屏幕像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}
