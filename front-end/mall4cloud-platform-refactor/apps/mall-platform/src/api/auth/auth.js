import request from '@/api/index'

export function login (data) {
  return request({
    url: '/mall4cloud_auth/ua/login',
    method: 'post',
    data
  })
}

export function logout () {
  return request({
    url: '/mall4cloud_auth/login_out',
    method: 'post'
  })
}
