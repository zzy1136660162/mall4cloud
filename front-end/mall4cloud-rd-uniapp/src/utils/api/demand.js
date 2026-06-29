/**
 * 研发需求相关接口
 */
import { http } from '../http'

// mall4cloud-platform 模块路径
const PLATFORM_PREFIX = '/mall4cloud_platform'

/**
 * 免登录提交研发需求
 * @param {Object} payload 需求数据
 * @returns {Promise<{id:number, demandNo:string}>}
 */
export function submitDemand(payload) {
  return http.post(`${PLATFORM_PREFIX}/ua/demand/submit`, payload, { noAuth: true })
        .then((res) => {
          if (res && typeof res === 'object') {
            if (res.data) return res.data
            return res
          }
          return null
        })
}
