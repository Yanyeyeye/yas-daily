import { useAxios } from '@vueuse/integrations/useAxios'

// have some trouble with the data deprecated now
export function use8486BusData() {
  interface SearchData {
    city: string
    line?: number
  }

  const CITY = 'shaoxing'
  const parser = new DOMParser()
  const { execute } = useAxios()
  const BusData = $ref<Array<string>>([])

  async function getBusLine(search: SearchData) {
    const n = await getLineCount(search.city)
    if (!n) { alert('数据获取出错，请重试') }
    else {
      for (let i = 1; i <= n!; i++) {
        const { data } = await execute(`https://${search.city}.8684.cn/city1.php?t=38%2Fpp${i}`)
        BusData.push(...data.value.split(','))
      }
    }
  }

  async function getLineCount(city: string) {
    const { data: documentLine, error } = await execute(`https://${city}.8684.cn`)
    if (!error)
      return false
    else
      return parser.parseFromString(documentLine.value, 'text/html')?.querySelector('div.bus-layer')?.childNodes[2].lastChild?.childNodes.length
  }

  function init() {
    getBusLine({
      city: CITY,
    })
  }

  onMounted(() => {
    init()
  })

  return { BusData }
}

