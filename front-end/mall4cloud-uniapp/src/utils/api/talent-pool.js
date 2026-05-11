import http from '@/utils/http.js'

export default {
  getList(params) {
    return http.request({
      url: '/mall4cloud_platform/ua/talent_pool/list',
      method: 'GET',
      data: params
    })
  },

  getDetail(id) {
    return http.request({
      url: `/mall4cloud_platform/ua/talent_pool/detail/${id}`,
      method: 'GET'
    })
  }
}
