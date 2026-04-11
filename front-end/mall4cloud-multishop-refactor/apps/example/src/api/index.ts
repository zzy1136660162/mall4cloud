import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

const MAX_RETRY_COUNT = 3
const RETRY_DELAY = 1000

declare module 'axios' {
  export interface AxiosRequestConfig {
    retry?: boolean
    retryCount?: number
    fake?: boolean
  }
}

const request = axios.create({
  baseURL: (import.meta.env.DEV && import.meta.env.VITE_ENABLE_PROXY) ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL,
  timeout: 1000 * 60,
  responseType: 'json',
})

request.interceptors.request.use(
  (config) => {
    if (config.fake) {
      config.baseURL = '/fake/'
    }
    const appAccountStore = useAppAccountStore()
    if (config.headers) {
      config.headers['Accept-Language'] = 'zh-CN'
      config.headers['Content-Type'] = 'application/json'
      if (appAccountStore.isLogin) {
        config.headers.Authorization = appAccountStore.token
      }
    }
    return config
  },
)

function handleError(error: any) {
  if (error.status === 401) {
    useAppAccountStore().requestLogout()
  }
  else {
    faToast.error('Error', {
      description: error.message,
    })
  }
  return Promise.reject(error)
}

request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (typeof res === 'object') {
      if (res.success === true) {
        return Promise.resolve(res.data ?? res)
      }
      else if (res.success === false) {
        faToast.warning(res.msg || '请求失败', {
          description: Array.isArray(res.data) ? res.data.join(', ') : res.data,
        })
        return Promise.reject(res)
      }
      return Promise.resolve(res)
    }
    return Promise.resolve(response.data)
  },
  async (error) => {
    const config = error.config
    if (!config || !config.retry) {
      return handleError(error)
    }
    config.retryCount = config.retryCount || 0
    if (config.retryCount >= MAX_RETRY_COUNT) {
      return handleError(error)
    }
    config.retryCount += 1
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
    return request(config)
  },
)

const api = Object.assign(request, {
  get: <T = any>(config: any): Promise<T> => {
    return request(config)
  },
  post: <T = any>(url: string, data?: any, config?: any): Promise<T> => request({ ...config, url, method: 'POST', data }),
  put: <T = any>(url: string, data?: any, config?: any): Promise<T> => request({ ...config, url, method: 'PUT', data }),
  delete: <T = any>(url: string, config?: any): Promise<T> => request({ ...config, url, method: 'DELETE' }),
})

export default api
