import Cookies from 'js-cookie'

interface Options {
  days?: number,
  domain?: string
}
const hostUri = '//test.app.com'

const getDomain = (domain:string) => `${domain.split('.').slice(-2)
  .join('.')}`

const defaultOptions: {[key: string]: any} = {
  expires: 365,
  domain: getDomain(window.location.hostname),
  path: '/'
}

// 只对 test.app.com 工程做处理
if (hostUri.includes(defaultOptions.domain)) {
  // Chrome 80版本后将SameSite属性默认值由None变为Lax
  // 导致sea后台iframe方式获取cookie失效
  defaultOptions.SameSite = 'None'
  // 必须同时设置Secure属性（Cookie 只能通过 HTTPS 协议发送），否则无效
  defaultOptions.secure = true
}

const CookieUtils = {

  removeItem(name:string, options:Options = defaultOptions): boolean {
    try {
      Cookies.remove(name, options)
      return true
    } catch (error) {
      return false
    }
  },
  clear(options:Options = defaultOptions): boolean {
    try {
      Object.keys(Cookies.get()).forEach((cookieName: string) => {
        Cookies.remove(cookieName, options)
      })
      return true
    } catch (error) {
      return false
    }
  },
  setItem(name: string, value: any, options:Options = defaultOptions): boolean {
    try {
      Cookies.set(name, value, options)
      return true
    } catch (error) {
      return false
    }
  },

  getItem(name:string): boolean | string | null {
    try {
      return Cookies.get(name) || null
    } catch (error) {
      return false
    }
  }
}

export default CookieUtils
