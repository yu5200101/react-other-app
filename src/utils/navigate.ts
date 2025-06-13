interface QueryParams {
  [key: string]: string | number | any;
}

// path信息
interface PathInfo {
  path: string
  search: QueryParams
  searchString: string
  hash: string,
  fullPath: string
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


/**
 * @description: 获取传入路由、或者当前路由中query的值
 * @param {string} path ,不传入则是当前 window.location.href
 * @param {QueryParams} setQuery,要设置的新query
 * @param {string} removeList,要删除的query
 * @return {*}
 */
export const getPathQuery = (path?:string, setQuery?:QueryParams, removeList?:string[]): QueryParams => {
  let { search } = window.location

  if (path) {
    // 处理hash，忽略hash后面的值
    path = path.indexOf('#') === -1 ? path : path.substring(0, path.indexOf('#'))
    // 如果存在?,那么截取问号后面的值,否则，直接用''
    search = path.indexOf('?') === -1 ? '' : path.substring(path.indexOf('?'))
  }

  const searchParams = new URLSearchParams(search)
  const paramsObject: QueryParams = {}

  for (const [key, value] of searchParams.entries()) {
    paramsObject[key] = value
  }

  if (setQuery) {
    Object.keys(setQuery).forEach(key => {
      // 覆盖参数有值或者原链接参数无值，才可覆盖
      if (setQuery[key] || !paramsObject[key]) paramsObject[key] = setQuery[key]
    })
  }

  if (removeList) {
    removeList.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(paramsObject, key)) {
        delete paramsObject[key]
      }
    })
  }

  return paramsObject
}

// 返回一个新的query对象，包含url中的query和当前页面的query，并且最后删除removeQuery中传入的key

/**
 * @description: 获取所有query，包括传入的 window.location.search < path.query < setQuery
 * @param {string} path
 * @param {QueryParams} setQuery
 * @param {Array} removeList
 * @return {*}
 */
export const getQuery = (path?:string, setQuery?: QueryParams, removeList?: string[]): QueryParams => {
  const currentQuery = getPathQuery('', setQuery, removeList)
  const pathQuery = getPathQuery(path, setQuery, removeList)
  const newQuery: QueryParams = { ...currentQuery, ...pathQuery }
  return newQuery
}

/**
 * @description: 获取传入路由，或者当前路由的path信息
 * @param {string} targetPath
 * @return {*}
 */
export const getPathInfo = (targetPath?:string, setQuery?:QueryParams, removeList?:string[]):PathInfo => {
  const path = targetPath || window.location.href
  const queryIndex = path.indexOf('?')
  const hashIndex = path.indexOf('#')
  const hash = hashIndex === -1 ? '' : path.substring(hashIndex + 1)
  let basePath = queryIndex === -1 ? path : path.substring(0, queryIndex)
  let oldSearchString = queryIndex === -1 ? '' : path.substring(queryIndex + 1)
  const search:QueryParams = {}

  // 删除hash
  basePath = basePath.replace(`#${hash}`, '')
  oldSearchString = oldSearchString.replace(`#${hash}`, '')

  const searchParams = new URLSearchParams(oldSearchString)
  for (const [key, value] of searchParams.entries()) {
    search[key] = value
  }

  // 合并
  Object.assign(search, setQuery || {})

  if (removeList) {
    removeList.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(search, key)) {
        delete search[key]
      }
    })
  }

  // 构建新的searchString
  const newSearchString = queryToString(search)
  // 构建新的fullPath
  let fullPath = basePath

  if (newSearchString) {
    fullPath += `?${newSearchString}`
  }

  if (hash) {
    fullPath += `#${hash}`
  }

  return {
    path: basePath,
    search,
    searchString: newSearchString,
    hash,
    fullPath
  }
}

/**
 * @description: 创建path,新的path将挂载所有可收集的search参数，优先级，window.location.search < path.query < setQuery < removeList
 * @param {string} path,基础路径
 * @param {QueryParams} setQuery，新增的query
 * @param {string} removeList,要删除的 query
 * @return {*}
 */
export const createPathInfo = (path:string, setQuery?: QueryParams, removeList?: string[]):PathInfo => {
  const pathInfo = getPathInfo(path)
  const search = getQuery(path, setQuery, removeList)
  const searchString = queryToString(search)
  let fullPath = `${pathInfo.path}`

  if (searchString) {
    fullPath += `?${searchString}`
  }

  if (pathInfo.hash) {
    fullPath += `#${pathInfo.hash}`
  }

  return {
    path: pathInfo.path,
    search: search,
    searchString,
    hash: pathInfo.hash,
    fullPath
  }
}

// window.location.href 根据createPath返回的url跳转
export const locationHref = (path: string, setQuery?: QueryParams, removeQuery?: string[]): void => {
  const pathInfo = createPathInfo(path, setQuery, removeQuery)
  window.location.href = pathInfo.fullPath
}

// window replace
export const locationReplace = (path: string, setQuery?: QueryParams, removeQuery?: string[]): void => {
  const pathInfo = createPathInfo(path, setQuery, removeQuery)

  window.location.replace(pathInfo.fullPath)
}

interface PushOpt {
  pathname: string,
  search: string
}
// useNavigate的push方法
export const getPushOpt = (path: string, setQuery?: QueryParams, removeQuery?: string[]): PushOpt => {
  const pathInfo = createPathInfo(path, setQuery, removeQuery)
  return {
    pathname: pathInfo.path,
    search: `?${pathInfo.searchString}`
  }
}
type ReplaceOpt = Array<PushOpt | { replace: boolean }>
// useNavigate的replace方法
export const getReplaceOpt = (path: string, setQuery?: QueryParams, removeQuery?: string[]): ReplaceOpt => {
  const pathInfo = createPathInfo(path, setQuery, removeQuery)
  return [{
      pathname: pathInfo.path,
      search: `?${pathInfo.searchString}`
    }, {
      replace: true
    }
  ]
}

export default {
  queryToString,
  getPathQuery,
  getQuery,
  getPathInfo,
  createPathInfo,
  locationHref,
  locationReplace,
  getPushOpt,
  getReplaceOpt
}
