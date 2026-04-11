import api from '@/api'

export function get(userId) {
  return api({
    url: '/mall4cloud_platform/sys_user/account',
    method: 'get',
    params: { userId },
  })
}

export function save(data) {
  return api({
    url: '/mall4cloud_platform/sys_user/account',
    method: 'post',
    data,
  })
}

export function update(data) {
  return api({
    url: '/mall4cloud_platform/sys_user/account',
    method: 'put',
    data,
  })
}
