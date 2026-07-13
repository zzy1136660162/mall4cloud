import { http, PLATFORM_PREFIX } from '../http'

function unwrapData(response) {
  return response && Object.prototype.hasOwnProperty.call(response, 'data')
    ? response.data
    : response
}

export function getTalentList(params = {}) {
  return http.get(`${PLATFORM_PREFIX}/ua/talent_pool/list`, params, { noAuth: true })
    .then((response) => {
      const data = unwrapData(response)
      if (!Array.isArray(data)) throw new Error('人才库数据格式异常')
      return data
    })
}

export function getTalentDetail(id) {
  return http.get(`${PLATFORM_PREFIX}/ua/talent_pool/detail/${encodeURIComponent(id)}`, {}, { noAuth: true })
    .then((response) => {
      const data = unwrapData(response)
      if (!data || typeof data !== 'object') throw new Error('未查询到专家信息')
      return data
    })
}
