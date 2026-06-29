/**
 * 网络请求封装（基于 uni.request）
 * 统一处理请求头、错误、业务码
 */

// 后端网关地址
// HBuilderX 本地调试可改为 LAN IP 或 远程测试地址
const BASE_URL = 'http://115.191.79.224:8000'

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
  const { url, method = 'POST', data, header = {}, noAuth = false } = options

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
        // 业务码约定：0 成功
        if (res.statusCode === 200 && (body.code === 0 || body.success || body.data !== undefined)) {
          resolve(body)
        } else if (res.statusCode === 401) {
          removeToken()
          uni.showToast({ title: '请先登录', icon: 'none' })
          reject(body)
        } else {
          const msg = body.msg || body.message || '请求失败'
          uni.showToast({ title: msg, icon: 'none' })
          reject(body)
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常', icon: 'none' })
        reject(err)
      }
    })
  })
}

export const http = {
  get: (url, data, opts = {}) => request({ url, method: 'GET', data, ...opts }),
  post: (url, data, opts = {}) => request({ url, method: 'POST', data, ...opts })
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

export { BASE_URL, TOKEN_KEY, USER_INFO_KEY }
