import Stats from 'stats.js'
/**
 * @param type 0:fps, 1: ms, 2: mb, 3+: custom
 * @param position top, right, bottom, left
 * @param target #id
 */
interface Position {
  top?: number | undefined
  right?: number | undefined
  bottom?: number | undefined
  left?: number | undefined
}
export function statsPanel(target: string, type: number, position: Position) {
  const stats = new Stats()
  stats.showPanel(type)
  stats.dom.style.position = 'absolute'
  stats.dom.style.top = position.top ? `${position.top}px` : ''
  stats.dom.style.right = position.right ? `${position.right}px` : ''
  stats.dom.style.bottom = position.bottom ? `${position.bottom}px` : ''
  stats.dom.style.left = position.left ? `${position.left}px` : ''
  onMounted(() => document.getElementById(target)!.appendChild(stats.dom))
  return stats
}
