/**
 * 网络请求封装（基于 uni.request）
 * 统一处理请求头、错误、业务码
 */

// 后端网关地址由构建环境注入，避免正式小程序继续请求 HTTP 测试地址。
const BASE_URL = (import.meta.env.VITE_APP_BASE_API || 'http://127.0.0.1:9112').replace(/\/$/, '')
const PLATFORM_PREFIX = (import.meta.env.VITE_APP_PLATFORM_PREFIX || '').replace(/^([^/])/, '/$1').replace(/\/$/, '')

const TOKEN_KEY = 'rd_token'
const USER_INFO_KEY = 'rd_user_info'

function getToken() {
  try {
    return uni.getStorageSync(TOKEN_KEY) || ''
  } catch (e) {
    return ''
  }
}

function setToken(token) {
  try {
    uni.setStorageSync(TOKEN_KEY, token)
  } catch (e) {}
}

function removeToken() {
  try {
    uni.removeStorageSync(TOKEN_KEY)
  } catch (e) {}
}

/**
 * 业务请求封装
 * @param {Object} options
 * @param {string} options.url 业务路径（不含 /mall4cloud_platform 前缀）
 * @param {string} [options.method='POST']
 * @param {Object} [options.data]
 * @param {Object} [options.header]
 * @param {boolean} [options.noAuth=false] 免登录接口
 */
export function request(options) {
  const { url, method = 'POST', data, header = {}, noAuth = true } = options

  return new Promise((resolve, reject) => {
    const finalHeader = {
      'Content-Type': 'application/json',
      ...header
    }
    if (!noAuth) {
      const token = getToken()
      if (token) {
        finalHeader['Authorization'] = 'Bearer ' + token
      }
    }

    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: finalHeader,
      timeout: 15000,
      success: (res) => {
        const body = res.data || {}
        const successCode = body.code === '00000' || body.code === 0 || body.code === '0'
        if (res.statusCode >= 200 && res.statusCode < 300 && successCode) {
          resolve(body)
        } else if (res.statusCode === 401) {
          removeToken()
          reject(new Error(body.msg || body.message || '请求未授权，请稍后重试'))
        } else {
          const msg = body.msg || body.message || '请求失败'
          reject(new Error(msg))
        }
      },
      fail: (err) => {
        reject(new Error(err && err.errMsg ? err.errMsg : '网络异常'))
      }
    })
  })
}

export const http = {
  get: (url, data, opts = {}) => request({ url, method: 'GET', data, noAuth: true, ...opts }),
  post: (url, data, opts = {}) => request({ url, method: 'POST', data, noAuth: true, ...opts })
}

export function getStoredToken() {
  return getToken()
}

export function saveToken(token) {
  setToken(token)
}

export function clearToken() {
  removeToken()
}

export { BASE_URL, PLATFORM_PREFIX, TOKEN_KEY, USER_INFO_KEY }
