import http from '@/utils/http.js'

const API_USER = '/mall4cloud_user/a'

export default {
  getTalentStatus() {
    return http.request({
      url: `${API_USER}/talent/status`,
      method: 'GET'
    })
  }
}
