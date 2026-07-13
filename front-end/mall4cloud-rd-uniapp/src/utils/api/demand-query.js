import { http, PLATFORM_PREFIX } from '../http'

export function queryDemand(demandNo, submitterPhone) {
  return http.get(`${PLATFORM_PREFIX}/ua/demand/query`, {
    demandNo,
    submitterPhone
  }, { noAuth: true }).then((response) => {
    if (!response || !Object.prototype.hasOwnProperty.call(response, 'data')) return null
    const data = response.data
    return data && typeof data === 'object' ? data : null
  })
}
