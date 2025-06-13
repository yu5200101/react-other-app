
// px需要带单位传 传入 '10px' 否则原样返回过去
export const px2rem = (px: string) => {
  if (!px.includes('px')) return px
  const size = px.slice(0, px.length - 2)
  return `${parseFloat(size) / 75}rem`
}

interface QueryParams {
  [key: string]: string | number | any;
}

/**
 * @description: 将search对象转化为字符串
 * @param {QueryParams} search
 * @return {*}
 */
export const queryToString = (search:QueryParams):string => {
  const searchArr: string[] = []
  const keys = Object.keys(search)

  keys.forEach(key => {
    if (search[key] !== undefined) {
      searchArr.push(`${key}=${search[key]}`)
    }
  })

  return searchArr.join('&')
}

export const sleepTime = (time: number) => new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      resolve(undefined)
    }, time)
  } catch (err) {
    reject(err)
  }
})