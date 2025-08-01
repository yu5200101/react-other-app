import dayjs from '@/utils/dayjs'

const LocalStorageUtil = {
  removeItem(key: string): boolean {
    try {
      window.localStorage.removeItem(key)
      return true
    } catch (error) {
      return false
    }
  },

  clear(): boolean {
    try {
      window.localStorage.clear()
      return true
    } catch (error) {
      return false
    }
  },
  setItem(key: string, value: any): boolean {
    try {
      const valueData = {
        data: value,
        // 过期时间是7天
        expire: dayjs().add(7, 'day')
          .valueOf()
      }
      window.localStorage.setItem(key, JSON.stringify(valueData))
      return true
    } catch (error) {
      return false
    }
  },

  getItem(key: string): any {
    try {
      const value = window.localStorage.getItem(key)
      if (!value) return null
      const valueData = JSON.parse(value)
      if (Date.now() > valueData.expire) {
        this.removeItem(key)
        return null
      }
      return valueData.data
    } catch (error) {
      return null
    }
  },

  appendItem(key: string, value: any): boolean {
    try {
      const item = this.getItem(key)
      const newItem = { ...item, ...value }
      this.setItem(key, newItem)
      return true
    } catch (error) {
      return false
    }
  }
}

export default LocalStorageUtil
